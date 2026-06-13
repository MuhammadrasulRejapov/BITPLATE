using BitePlate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ReservationsController(ReservationService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationDto dto)
    {
        try { return Ok(await service.CreateAsync(dto)); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusRequest req)
    {
        try { return Ok(await service.UpdateStatusAsync(id, req.Status)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        try { await service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }
}

public record UpdateStatusRequest(string Status);
