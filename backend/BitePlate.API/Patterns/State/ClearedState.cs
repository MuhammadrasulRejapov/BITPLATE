using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Patterns.State;

public sealed class ClearedState : ITableState
{
    public string StateName => "Cleared";

    public void Clear(TableContext ctx)
    {
        ctx.Table.CurrentGuests = 0;
        ctx.Table.WaiterName = null;
        ctx.Table.OccupiedSince = null;
        ctx.TransitionTo(new FreeState(), TableStatus.Free);
    }

    public void SeatGuests(TableContext ctx, int guestCount, string? waiterName)
    {
        // Allow immediate re-seat after clearing
        ctx.Table.CurrentGuests = guestCount;
        ctx.Table.WaiterName = waiterName;
        ctx.Table.OccupiedSince = DateTime.Now.ToString("HH:mm");
        ctx.TransitionTo(new OccupiedState(), TableStatus.Occupied);
    }

    public void Reserve(TableContext ctx, string guestName, string time)
    {
        ctx.Table.GuestName = guestName;
        ctx.Table.ReservationTime = time;
        ctx.Table.CurrentGuests = 0;
        ctx.TransitionTo(new ReservedState(), TableStatus.Reserved);
    }

    public void SubmitOrder(TableContext ctx)  => throw new InvalidOperationException("Table is being cleared.");
    public void RequestBill(TableContext ctx)  => throw new InvalidOperationException("Bill already closed.");
    public void CloseBill(TableContext ctx)    => throw new InvalidOperationException("Bill already closed.");
}
