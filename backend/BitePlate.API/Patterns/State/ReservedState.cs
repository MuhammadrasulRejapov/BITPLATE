using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Patterns.State;

public sealed class ReservedState : ITableState
{
    public string StateName => "Reserved";

    public void SeatGuests(TableContext ctx, int guestCount, string? waiterName)
    {
        ctx.Table.CurrentGuests = guestCount;
        ctx.Table.WaiterName = waiterName;
        ctx.Table.OccupiedSince = DateTime.Now.ToString("HH:mm");
        ctx.TransitionTo(new OccupiedState(), TableStatus.Occupied);
    }

    public void Reserve(TableContext ctx, string guestName, string time) =>
        throw new InvalidOperationException("Table is already reserved.");

    public void SubmitOrder(TableContext ctx) => throw new InvalidOperationException("Seat guests first.");
    public void RequestBill(TableContext ctx) => throw new InvalidOperationException("Seat guests first.");
    public void CloseBill(TableContext ctx)   => throw new InvalidOperationException("Seat guests first.");
    public void Clear(TableContext ctx)
    {
        ctx.Table.CurrentGuests = 0;
        ctx.Table.GuestName = null;
        ctx.Table.ReservationTime = null;
        ctx.TransitionTo(new FreeState(), TableStatus.Free);
    }
}
