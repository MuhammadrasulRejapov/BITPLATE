using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using BitePlate.API.Domain.Enums;
using BitePlate.API.Patterns.Observer;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Services;

public sealed class OrderService(AppDbContext db, OrderEventBus eventBus)
{
    public async Task<List<Order>> GetAllAsync() =>
        await db.Orders.ToListAsync();

    public async Task<Order> GetAsync(string id) =>
        await db.Orders.FindAsync(id)
        ?? throw new KeyNotFoundException($"Order {id} not found.");

    public async Task<Order?> GetActiveByTableAsync(int tableNumber) =>
        await db.Orders.FirstOrDefaultAsync(o =>
            o.TableNumber == tableNumber && o.Status != OrderStatus.Served);

    public async Task<string> CreateAsync(int tableNumber, List<OrderItem> items, string waiter)
    {
        // Auto-increment ID based on max existing
        var maxNum = await db.Orders
            .Select(o => o.Id)
            .ToListAsync()
            .ContinueWith(t => t.Result
                .Select(id => int.TryParse(id.Replace("ORD-",""), out var n) ? n : 0)
                .DefaultIfEmpty(45)
                .Max());

        var id = $"ORD-{maxNum + 1:D3}";
        var time = DateTime.Now.ToString("HH:mm");

        var order = new Order
        {
            Id = id, TableNumber = tableNumber, Time = time,
            Status = OrderStatus.Pending, Waiter = waiter, Items = items
        };
        db.Orders.Add(order);

        // State: mark table Occupied if it was Free or Reserved
        var table = await db.Tables.FirstOrDefaultAsync(t => t.Number == tableNumber);
        if (table is { Status: TableStatus.Free or TableStatus.Reserved })
        {
            table.Status = TableStatus.Occupied;
            table.OccupiedSince = time;
        }

        await db.SaveChangesAsync();
        eventBus.Publish("NewOrder", order);
        return id;
    }

    public IReadOnlyList<OrderEvent> PollEvents() => eventBus.DrainEvents();
}
