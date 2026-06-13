using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Domain.Entities;

public class Order
{
    public string Id { get; set; } = "";
    public int TableNumber { get; set; }
    public string Time { get; set; } = "";
    public OrderStatus Status { get; set; }
    public string Waiter { get; set; } = "";
    public List<OrderItem> Items { get; set; } = [];
}
