namespace BitePlate.API.Patterns.Strategy;

public sealed class StandardPricingStrategy : IPricingStrategy
{
    public string Name => "standard";
    public decimal DiscountRate => 0m;
    public decimal FreeDrinkValue => 0m;
    public decimal Apply(decimal subtotal) => 0m;
}
