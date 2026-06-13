using BitePlate.API.Data;
using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Patterns.Command;

/// <summary>
/// Command pattern — encapsulates the Pending → Preparing kitchen action.
/// Supports undo: reverts the order back to Pending if execution is reversed.
/// </summary>
public sealed class PrepareOrderCommand : ICommand
{
    private readonly AppDbContext _db;
    private readonly string _orderId;
    private OrderStatus _previousStatus;

    public PrepareOrderCommand(AppDbContext db, string orderId)
    {
        _db = db;
        _orderId = orderId;
    }

    public string Description => $"Prepare order {_orderId} (Pending → Preparing)";

    public void Execute()
    {
        var order = _db.Orders.Find(_orderId)
            ?? throw new InvalidOperationException($"Order {_orderId} not found.");

        if (order.Status != OrderStatus.Pending)
            throw new InvalidOperationException(
                $"PrepareOrderCommand requires Pending status; current status is {order.Status}.");

        _previousStatus = order.Status;
        order.Status = OrderStatus.Preparing;
        _db.SaveChanges();
    }

    public void Undo()
    {
        var order = _db.Orders.Find(_orderId);
        if (order is not null)
        {
            order.Status = _previousStatus;
            _db.SaveChanges();
        }
    }
}
