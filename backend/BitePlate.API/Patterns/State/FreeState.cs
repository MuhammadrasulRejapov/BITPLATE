using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Patterns.State;

public sealed class FreeState : ITableState
{
    public string StateName => "Free";

    public void SeatGuests(TableContext ctx, int guestCount, string? waiterName)
    {
        ctx.Table.CurrentGuests = guestCount;
        ctx.Table.WaiterName = waiterName;
        ctx.Table.OccupiedSince = DateTime.Now.ToString("HH:mm");
        ctx.TransitionTo(new OccupiedState(), TableStatus.Occupied);
    }

    public void Reserve(TableContext ctx, string guestName, string time)
    {
        ctx.Table.GuestName = guestName;
        ctx.Table.ReservationTime = time;
        ctx.TransitionTo(new ReservedState(), TableStatus.Reserved);
    }

    public void SubmitOrder(TableContext ctx)   => throw new InvalidOperationException("Table is free.");
    public void RequestBill(TableContext ctx)   => throw new InvalidOperationException("Table is free.");
    public void CloseBill(TableContext ctx)     => throw new InvalidOperationException("Table is free.");
    public void Clear(TableContext ctx)         => throw new InvalidOperationException("Already free.");
}
