using MediatR;
using OcdItInventory.Application.DTOs;

namespace OcdItInventory.Application.Features.InventoryItems.Queries
{
    public class GetAllInventoryItemsQuery : IRequest<IEnumerable<InventoryItemDto>>
    {
    }
}
