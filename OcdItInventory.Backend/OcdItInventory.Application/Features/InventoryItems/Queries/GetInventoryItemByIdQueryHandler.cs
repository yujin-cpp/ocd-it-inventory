using AutoMapper;
using MediatR;
using OcdItInventory.Application.DTOs;
using OcdItInventory.Domain.Interfaces;

namespace OcdItInventory.Application.Features.InventoryItems.Queries
{
    public class GetInventoryItemByIdQueryHandler 
        : IRequestHandler<GetInventoryItemByIdQuery, InventoryItemDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetInventoryItemByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<InventoryItemDto> Handle(
            GetInventoryItemByIdQuery request, 
            CancellationToken cancellationToken)
        {
            var item = await _unitOfWork.InventoryRepository.GetByIdAsync(request.Id);
            return _mapper.Map<InventoryItemDto>(item);
        }
    }
}
