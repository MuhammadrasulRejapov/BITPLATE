namespace BitePlate.API.Patterns.Strategy;

/// <summary>Applied when party size exceeds the threshold (≥6 guests).</summary>
public sealed class GroupDiscountStrategy : IPricingStrategy
{
    public string Name => "group";
    public decimal DiscountRate => 0.15m;
    public decimal FreeDrinkValue => 0m;
    public decimal Apply(decimal subtotal) => subtotal * DiscountRate;
}
