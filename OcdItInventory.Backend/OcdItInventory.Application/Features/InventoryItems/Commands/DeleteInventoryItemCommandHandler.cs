using MediatR;
using OcdItInventory.Domain.Interfaces;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class DeleteInventoryItemCommandHandler 
        : IRequestHandler<DeleteInventoryItemCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteInventoryItemCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(
            DeleteInventoryItemCommand request, 
            CancellationToken cancellationToken)
        {
            await _unitOfWork.InventoryRepository.DeleteAsync(request.Id);
            await _unitOfWork.SaveChangesAsync();
            
            return Unit.Value;
        }
    }
}
