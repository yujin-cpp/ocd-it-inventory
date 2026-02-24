using AutoMapper;
using MediatR;
using OcdItInventory.Application.DTOs;
using OcdItInventory.Domain.Entities;
using OcdItInventory.Domain.Interfaces;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class CreateInventoryItemCommandHandler 
        : IRequestHandler<CreateInventoryItemCommand, InventoryItemDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CreateInventoryItemCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<InventoryItemDto> Handle(
            CreateInventoryItemCommand request, 
            CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<InventoryItem>(request.Dto);
            entity.CreatedDate = DateTime.UtcNow;
            
            var result = await _unitOfWork.InventoryRepository.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            
            return _mapper.Map<InventoryItemDto>(result);
        }
    }
}
