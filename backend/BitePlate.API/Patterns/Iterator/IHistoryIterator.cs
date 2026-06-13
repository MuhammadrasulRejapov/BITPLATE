using BitePlate.API.Domain.Entities;

namespace BitePlate.API.Patterns.Iterator;

/// <summary>
/// Iterator pattern — provides sequential access to history records without
/// exposing the underlying collection structure.
/// </summary>
public interface IHistoryIterator
{
    bool HasNext();
    HistoryEntry Next();
    void Reset();
}
