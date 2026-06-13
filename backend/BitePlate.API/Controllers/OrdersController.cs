using BitePlate.API.Domain.Entities;
using BitePlate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace BitePlate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class OrdersController(OrderService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        try { return Ok(await service.GetAsync(id)); }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }

    [HttpGet("table/{tableNumber:int}")]
    public async Task<IActionResult> GetByTable(int tableNumber)
    {
        var order = await service.GetActiveByTableAsync(tableNumber);
        return order is null ? NotFound(new { message = "No active order." }) : Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest req)
    {
        var id = await service.CreateAsync(req.TableNumber, req.Items, req.Waiter);
        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }

    [HttpGet("events/poll")]
    public IActionResult Poll() => Ok(service.PollEvents());
}

public record CreateOrderRequest(int TableNumber, List<OrderItem> Items, string Waiter);
