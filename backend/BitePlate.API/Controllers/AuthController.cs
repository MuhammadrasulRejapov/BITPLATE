using BitePlate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var result = await authService.LoginAsync(req.Username, req.Password);
        return result is null
            ? Unauthorized(new { message = "Login yoki parol noto'g'ri." })
            : Ok(result);
    }
}

public record LoginRequest(string Username, string Password);
