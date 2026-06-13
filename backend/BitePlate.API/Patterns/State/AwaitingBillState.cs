using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Patterns.State;

public sealed class AwaitingBillState : ITableState
{
    public string StateName => "AwaitingBill";

    public void CloseBill(TableContext ctx) =>
        ctx.TransitionTo(new ClearedState(), TableStatus.Cleared);

    public void SeatGuests(TableContext ctx, int guestCount, string? waiterName) =>
        throw new InvalidOperationException("Bill is pending.");

    public void Reserve(TableContext ctx, string guestName, string time) =>
        throw new InvalidOperationException("Bill is pending.");

    public void SubmitOrder(TableContext ctx) { /* waiter can add more items while bill is pending */ }

    public void RequestBill(TableContext ctx) { /* idempotent — already awaiting */ }

    public void Clear(TableContext ctx) =>
        throw new InvalidOperationException("Close the bill first.");
}
