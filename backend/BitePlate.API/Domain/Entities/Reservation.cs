namespace BitePlate.API.Domain.Entities;

public class Reservation
{
    public string Id { get; set; } = "";
    public string GuestName { get; set; } = "";
    public string Phone { get; set; } = "";
    public int TableNumber { get; set; }
    public int Guests { get; set; }
    public DateTime Time { get; set; }
    public string Status { get; set; } = "Pending";
    public string Note { get; set; } = "";
}
