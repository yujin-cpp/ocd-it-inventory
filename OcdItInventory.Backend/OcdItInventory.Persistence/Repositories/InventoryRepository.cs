using Microsoft.EntityFrameworkCore;
using OcdItInventory.Domain.Entities;
using OcdItInventory.Domain.Interfaces;
using OcdItInventory.Persistence.Data;

namespace OcdItInventory.Persistence.Repositories
{
    public class InventoryRepository : Repository<InventoryItem>, IInventoryRepository
    {
        public InventoryRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<InventoryItem>> GetByStatusAsync(string status)
        {
            return await _context.InventoryItems
                .Where(i => i.Status == status)
                .ToListAsync();
        }

        public async Task<IEnumerable<InventoryItem>> SearchAsync(string searchTerm)
        {
            return await _context.InventoryItems
                .Where(i => i.ItemName.Contains(searchTerm) || 
                            i.ItemCode.Contains(searchTerm))
                .ToListAsync();
        }
    }
}
