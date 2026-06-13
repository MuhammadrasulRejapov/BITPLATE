using BitePlate.API.Domain.Entities;

namespace BitePlate.API.Patterns.Factory;

/// <summary>
/// Creates combo/set-meal items. The category is forced to "Combo" and a
/// bundle discount is baked into the price at creation time.
/// </summary>
public sealed class ComboMealFactory : MealItemFactory
{
    private const decimal ComboDiscountRate = 0.10m;

    public override MenuItem CreateMenuItem(string id, string name, string category,
        decimal price, string description, string image, List<string> allergens, List<MenuAddon> addons)
    {
        var item = BuildBase(id, name, "Combo", Math.Round(price * (1 - ComboDiscountRate), 0),
            description, image, allergens, addons);
        return item;
    }
}
