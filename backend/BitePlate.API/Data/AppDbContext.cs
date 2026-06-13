using BitePlate.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BitePlate.API.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Table>        Tables         => Set<Table>();
    public DbSet<Order>        Orders         => Set<Order>();
    public DbSet<MenuItem>     MenuItems      => Set<MenuItem>();
    public DbSet<HistoryEntry> HistoryEntries => Set<HistoryEntry>();
    public DbSet<Reservation>  Reservations   => Set<Reservation>();
    public DbSet<User>         Users          => Set<User>();

    private static readonly JsonSerializerOptions _json =
        new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    protected override void OnModelCreating(ModelBuilder model)
    {
        // ── Table ────────────────────────────────────────────────────────────
        model.Entity<Table>(e =>
        {
            e.ToTable("restaurant_tables");
            e.HasKey(t => t.Id);
            e.Property(t => t.Status).HasConversion<string>().HasMaxLength(32);
        });

        // ── MenuItem ─────────────────────────────────────────────────────────
        model.Entity<MenuItem>(e =>
        {
            e.ToTable("menu_items");
            e.HasKey(m => m.Id);
            e.Property(m => m.Id).ValueGeneratedNever();

            e.Property(m => m.Allergens)
             .HasColumnType("jsonb")
             .HasConversion(
                 v => JsonSerializer.Serialize(v, _json),
                 v => JsonSerializer.Deserialize<List<string>>(v, _json) ?? new List<string>());

            e.Property(m => m.Addons)
             .HasColumnType("jsonb")
             .HasConversion(
                 v => JsonSerializer.Serialize(v, _json),
                 v => JsonSerializer.Deserialize<List<MenuAddon>>(v, _json) ?? new List<MenuAddon>());
        });

        // ── Order ─────────────────────────────────────────────────────────────
        model.Entity<Order>(e =>
        {
            e.ToTable("orders");
            e.HasKey(o => o.Id);
            e.Property(o => o.Id).ValueGeneratedNever();
            e.Property(o => o.Status).HasConversion<string>().HasMaxLength(32);

            e.Property(o => o.Items)
             .HasColumnType("jsonb")
             .HasConversion(
                 v => JsonSerializer.Serialize(v, _json),
                 v => JsonSerializer.Deserialize<List<OrderItem>>(v, _json) ?? new List<OrderItem>());
        });

        // ── User ─────────────────────────────────────────────────────────────
        model.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.Username).HasMaxLength(64);
            e.Property(u => u.Role).HasMaxLength(32);
        });

        // ── Reservation ──────────────────────────────────────────────────────
        model.Entity<Reservation>(e =>
        {
            e.ToTable("reservations");
            e.HasKey(r => r.Id);
            e.Property(r => r.Id).ValueGeneratedNever();
        });

        // ── HistoryEntry ──────────────────────────────────────────────────────
        model.Entity<HistoryEntry>(e =>
        {
            e.ToTable("order_history");
            e.HasKey(h => h.Id);
            e.Property(h => h.Id).ValueGeneratedNever();

            e.Property(h => h.Items)
             .HasColumnType("jsonb")
             .HasConversion(
                 v => JsonSerializer.Serialize(v, _json),
                 v => JsonSerializer.Deserialize<List<string>>(v, _json) ?? new List<string>());
        });
    }
}
