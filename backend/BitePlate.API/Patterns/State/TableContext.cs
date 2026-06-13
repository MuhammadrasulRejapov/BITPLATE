using BitePlate.API.Domain.Entities;
using BitePlate.API.Domain.Enums;

namespace BitePlate.API.Patterns.State;

/// <summary>
/// Context object that holds a reference to the current state and delegates
/// all lifecycle transitions to it.
/// </summary>
public sealed class TableContext
{
    private ITableState _state;

    public Table Table { get; }

    public TableContext(Table table)
    {
        Table = table;
        _state = table.Status switch
        {
            TableStatus.Free        => new FreeState(),
            TableStatus.Reserved    => new ReservedState(),
            TableStatus.Occupied    => new OccupiedState(),
            TableStatus.AwaitingBill => new AwaitingBillState(),
            TableStatus.Cleared     => new ClearedState(),
            _                       => new FreeState()
        };
    }

    internal void TransitionTo(ITableState newState, TableStatus status)
    {
        _state = newState;
        Table.Status = status;
    }

    public void SeatGuests(int guestCount, string? waiterName = null) =>
        _state.SeatGuests(this, guestCount, waiterName);

    public void Reserve(string guestName, string time) =>
        _state.Reserve(this, guestName, time);

    public void SubmitOrder() => _state.SubmitOrder(this);

    public void RequestBill() => _state.RequestBill(this);

    public void CloseBill() => _state.CloseBill(this);

    public void Clear() => _state.Clear(this);

    public string CurrentStateName => _state.StateName;
}
