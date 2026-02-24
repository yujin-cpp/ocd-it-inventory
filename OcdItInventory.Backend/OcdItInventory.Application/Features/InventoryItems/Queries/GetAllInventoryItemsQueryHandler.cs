using AutoMapper;
using MediatR;
using OcdItInventory.Application.DTOs;
using OcdItInventory.Domain.Interfaces;

namespace OcdItInventory.Application.Features.InventoryItems.Queries
{
    public class GetAllInventoryItemsQueryHandler 
        : IRequestHandler<GetAllInventoryItemsQuery, IEnumerable<InventoryItemDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetAllInventoryItemsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<InventoryItemDto>> Handle(
            GetAllInventoryItemsQuery request, 
            CancellationToken cancellationToken)
        {
            var items = await _unitOfWork.InventoryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<InventoryItemDto>>(items);
        }
    }
}
