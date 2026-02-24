using MediatR;
using OcdItInventory.Application.DTOs;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class UpdateInventoryItemCommand : IRequest<InventoryItemDto>
    {
        public int Id { get; set; }
        public UpdateInventoryItemDto Dto { get; set; }
    }
}
