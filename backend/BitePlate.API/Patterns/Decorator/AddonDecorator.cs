namespace BitePlate.API.Patterns.Decorator;

/// <summary>
/// Decorator — wraps an IMealComponent and adds one addon's name and price on top.
/// Stack multiple decorators for multiple addons.
/// </summary>
public sealed class AddonDecorator : IMealComponent
{
    private readonly IMealComponent _wrapped;
    private readonly string _addonName;
    private readonly decimal _addonPrice;

    public AddonDecorator(IMealComponent wrapped, string addonName, decimal addonPrice)
    {
        _wrapped = wrapped;
        _addonName = addonName;
        _addonPrice = addonPrice;
    }

    public string GetDescription() => $"{_wrapped.GetDescription()} + {_addonName}";
    public decimal GetPrice() => _wrapped.GetPrice() + _addonPrice;
}
