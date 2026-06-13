namespace BitePlate.API.Patterns.Command;

/// <summary>
/// Invoker — maintains an undo stack per kitchen session.
/// Registered as Scoped so each HTTP session gets its own stack.
/// </summary>
public sealed class KitchenCommandInvoker
{
    private readonly Stack<ICommand> _history = new();

    public void Execute(ICommand cmd)
    {
        cmd.Execute();
        _history.Push(cmd);
    }

    public string? Undo()
    {
        if (_history.Count == 0) return null;
        var cmd = _history.Pop();
        cmd.Undo();
        return cmd.Description;
    }

    public bool CanUndo => _history.Count > 0;

    public IReadOnlyCollection<string> History =>
        _history.Select(c => c.Description).ToArray();
}
