using MediatR;
using OcdItInventory.Application.DTOs;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class CreateInventoryItemCommand : IRequest<InventoryItemDto>
    {
        public CreateInventoryItemDto Dto { get; set; }
    }
}
