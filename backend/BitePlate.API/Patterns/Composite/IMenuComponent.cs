namespace BitePlate.API.Patterns.Composite;

/// <summary>
/// Composite pattern — single menu items and combo meal groups are treated
/// uniformly for pricing and display.
/// </summary>
public interface IMenuComponent
{
    string Id { get; }
    string Name { get; }
    decimal GetPrice();
    string GetDescription();
    bool IsCombo { get; }
    IReadOnlyList<IMenuComponent> Children { get; }
    void Add(IMenuComponent component);
}
