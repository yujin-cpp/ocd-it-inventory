using MediatR;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class DeleteInventoryItemCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }
}
