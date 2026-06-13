using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using BitePlate.API.Domain.Enums;
using BitePlate.API.Patterns.Singleton;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Patterns.Command;

public sealed class CancelOrderCommand : ICommand
{
    private readonly AppDbContext _db;
    private readonly string _orderId;
    private Order? _cancelled;

    public CancelOrderCommand(AppDbContext db, string orderId)
    {
        _db = db;
        _orderId = orderId;
    }

    public string Description => $"Cancel order {_orderId}";

    public void Execute()
    {
        _cancelled = _db.Orders.Find(_orderId);
        if (_cancelled is null) return;

        _db.Orders.Remove(_cancelled);

        var entry = new HistoryEntry
        {
            Id = _cancelled.Id, TableNumber = _cancelled.TableNumber,
            Waiter = _cancelled.Waiter,
            Total = _cancelled.Items.Sum(i => (i.Price + i.Addons.Sum(a => a.Price)) * i.Qty),
            Status = "Cancelled", Timestamp = DateTime.UtcNow,
            PaymentMethod = null,
            Items = _cancelled.Items.Select(i => $"{i.Name} x{i.Qty}").ToList(),
            Discount = 0, Tip = 0
        };
        _db.HistoryEntries.Add(entry);

        // Free the table if no other orders exist for it
        var hasOtherOrders = _db.Orders
            .Any(o => o.Id != _orderId && o.TableNumber == _cancelled.TableNumber);

        if (!hasOtherOrders)
        {
            var table = _db.Tables.FirstOrDefault(t => t.Number == _cancelled.TableNumber);
            if (table is not null)
            {
                table.Status = TableStatus.Free;
                table.CurrentGuests = 0;
                table.WaiterName = null;
                table.OccupiedSince = null;
            }
        }

        _db.SaveChanges();

        // Singleton: write to in-memory audit log as well
        OrderHistoryLog.Instance.Append(entry);
    }

    public void Undo()
    {
        if (_cancelled is null) return;
        _db.Orders.Add(_cancelled);
        _db.SaveChanges();
    }
}
