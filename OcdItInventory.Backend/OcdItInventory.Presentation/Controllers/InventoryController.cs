using MediatR;
using Microsoft.AspNetCore.Mvc;
using OcdItInventory.Application.DTOs;
using OcdItInventory.Application.Features.InventoryItems.Commands;
using OcdItInventory.Application.Features.InventoryItems.Queries;

namespace OcdItInventory.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public InventoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get all inventory items
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetAll()
        {
            var query = new GetAllInventoryItemsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Get inventory item by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryItemDto>> GetById(int id)
        {
            var query = new GetInventoryItemByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            
            if (result == null)
                return NotFound();
            
            return Ok(result);
        }

        /// <summary>
        /// Create a new inventory item
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<InventoryItemDto>> Create([FromBody] CreateInventoryItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var command = new CreateInventoryItemCommand { Dto = dto };
            var result = await _mediator.Send(command);
            
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// Update an inventory item
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<InventoryItemDto>> Update(int id, [FromBody] UpdateInventoryItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var command = new UpdateInventoryItemCommand { Id = id, Dto = dto };
            var result = await _mediator.Send(command);
            
            return Ok(result);
        }

        /// <summary>
        /// Delete an inventory item
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var command = new DeleteInventoryItemCommand { Id = id };
            await _mediator.Send(command);
            
            return NoContent();
        }

        /// <summary>
        /// Search inventory items by name or code
        /// </summary>
        [HttpGet("search/{searchTerm}")]
        public async Task<ActionResult<IEnumerable<InventoryItemDto>>> Search(string searchTerm)
        {
            return Ok();
        }

        /// <summary>
        /// Get items by status
        /// </summary>
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetByStatus(string status)
        {
            return Ok();
        }
    }
}
