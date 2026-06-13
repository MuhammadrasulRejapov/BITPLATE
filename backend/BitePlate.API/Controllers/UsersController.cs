using BitePlate.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public sealed class UsersController(UserService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest req)
    {
        try { return Ok(await service.CreateAsync(req)); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest req)
    {
        try { return Ok(await service.UpdateAsync(id, req)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try { await service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }
}
