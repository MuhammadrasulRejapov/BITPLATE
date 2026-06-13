using BitePlate.API.Domain.Entities;

namespace BitePlate.API.Patterns.Factory;

/// <summary>
/// Factory Method pattern — callers depend on the factory abstraction;
/// concrete factories decide how to construct meal items.
/// </summary>
public abstract class MealItemFactory
{
    public abstract MenuItem CreateMenuItem(string id, string name, string category,
        decimal price, string description, string image, List<string> allergens, List<MenuAddon> addons);

    protected static MenuItem BuildBase(string id, string name, string category,
        decimal price, string description, string image, List<string> allergens, List<MenuAddon> addons)
        => new()
        {
            Id = id, Name = name, Category = category,
            Price = price, Description = description, Image = image,
            Allergens = allergens, Addons = addons
        };
}
