using AutoMapper;
using MediatR;
using OcdItInventory.Application.DTOs;
using OcdItInventory.Domain.Interfaces;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class UpdateInventoryItemCommandHandler 
        : IRequestHandler<UpdateInventoryItemCommand, InventoryItemDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UpdateInventoryItemCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<InventoryItemDto> Handle(
            UpdateInventoryItemCommand request, 
            CancellationToken cancellationToken)
        {
            var item = await _unitOfWork.InventoryRepository.GetByIdAsync(request.Id);
            
            if (item == null)
                throw new KeyNotFoundException($"Item with ID {request.Id} not found");

            _mapper.Map(request.Dto, item);
            item.UpdatedDate = DateTime.UtcNow;
            
            await _unitOfWork.InventoryRepository.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();
            
            return _mapper.Map<InventoryItemDto>(item);
        }
    }
}
