using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BitePlate.API.Services;

public sealed class AuthService(AppDbContext db, IConfiguration config)
{
    public async Task<LoginResult?> LoginAsync(string username, string password)
    {
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Username == username.ToLower() && u.IsActive);

        if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return null;

        var token = GenerateToken(user);
        return new LoginResult(token, user.Role, user.Username, user.DisplayName);
    }

    private string GenerateToken(User user)
    {
        var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(12);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name,           user.Username),
            new Claim(ClaimTypes.Role,           user.Role),
            new Claim("displayName",             user.DisplayName),
        };

        var token = new JwtSecurityToken(
            issuer:   config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims:   claims,
            expires:  expires,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record LoginResult(string Token, string Role, string Username, string DisplayName);
