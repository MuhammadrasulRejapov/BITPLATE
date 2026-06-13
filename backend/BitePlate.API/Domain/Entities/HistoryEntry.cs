namespace BitePlate.API.Domain.Entities;

public class HistoryEntry
{
    public string Id { get; set; } = "";
    public int TableNumber { get; set; }
    public string Waiter { get; set; } = "";
    /// <summary>Numeric ID of the staff member who served the table (brief: staff ID in audit log).</summary>
    public string? StaffId { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = "";
    public DateTime Timestamp { get; set; }
    public string? PaymentMethod { get; set; }
    public List<string> Items { get; set; } = [];
    public decimal Discount { get; set; }
    public decimal FreeDrinkValue { get; set; }
    public decimal Tip { get; set; }
}
