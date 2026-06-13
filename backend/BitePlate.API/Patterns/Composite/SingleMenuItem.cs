namespace BitePlate.API.Patterns.Composite;

/// <summary>Leaf node — a single menu item with no children.</summary>
public sealed class SingleMenuItem : IMenuComponent
{
    public string Id { get; }
    public string Name { get; }
    public bool IsCombo => false;
    public IReadOnlyList<IMenuComponent> Children => [];

    private readonly decimal _price;
    private readonly string _description;

    public SingleMenuItem(string id, string name, decimal price, string description)
    {
        Id = id;
        Name = name;
        _price = price;
        _description = description;
    }

    public decimal GetPrice() => _price;
    public string GetDescription() => _description;
    public void Add(IMenuComponent component) =>
        throw new InvalidOperationException("Cannot add children to a leaf item.");
}
