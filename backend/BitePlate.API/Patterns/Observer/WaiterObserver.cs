using BitePlate.API.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace BitePlate.API.Patterns.Observer;

/// <summary>Concrete observer: notifies the assigned waiter when an order is ready.</summary>
public sealed class WaiterObserver : IOrderObserver
{
    private readonly ILogger<WaiterObserver> _logger;
    public string ObserverId => "waiter-notification";

    public WaiterObserver(ILogger<WaiterObserver> logger) => _logger = logger;

    public void OnOrderEvent(OrderEvent evt)
    {
        if (evt.EventType is "OrderReady")
            _logger.LogInformation("[WAITER] Order {Id} at Table {Table} is ready — notify {Waiter}",
                evt.Order.Id, evt.Order.TableNumber, evt.Order.Waiter);
    }
}
