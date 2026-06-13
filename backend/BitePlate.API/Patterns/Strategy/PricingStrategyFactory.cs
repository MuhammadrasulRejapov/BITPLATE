namespace BitePlate.API.Patterns.Strategy;

public static class PricingStrategyFactory
{
    private static readonly Dictionary<string, IPricingStrategy> _strategies = new()
    {
        ["standard"]  = new StandardPricingStrategy(),
        ["happyhour"] = new HappyHourStrategy(),
        ["loyalty"]   = new LoyaltyDiscountStrategy(),
        ["group"]     = new GroupDiscountStrategy(),
    };

    public static IPricingStrategy GetStrategy(string name) =>
        _strategies.TryGetValue(name.ToLowerInvariant(), out var s) ? s : _strategies["standard"];

    public static IEnumerable<object> GetAll() =>
        _strategies.Values.Select(s => new { s.Name, s.DiscountRate });
}
