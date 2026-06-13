namespace BitePlate.API.Patterns.Strategy;

public sealed class HappyHourStrategy : IPricingStrategy
{
    public string Name => "happyhour";
    public decimal DiscountRate => 0.20m;
    public decimal FreeDrinkValue => 0m;
    public decimal Apply(decimal subtotal) => subtotal * DiscountRate;
}
