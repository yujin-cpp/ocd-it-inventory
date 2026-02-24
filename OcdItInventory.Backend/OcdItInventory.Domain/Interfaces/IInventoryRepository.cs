using OcdItInventory.Domain.Entities;

namespace OcdItInventory.Domain.Interfaces
{
    public interface IInventoryRepository : IRepository<InventoryItem>
    {
        Task<IEnumerable<InventoryItem>> GetByStatusAsync(string status);
        Task<IEnumerable<InventoryItem>> SearchAsync(string searchTerm);
    }
}
