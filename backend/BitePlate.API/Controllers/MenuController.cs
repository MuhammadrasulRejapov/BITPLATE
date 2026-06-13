using BitePlate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class MenuController(MenuService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("combos")]
    public IActionResult GetCombos()
    {
        var combos = service.GetCombos().Select(c => new
        {
            c.Id, c.Name, c.IsCombo,
            Price = c.GetPrice(),
            Description = c.GetDescription(),
            Children = c.Children.Select(ch => new { ch.Id, ch.Name, Price = ch.GetPrice(), ch.IsCombo })
        });
        return Ok(combos);
    }

    [HttpGet("{id}/preview-addons")]
    public async Task<IActionResult> PreviewAddons(string id, [FromQuery] string addons = "")
    {
        try
        {
            var addonIds = addons.Split(',', StringSplitOptions.RemoveEmptyEntries);
            var (desc, price) = await service.PreviewWithAddonsAsync(id, addonIds);
            return Ok(new { description = desc, price });
        }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }
}
