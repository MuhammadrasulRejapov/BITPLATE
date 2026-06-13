using BitePlate.API.Domain.Entities;
using BitePlate.API.Patterns.Singleton;

namespace BitePlate.API.Patterns.Iterator;

/// <summary>
/// Concrete iterator that traverses the OrderHistoryLog with optional date filtering.
/// The caller never touches the underlying list directly.
/// </summary>
public sealed class FilteredHistoryIterator : IHistoryIterator
{
    private readonly IReadOnlyList<HistoryEntry> _source;
    private int _cursor;

    public FilteredHistoryIterator(DateTime? from = null, DateTime? to = null)
    {
        var all = OrderHistoryLog.Instance.GetAll();
        _source = [.. all.Where(e =>
            (from is null || e.Timestamp >= from) &&
            (to is null   || e.Timestamp <= to))];
        _cursor = 0;
    }

    public bool HasNext() => _cursor < _source.Count;

    public HistoryEntry Next()
    {
        if (!HasNext()) throw new InvalidOperationException("No more entries.");
        return _source[_cursor++];
    }

    public void Reset() => _cursor = 0;

    /// <summary>Materialises all remaining entries using the iterator protocol.</summary>
    public List<HistoryEntry> ToList()
    {
        Reset();
        var result = new List<HistoryEntry>();
        while (HasNext()) result.Add(Next());
        return result;
    }
}
