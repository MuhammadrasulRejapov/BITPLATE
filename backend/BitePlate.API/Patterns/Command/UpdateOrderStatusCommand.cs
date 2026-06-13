using BitePlate.API.Data;
using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Patterns.Command;

public sealed class UpdateOrderStatusCommand : ICommand
{
    private readonly AppDbContext _db;
    private readonly string _orderId;
    private readonly OrderStatus _newStatus;
    private OrderStatus _previousStatus;

    public UpdateOrderStatusCommand(AppDbContext db, string orderId, OrderStatus newStatus)
    {
        _db = db;
        _orderId = orderId;
        _newStatus = newStatus;
    }

    public string Description => $"Set order {_orderId} → {_newStatus}";

    public void Execute()
    {
        var order = _db.Orders.Find(_orderId)
            ?? throw new InvalidOperationException($"Order {_orderId} not found.");
        _previousStatus = order.Status;
        order.Status = _newStatus;
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
