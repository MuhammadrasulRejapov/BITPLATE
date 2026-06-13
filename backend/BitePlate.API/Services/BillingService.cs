using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using BitePlate.API.Domain.Enums;
using BitePlate.API.Patterns.Facade;
using BitePlate.API.Patterns.Iterator;
using BitePlate.API.Patterns.Singleton;
using BitePlate.API.Patterns.State;
using BitePlate.API.Patterns.Strategy;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Services;

public sealed class BillingService(AppDbContext db)
{
    private readonly BillingFacade _facade = new();

    public async Task<BillResult> PreviewAsync(string orderId, string strategyName, decimal tip, int splitCount = 1)
    {
        var order = await db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException($"Order {orderId} not found.");
        return _facade.ProcessPayment(order, PricingStrategyFactory.GetStrategy(strategyName), tip, splitCount);
    }

    public async Task<HistoryEntry> CloseBillAsync(string orderId, string strategyName,
        decimal tip, string paymentMethod, int splitCount = 1)
    {
        var order = await db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException($"Order {orderId} not found.");

        var bill = _facade.ProcessPayment(order, PricingStrategyFactory.GetStrategy(strategyName), tip, splitCount);

        // Look up the staff ID from the database using the waiter's display name
        var staffUser = await db.Users.FirstOrDefaultAsync(u => u.DisplayName == order.Waiter);

        var entry = new HistoryEntry
        {
            Id            = order.Id,
            TableNumber   = order.TableNumber,
            Waiter        = order.Waiter,
            StaffId       = staffUser?.Id.ToString() ?? order.Waiter,
            Total         = bill.Total,
            Status        = "Closed",
            Timestamp     = DateTime.UtcNow,
            PaymentMethod = paymentMethod,
            Items         = order.Items.Select(i => $"{i.Name} x{i.Qty}").ToList(),
            Discount      = bill.DiscountRate,
            FreeDrinkValue = bill.FreeDrinkValue,
            Tip           = tip
        };

        db.HistoryEntries.Add(entry);
        db.Orders.Remove(order);

        // State: transition table to Cleared
        var table = await db.Tables.FirstOrDefaultAsync(t => t.Number == order.TableNumber);
        if (table is not null)
        {
            var ctx = new TableContext(table);
            ctx.CloseBill();
        }

        await db.SaveChangesAsync();

        // Singleton: also write to in-memory audit log
        OrderHistoryLog.Instance.Append(entry);

        return entry;
    }

    public async Task<List<HistoryEntry>> GetHistoryAsync(DateTime? from = null, DateTime? to = null, int? tableNumber = null)
    {
        // Persist DB entries into the Singleton log so the Iterator can traverse them
        var dbEntries = await db.HistoryEntries
            .OrderByDescending(h => h.Timestamp)
            .ToListAsync();
        OrderHistoryLog.Instance.SeedBulk(dbEntries);

        // Iterator pattern: traverse without exposing the underlying collection
        var iterator = new FilteredHistoryIterator(from, to);
        return iterator.ToList();
    }

    public async Task<object> GetEndOfNightReportAsync()
    {
        var today = DateTime.UtcNow.Date;
        var dbEntries = await db.HistoryEntries
            .Where(h => h.Timestamp >= today)
            .OrderByDescending(h => h.Timestamp)
            .ToListAsync();
        OrderHistoryLog.Instance.SeedBulk(dbEntries);

        var iterator = new FilteredHistoryIterator(today, DateTime.UtcNow);
        var entries  = iterator.ToList();

        return new
        {
            Date      = today,
            Total     = entries.Where(e => e.Status == "Closed").Sum(e => e.Total),
            Closed    = entries.Count(e => e.Status == "Closed"),
            Cancelled = entries.Count(e => e.Status == "Cancelled"),
            Entries   = entries
        };
    }
}
