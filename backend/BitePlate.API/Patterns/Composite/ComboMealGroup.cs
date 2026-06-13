namespace BitePlate.API.Patterns.Composite;

/// <summary>
/// Composite node — a set meal whose price is the sum of its children minus a bundle discount.
/// Clients call GetPrice() without knowing whether it is a single item or a group.
/// </summary>
public sealed class ComboMealGroup : IMenuComponent
{
    private readonly List<IMenuComponent> _children = [];
    private readonly decimal _discountRate;

    public string Id { get; }
    public string Name { get; }
    public bool IsCombo => true;
    public IReadOnlyList<IMenuComponent> Children => _children.AsReadOnly();

    public ComboMealGroup(string id, string name, decimal discountRate = 0.10m)
    {
        Id = id;
        Name = name;
        _discountRate = discountRate;
    }

    public void Add(IMenuComponent component) => _children.Add(component);

    public decimal GetPrice()
    {
        var sum = _children.Sum(c => c.GetPrice());
        return Math.Round(sum * (1 - _discountRate), 0);
    }

    public string GetDescription() =>
        string.Join(" + ", _children.Select(c => c.Name));
}
