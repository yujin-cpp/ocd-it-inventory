using Microsoft.EntityFrameworkCore;
using OcdItInventory.Domain.Entities;

namespace OcdItInventory.Persistence.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<InventoryItem> InventoryItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure InventoryItem entity
            modelBuilder.Entity<InventoryItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.ItemName)
                    .IsRequired()
                    .HasMaxLength(100);
                
                entity.Property(e => e.ItemCode)
                    .IsRequired()
                    .HasMaxLength(50);
                
                entity.Property(e => e.Category)
                    .HasMaxLength(50);
                
                entity.Property(e => e.Location)
                    .HasMaxLength(100);
                
                entity.Property(e => e.Status)
                    .HasMaxLength(20);
                
                entity.Property(e => e.Description)
                    .HasMaxLength(500);
                
                entity.Property(e => e.UnitPrice)
                    .HasPrecision(18, 2);
                
                entity.Property(e => e.CreatedDate)
                    .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}
