using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Domain.Entities;

public class Table
{
    public int Id { get; set; }
    public int Number { get; set; }
    public int Capacity { get; set; }
    public TableStatus Status { get; set; }
    public int CurrentGuests { get; set; }
    public string? OccupiedSince { get; set; }
    public string? WaiterId { get; set; }
    public string? WaiterName { get; set; }
    public string? ReservationTime { get; set; }
    public string? GuestName { get; set; }
}
