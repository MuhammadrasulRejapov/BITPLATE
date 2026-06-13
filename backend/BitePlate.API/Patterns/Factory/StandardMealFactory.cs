using BitePlate.API.Domain.Entities;

namespace BitePlate.API.Patterns.Factory;

/// <summary>Creates standard (à la carte) menu items.</summary>
public sealed class StandardMealFactory : MealItemFactory
{
    public override MenuItem CreateMenuItem(string id, string name, string category,
        decimal price, string description, string image, List<string> allergens, List<MenuAddon> addons)
        => BuildBase(id, name, category, price, description, image, allergens, addons);
}
