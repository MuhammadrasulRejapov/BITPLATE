namespace BitePlate.API.Patterns.Strategy;

/// <summary>
/// Loyalty Card pricing: 10% off the entire bill plus one complimentary drink
/// (valued at the price of the cheapest standard beverage — Limonad, 15 000 so'm).
/// The free drink is credited as an additional discount in BillingFacade.
/// </summary>
public sealed class LoyaltyDiscountStrategy : IPricingStrategy
{
    public string Name => "loyalty";
    public decimal DiscountRate => 0.10m;
    public decimal FreeDrinkValue => 15_000m;
    public decimal Apply(decimal subtotal) => subtotal * DiscountRate;
}
