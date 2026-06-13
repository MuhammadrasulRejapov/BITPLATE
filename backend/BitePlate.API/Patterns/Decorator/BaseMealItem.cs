namespace BitePlate.API.Patterns.Decorator;

/// <summary>Concrete component — a plain menu item with no addons.</summary>
public sealed class BaseMealItem : IMealComponent
{
    private readonly string _name;
    private readonly decimal _price;

    public BaseMealItem(string name, decimal price)
    {
        _name = name;
        _price = price;
    }

    public string GetDescription() => _name;
    public decimal GetPrice() => _price;
}
