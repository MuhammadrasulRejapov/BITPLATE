namespace BitePlate.API.Domain.Entities;

public class User
{
    public int    Id           { get; set; }
    public string Username     { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role         { get; set; } = "Waiter";
    public string DisplayName  { get; set; } = "";
    public bool   IsActive     { get; set; } = true;
}
