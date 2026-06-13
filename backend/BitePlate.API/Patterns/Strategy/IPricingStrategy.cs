namespace BitePlate.API.Patterns.Strategy;

/// <summary>
/// Strategy pattern — pricing algorithms are interchangeable at runtime.
/// Each concrete strategy encapsulates a different discount rule;
/// the Bill class (via BillingFacade) never needs to change when a new strategy is added.
/// </summary>
public interface IPricingStrategy
{
    string Name { get; }
    decimal DiscountRate { get; }

    /// <summary>Calculates the discount amount to subtract from the subtotal.</summary>
    decimal Apply(decimal subtotal);

    /// <summary>
    /// Value of a complimentary item included with this strategy (0 for most strategies).
    /// LoyaltyCardPricing grants a free drink credited against the total.
    /// </summary>
    decimal FreeDrinkValue { get; }
}
