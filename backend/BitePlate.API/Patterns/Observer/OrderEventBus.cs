using BitePlate.API.Domain.Entities;

namespace BitePlate.API.Patterns.Observer;

/// <summary>
/// Subject in the Observer pattern.
/// Registered as Singleton so all services publish to and consume from the same bus.
/// Also acts as an in-process notification queue for the polling endpoint.
/// </summary>
public sealed class OrderEventBus
{
    private readonly List<IOrderObserver> _observers = [];
    private readonly Queue<OrderEvent> _pendingEvents = new();
    private readonly object _lock = new();

    public void Subscribe(IOrderObserver observer)
    {
        lock (_lock)
        {
            if (_observers.All(o => o.ObserverId != observer.ObserverId))
                _observers.Add(observer);
        }
    }

    public void Unsubscribe(string observerId)
    {
        lock (_lock)
            _observers.RemoveAll(o => o.ObserverId == observerId);
    }

    public void Publish(string eventType, Order order, string? extra = null)
    {
        var evt = new OrderEvent(eventType, order, extra);
        List<IOrderObserver> snapshot;
        lock (_lock)
        {
            snapshot = [.. _observers];
            _pendingEvents.Enqueue(evt);
        }
        foreach (var obs in snapshot)
            obs.OnOrderEvent(evt);
    }

    /// <summary>Dequeues all pending events for the polling endpoint.</summary>
    public IReadOnlyList<OrderEvent> DrainEvents()
    {
        lock (_lock)
        {
            var drained = _pendingEvents.ToArray();
            _pendingEvents.Clear();
            return drained;
        }
    }
}
