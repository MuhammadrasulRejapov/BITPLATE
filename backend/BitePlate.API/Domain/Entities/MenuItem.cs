namespace BitePlate.API.Domain.Entities;

public class MenuAddon
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
}

public class MenuItem
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public decimal Price { get; set; }
    public string Description { get; set; } = "";
    public List<string> Allergens { get; set; } = [];
    public string Image { get; set; } = "";
    public List<MenuAddon> Addons { get; set; } = [];
}
