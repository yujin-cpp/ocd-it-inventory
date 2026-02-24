using MediatR;
using OcdItInventory.Application.DTOs;

namespace OcdItInventory.Application.Features.InventoryItems.Queries
{
    public class GetInventoryItemByIdQuery : IRequest<InventoryItemDto>
    {
        public int Id { get; set; }
    }
}
