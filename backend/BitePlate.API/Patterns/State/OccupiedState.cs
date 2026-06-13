using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Patterns.State;

public sealed class OccupiedState : ITableState
{
    public string StateName => "Occupied";

    public void SubmitOrder(TableContext ctx) { /* stay Occupied */ }

    public void RequestBill(TableContext ctx) =>
        ctx.TransitionTo(new AwaitingBillState(), TableStatus.AwaitingBill);

    public void SeatGuests(TableContext ctx, int guestCount, string? waiterName) =>
        throw new InvalidOperationException("Table is already occupied.");

    public void Reserve(TableContext ctx, string guestName, string time) =>
        throw new InvalidOperationException("Table is already occupied.");

    public void CloseBill(TableContext ctx) =>
        throw new InvalidOperationException("Request bill first.");

    public void Clear(TableContext ctx) =>
        throw new InvalidOperationException("Close the bill before clearing.");
}
