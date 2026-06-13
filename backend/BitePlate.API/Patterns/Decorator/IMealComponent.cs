namespace BitePlate.API.Patterns.Decorator;

/// <summary>
/// Decorator pattern — addon customisations are layered over a base meal item
/// at runtime without modifying the original class hierarchy.
/// </summary>
public interface IMealComponent
{
    string GetDescription();
    decimal GetPrice();
}
