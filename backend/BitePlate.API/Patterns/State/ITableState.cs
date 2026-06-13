namespace BitePlate.API.Patterns.State;

/// <summary>
/// State pattern — each TableStatus maps to a concrete state that allows/denies
/// specific transitions, preventing invalid lifecycle moves.
/// </summary>
public interface ITableState
{
    void SeatGuests(TableContext ctx, int guestCount, string? waiterName);
    void Reserve(TableContext ctx, string guestName, string time);
    void SubmitOrder(TableContext ctx);
    void RequestBill(TableContext ctx);
    void CloseBill(TableContext ctx);
    void Clear(TableContext ctx);
    string StateName { get; }
}
