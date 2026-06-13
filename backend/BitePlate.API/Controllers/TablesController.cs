using BitePlate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TablesController(TableService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        try { return Ok(await service.GetAsync(id)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }

    [HttpPost("{id:int}/seat")]
    public async Task<IActionResult> Seat(int id, [FromBody] SeatRequest req)
    {
        try { return Ok(await service.SeatGuestsAsync(id, req.GuestCount, req.WaiterName)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }

    [HttpPost("{id:int}/reserve")]
    public async Task<IActionResult> Reserve(int id, [FromBody] ReserveRequest req)
    {
        try { return Ok(await service.ReserveAsync(id, req.GuestName, req.ReservationTime)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }

    [HttpPost("{id:int}/request-bill")]
    public async Task<IActionResult> RequestBill(int id)
    {
        try { return Ok(await service.RequestBillAsync(id)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }

    [HttpPost("{id:int}/clear")]
    public async Task<IActionResult> Clear(int id)
    {
        try { return Ok(await service.ClearTableAsync(id)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }
}

public record SeatRequest(int GuestCount, string? WaiterName);
public record ReserveRequest(string GuestName, string ReservationTime);
