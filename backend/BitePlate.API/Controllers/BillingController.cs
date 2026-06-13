using BitePlate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class BillingController(BillingService service) : ControllerBase
{
    [HttpGet("{orderId}/preview")]
    public async Task<IActionResult> Preview(string orderId,
        [FromQuery] string strategy = "standard",
        [FromQuery] decimal tip = 0,
        [FromQuery] int splitCount = 1)
    {
        try { return Ok(await service.PreviewAsync(orderId, strategy, tip, splitCount)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }

    [HttpPost("{orderId}/close")]
    public async Task<IActionResult> Close(string orderId, [FromBody] CloseBillRequest req)
    {
        try { return Ok(await service.CloseBillAsync(orderId, req.Strategy, req.Tip, req.PaymentMethod, req.SplitCount)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }

    [HttpGet("strategies")]
    public IActionResult GetStrategies() =>
        Ok(BitePlate.API.Patterns.Strategy.PricingStrategyFactory.GetAll());
}

public record CloseBillRequest(string Strategy, decimal Tip, string PaymentMethod, int SplitCount = 1);
