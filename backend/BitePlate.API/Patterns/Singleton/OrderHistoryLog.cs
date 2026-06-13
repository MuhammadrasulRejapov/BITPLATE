using BitePlate.API.Domain.Entities;

namespace BitePlate.API.Patterns.Singleton;

/// <summary>
/// Singleton pattern — one globally accessible, thread-safe audit log for all
/// completed and cancelled orders.
/// </summary>
public sealed class OrderHistoryLog
{
    private static readonly Lazy<OrderHistoryLog> _instance =
        new(() => new OrderHistoryLog(), LazyThreadSafetyMode.ExecutionAndPublication);

    private readonly List<HistoryEntry> _entries = [];
    private readonly object _lock = new();

    private OrderHistoryLog() { }

    public static OrderHistoryLog Instance => _instance.Value;

    public void Append(HistoryEntry entry)
    {
        lock (_lock)
            _entries.Insert(0, entry);
    }

    public IReadOnlyList<HistoryEntry> GetAll()
    {
        lock (_lock)
            return _entries.AsReadOnly();
    }

    /// <summary>Returns all history entries for a specific table number.</summary>
    public IReadOnlyList<HistoryEntry> GetByTable(int tableNumber)
    {
        lock (_lock)
            return _entries.Where(e => e.TableNumber == tableNumber).ToList().AsReadOnly();
    }

    /// <summary>
    /// Returns the name of the most frequently ordered menu item across all history entries.
    /// Item strings are stored as "Name xQty"; this method extracts the name part.
    /// </summary>
    public string? GetMostFrequentItem()
    {
        lock (_lock)
            return _entries
                .SelectMany(e => e.Items)
                .Select(i => i.Contains(" x") ? i[..i.LastIndexOf(" x", StringComparison.Ordinal)].Trim() : i.Trim())
                .GroupBy(name => name)
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key;
    }

    public void SeedBulk(IEnumerable<HistoryEntry> entries)
    {
        lock (_lock)
        {
            _entries.Clear();
            _entries.AddRange(entries);
        }
    }
}
