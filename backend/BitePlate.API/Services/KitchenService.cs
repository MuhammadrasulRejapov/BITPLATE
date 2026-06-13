using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using BitePlate.API.Domain.Enums;
using BitePlate.API.Patterns.Command;
using BitePlate.API.Patterns.Observer;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Services;

public sealed class KitchenService(AppDbContext db, KitchenCommandInvoker invoker, OrderEventBus eventBus)
{
    private static readonly Dictionary<OrderStatus, OrderStatus> NextStatus = new()
    {
        [OrderStatus.Pending]   = OrderStatus.Preparing,
        [OrderStatus.Preparing] = OrderStatus.Ready,
        [OrderStatus.Ready]     = OrderStatus.Served,
    };

    public async Task<List<Order>> GetQueueAsync() =>
        await db.Orders
            .Where(o => o.Status != OrderStatus.Served)
            .OrderBy(o => o.Time)
            .ToListAsync();

    public async Task<Order> AdvanceStatusAsync(string orderId)
    {
        var order = await db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException($"Order {orderId} not found.");

        if (!NextStatus.TryGetValue(order.Status, out var next))
            throw new InvalidOperationException($"Order {orderId} is already in final state.");

        // Command pattern: use PrepareOrderCommand for Pending→Preparing (brief-required class),
        // UpdateOrderStatusCommand for all subsequent transitions.
        ICommand cmd = order.Status == OrderStatus.Pending
            ? new PrepareOrderCommand(db, orderId)
            : new UpdateOrderStatusCommand(db, orderId, next);
        invoker.Execute(cmd);

        var updated = await db.Orders.FindAsync(orderId) ?? order;
        var eventType = updated.Status == OrderStatus.Ready ? "OrderReady" : "OrderStatusChanged";
        eventBus.Publish(eventType, updated);
        return updated;
    }

    public string? UndoLast() => invoker.Undo();

    public async Task<Order> CancelOrderAsync(string orderId)
    {
        var order = await db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException($"Order {orderId} not found.");

        var snapshot = new Order
        {
            Id = order.Id, TableNumber = order.TableNumber, Time = order.Time,
            Status = order.Status, Waiter = order.Waiter, Items = order.Items
        };

        // Command pattern: CancelOrderCommand handles DB removal + history + table freeing
        var cmd = new CancelOrderCommand(db, orderId);
        invoker.Execute(cmd);
        eventBus.Publish("OrderCancelled", snapshot);
        return snapshot;
    }
}
