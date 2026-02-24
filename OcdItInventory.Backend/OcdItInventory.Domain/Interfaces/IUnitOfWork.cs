namespace OcdItInventory.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IInventoryRepository InventoryRepository { get; }
        Task<int> SaveChangesAsync();
    }
}
