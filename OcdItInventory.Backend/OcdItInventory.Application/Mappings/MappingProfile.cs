using AutoMapper;
using OcdItInventory.Application.DTOs;
using OcdItInventory.Domain.Entities;

namespace OcdItInventory.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // InventoryItem mappings
            CreateMap<InventoryItem, InventoryItemDto>().ReverseMap();
            CreateMap<CreateInventoryItemDto, InventoryItem>();
            CreateMap<UpdateInventoryItemDto, InventoryItem>();
        }
    }
}
