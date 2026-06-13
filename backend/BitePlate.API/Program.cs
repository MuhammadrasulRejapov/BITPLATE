using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using BitePlate.API.Data;
using BitePlate.API.Patterns.Command;
using BitePlate.API.Patterns.Observer;
using BitePlate.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ── JSON ─────────────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// ── CORS ─────────────────────────────────────────────────────────────────────
builder.Services.AddCors(opts =>
    opts.AddPolicy("Frontend", p => p
        .WithOrigins(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:4173",
            "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()));

// ── JWT Auth ──────────────────────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

// ── Database ──────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseNpgsql(builder.Configuration.GetConnectionString("Default"))
        .UseSnakeCaseNamingConvention());

// ── Singletons ────────────────────────────────────────────────────────────────
builder.Services.AddSingleton<OrderEventBus>();
builder.Services.AddSingleton<KitchenObserver>();
builder.Services.AddSingleton<WaiterObserver>();

// ── Scoped ────────────────────────────────────────────────────────────────────
builder.Services.AddScoped<KitchenCommandInvoker>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TableService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<KitchenService>();
builder.Services.AddScoped<BillingService>();
builder.Services.AddScoped<MenuService>();
builder.Services.AddScoped<ReservationService>();
builder.Services.AddScoped<UserService>();

var app = builder.Build();

// ── Seed & Observer wire-up ───────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db      = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var bus     = app.Services.GetRequiredService<OrderEventBus>();
    var kitchen = app.Services.GetRequiredService<KitchenObserver>();
    var waiter  = app.Services.GetRequiredService<WaiterObserver>();

    await DbSeeder.SeedAsync(db);
    bus.Subscribe(kitchen);
    bus.Subscribe(waiter);
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
