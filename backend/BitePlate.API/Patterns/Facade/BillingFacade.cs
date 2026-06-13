using BitePlate.API.Domain.Entities;
using BitePlate.API.Patterns.Strategy;

namespace BitePlate.API.Patterns.Facade;

/// <summary>
/// Facade pattern — hides the complexity of pricing strategy, tax, tip and split-bill
/// logic behind a single ProcessPayment call.
/// </summary>
public sealed class BillingFacade
{
    private const decimal TaxRate = 0.12m;

    public BillResult ProcessPayment(Order order, IPricingStrategy strategy, decimal tip, int splitCount = 1)
    {
        var subtotal      = CalculateSubtotal(order);
        var discount      = strategy.Apply(subtotal);
        var freeDrink     = strategy.FreeDrinkValue;           // 0 for most strategies
        var totalDiscount = discount + freeDrink;
        var afterDiscount = Math.Max(0, subtotal - totalDiscount);
        var tax           = afterDiscount * TaxRate;
        var total         = afterDiscount + tax + tip;
        var perPerson     = splitCount > 1 ? Math.Round(total / splitCount, 0) : total;

        return new BillResult(subtotal, discount, strategy.DiscountRate, freeDrink, tax, tip, total, perPerson, splitCount);
    }

    private static decimal CalculateSubtotal(Order order) =>
        order.Items.Sum(item =>
            (item.Price + item.Addons.Sum(a => a.Price)) * item.Qty);
}

public record BillResult(
    decimal Subtotal,
    decimal Discount,
    decimal DiscountRate,
    decimal FreeDrinkValue,
    decimal Tax,
    decimal Tip,
    decimal Total,
    decimal PerPerson,
    int SplitCount);
