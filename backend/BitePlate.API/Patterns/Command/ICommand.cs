namespace BitePlate.API.Patterns.Command;

/// <summary>
/// Command pattern — each kitchen action is encapsulated as a reversible command.
/// </summary>
public interface ICommand
{
    void Execute();
    void Undo();
    string Description { get; }
}
