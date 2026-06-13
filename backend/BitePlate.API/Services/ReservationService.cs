using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using BitePlate.API.Patterns.State;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Services;

public sealed class ReservationService(AppDbContext db)
{
    public async Task<List<Reservation>> GetAllAsync() =>
        await db.Reservations.OrderBy(r => r.Time).ToListAsync();

    public async Task<Reservation> CreateAsync(CreateReservationDto dto)
    {
        var maxNum = await db.Reservations
            .Select(r => r.Id)
            .ToListAsync()
            .ContinueWith(t => t.Result
                .Select(id => int.TryParse(id.Replace("RES-",""), out var n) ? n : 0)
                .DefaultIfEmpty(0).Max());

        var reservation = new Reservation
        {
            Id = $"RES-{maxNum + 1:D3}",
            GuestName   = dto.GuestName,
            Phone       = dto.Phone,
            TableNumber = dto.TableNumber,
            Guests      = dto.Guests,
            Time        = dto.Time,
            Status      = "Pending",
            Note        = dto.Note ?? "",
        };

        db.Reservations.Add(reservation);

        // State pattern: mark table as Reserved
        var table = await db.Tables.FirstOrDefaultAsync(t => t.Number == dto.TableNumber);
        if (table is not null)
        {
            var ctx = new TableContext(table);
            ctx.Reserve(dto.GuestName, dto.Time.ToString("HH:mm"));
        }

        await db.SaveChangesAsync();
        return reservation;
    }

    public async Task<Reservation> UpdateStatusAsync(string id, string status)
    {
        var r = await db.Reservations.FindAsync(id)
            ?? throw new KeyNotFoundException($"Reservation {id} not found.");
        r.Status = status;
        await db.SaveChangesAsync();
        return r;
    }

    public async Task DeleteAsync(string id)
    {
        var r = await db.Reservations.FindAsync(id)
            ?? throw new KeyNotFoundException($"Reservation {id} not found.");
        db.Reservations.Remove(r);
        await db.SaveChangesAsync();
    }
}

public record CreateReservationDto(
    string GuestName, string Phone,
    int TableNumber, int Guests,
    DateTime Time, string? Note);
