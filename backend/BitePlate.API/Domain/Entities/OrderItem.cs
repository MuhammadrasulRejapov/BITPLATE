namespace BitePlate.API.Domain.Entities;

public class OrderAddon
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
}

public class OrderItem
{
    public string MenuItemId { get; set; } = "";
    public string Name { get; set; } = "";
    public int Qty { get; set; }
    public decimal Price { get; set; }
    public List<OrderAddon> Addons { get; set; } = [];
}
