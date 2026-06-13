using BitePlate.API.Patterns.Singleton;
using BitePlate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HistoryController(BillingService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to   = null)
        => Ok(await service.GetHistoryAsync(from, to));

    /// <summary>
    /// Singleton query — returns all history entries for a specific table.
    /// Uses OrderHistoryLog.Instance (Singleton) directly to demonstrate
    /// the pattern's globally accessible, single-instance nature.
    /// </summary>
    [HttpGet("table/{tableNumber:int}")]
    public async Task<IActionResult> GetByTable(int tableNumber)
    {
        // Ensure singleton is populated from DB first
        await service.GetHistoryAsync();
        var entries = OrderHistoryLog.Instance.GetByTable(tableNumber);
        return Ok(entries);
    }

    /// <summary>
    /// Singleton query — returns the most frequently ordered menu item
    /// by traversing all entries in the OrderHistoryLog via GetMostFrequentItem().
    /// </summary>
    [HttpGet("top-item")]
    public async Task<IActionResult> GetTopItem()
    {
        await service.GetHistoryAsync();
        var item = OrderHistoryLog.Instance.GetMostFrequentItem();
        return item is null ? NotFound("No history entries found.") : Ok(new { item });
    }

    [HttpGet("report")]
    public async Task<IActionResult> EndOfNight() =>
        Ok(await service.GetEndOfNightReportAsync());
}
