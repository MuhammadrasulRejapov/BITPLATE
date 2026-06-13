using BitePlate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class KitchenController(KitchenService service) : ControllerBase
{
    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue() => Ok(await service.GetQueueAsync());

    [HttpPost("{orderId}/advance")]
    public async Task<IActionResult> Advance(string orderId)
    {
        try { return Ok(await service.AdvanceStatusAsync(orderId)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }

    [HttpPost("undo")]
    public IActionResult Undo()
    {
        var description = service.UndoLast();
        return description is null
            ? Conflict(new { message = "Nothing to undo." })
            : Ok(new { undone = description });
    }

    [HttpDelete("{orderId}")]
    public async Task<IActionResult> Cancel(string orderId)
    {
        try { return Ok(await service.CancelOrderAsync(orderId)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }
}
