using BitePlate.API.Data;
using BitePlate.API.Domain.Entities;
using BitePlate.API.Patterns.Composite;
using BitePlate.API.Patterns.Decorator;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Services;

public sealed class MenuService(AppDbContext db)
{
    public async Task<List<MenuItem>> GetAllAsync() =>
        await db.MenuItems.OrderBy(m => m.Category).ThenBy(m => m.Name).ToListAsync();

    public IReadOnlyList<IMenuComponent> GetCombos() => DbSeeder.BuildCombos();

    public async Task<(string Description, decimal Price)> PreviewWithAddonsAsync(
        string menuItemId, IEnumerable<string> addonIds)
    {
        var item = await db.MenuItems.FindAsync(menuItemId)
            ?? throw new KeyNotFoundException($"Menu item {menuItemId} not found.");

        // Decorator pattern: stack addon wrappers over the base item
        IMealComponent component = new BaseMealItem(item.Name, item.Price);
        foreach (var addonId in addonIds)
        {
            var addon = item.Addons.FirstOrDefault(a => a.Id == addonId);
            if (addon is not null)
                component = new AddonDecorator(component, addon.Name, addon.Price);
        }

        return (component.GetDescription(), component.GetPrice());
    }
}
