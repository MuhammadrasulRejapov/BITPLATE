using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Services;

public sealed class UserService(AppDbContext db)
{
    public async Task<List<UserDto>> GetAllAsync() =>
        await db.Users
            .OrderBy(u => u.Role).ThenBy(u => u.Username)
            .Select(u => new UserDto(u.Id, u.Username, u.Role, u.DisplayName, u.IsActive))
            .ToListAsync();

    public async Task<User> CreateAsync(CreateUserRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Username == req.Username.ToLower()))
            throw new InvalidOperationException($"'{req.Username}' login allaqachon band.");

        var user = new User
        {
            Username     = req.Username.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role         = req.Role,
            DisplayName  = req.DisplayName,
            IsActive     = true,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(int id, UpdateUserRequest req)
    {
        var user = await db.Users.FindAsync(id)
            ?? throw new KeyNotFoundException($"Foydalanuvchi #{id} topilmadi.");

        user.DisplayName = req.DisplayName;
        user.Role        = req.Role;
        user.IsActive    = req.IsActive;

        if (!string.IsNullOrWhiteSpace(req.NewPassword))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);

        await db.SaveChangesAsync();
        return user;
    }

    public async Task DeleteAsync(int id)
    {
        var user = await db.Users.FindAsync(id)
            ?? throw new KeyNotFoundException($"Foydalanuvchi #{id} topilmadi.");

        if (user.Username == "manager")
            throw new InvalidOperationException("Bosh menejer foydalanuvchini o'chirib bo'lmaydi.");

        db.Users.Remove(user);
        await db.SaveChangesAsync();
    }
}

public record UserDto(int Id, string Username, string Role, string DisplayName, bool IsActive);
public record CreateUserRequest(string Username, string Password, string Role, string DisplayName);
public record UpdateUserRequest(string DisplayName, string Role, bool IsActive, string? NewPassword = null);
