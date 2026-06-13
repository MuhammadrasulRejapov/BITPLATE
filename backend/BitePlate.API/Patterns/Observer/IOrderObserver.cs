using BitePlate.API.Domain.Entities;

namespace BitePlate.API.Patterns.Observer;

/// <summary>
/// Observer pattern — decouples event producers (OrderService) from consumers
/// (kitchen display, waiter notification).
/// </summary>
public interface IOrderObserver
{
    string ObserverId { get; }
    void OnOrderEvent(OrderEvent evt);
}

public record OrderEvent(string EventType, Order Order, string? Extra = null);
