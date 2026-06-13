using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using BitePlate.API.Patterns.State;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Services;

public sealed class TableService(AppDbContext db)
{
    public async Task<List<Table>> GetAllAsync() =>
        await db.Tables.OrderBy(t => t.Number).ToListAsync();

    public async Task<Table> GetAsync(int id) =>
        await db.Tables.FindAsync(id)
        ?? throw new KeyNotFoundException($"Table {id} not found.");

    public async Task<Table> SeatGuestsAsync(int tableId, int guestCount, string? waiterName)
    {
        var table = await GetAsync(tableId);
        var ctx = new TableContext(table);
        ctx.SeatGuests(guestCount, waiterName);
        await db.SaveChangesAsync();
        return table;
    }

    public async Task<Table> ReserveAsync(int tableId, string guestName, string reservationTime)
    {
        var table = await GetAsync(tableId);
        var ctx = new TableContext(table);
        ctx.Reserve(guestName, reservationTime);
        await db.SaveChangesAsync();
        return table;
    }

    public async Task<Table> RequestBillAsync(int tableId)
    {
        var table = await GetAsync(tableId);
        var ctx = new TableContext(table);
        ctx.RequestBill();
        await db.SaveChangesAsync();
        return table;
    }

    public async Task<Table> ClearTableAsync(int tableId)
    {
        var table = await GetAsync(tableId);
        var ctx = new TableContext(table);
        ctx.Clear();
        await db.SaveChangesAsync();
        return table;
    }
}
