using BitePlate.API.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace BitePlate.API.Patterns.Observer;

/// <summary>Concrete observer: logs order events to the kitchen console.</summary>
public sealed class KitchenObserver : IOrderObserver
{
    private readonly ILogger<KitchenObserver> _logger;
    public string ObserverId => "kitchen-display";

    public KitchenObserver(ILogger<KitchenObserver> logger) => _logger = logger;

    public void OnOrderEvent(OrderEvent evt)
    {
        _logger.LogInformation("[KITCHEN] {Event}: Order {Id} (Table {Table}) → {Status}",
            evt.EventType, evt.Order.Id, evt.Order.TableNumber, evt.Order.Status);
    }
}
