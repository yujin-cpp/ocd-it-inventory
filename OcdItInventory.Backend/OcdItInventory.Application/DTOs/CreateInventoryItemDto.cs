namespace OcdItInventory.Application.DTOs
{
    public class CreateInventoryItemDto
    {
        public string ItemName { get; set; }
        public string ItemCode { get; set; }
        public string Category { get; set; }
        public string Location { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
    }
}
