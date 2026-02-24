# OCD IT Inventory System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Clean Architecture Explanation](#clean-architecture-explanation)
3. [Database Structure](#database-structure)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [How Everything Works Together](#how-everything-works-together)
7. [Key Workflows](#key-workflows)

---

## System Overview

The OCD IT Inventory System is a **full-stack web application** that allows users to manage inventory items. It consists of:

- **Frontend**: React-based web interface (runs on `http://localhost:5174`)
- **Backend**: ASP.NET Core Web API (runs on `http://localhost:5278`)
- **Database**: SQL Server LocalDB (stores all inventory data)

### Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | ASP.NET Core 10.0 |
| Database | SQL Server 2025 (LocalDB) |
| State Management | React Context API |
| API Communication | Axios |
| ORM | Entity Framework Core |
| Design Pattern | CQRS (Command Query Responsibility Segregation) |

---

## Clean Architecture Explanation

### What is Clean Architecture?

Clean Architecture is a software design pattern that organizes code into independent layers. Each layer has a specific responsibility, and **dependencies only flow inward** (never outward).

### The 5 Layers

```
┌─────────────────────────────────────────┐
│   Layer 1: PRESENTATION (UI/API)       │ ← API Controllers - handles HTTP requests
├─────────────────────────────────────────┤
│   Layer 2: APPLICATION (Business Logic)│ ← Use Cases, DTOs, MediatR handlers
├─────────────────────────────────────────┤
│   Layer 3: INFRASTRUCTURE (External)    │ ← External services, utilities
├─────────────────────────────────────────┤
│   Layer 4: PERSISTENCE (Data Access)   │ ← Database, Repositories, EF Core
├─────────────────────────────────────────┤
│   Layer 5: DOMAIN (Core Business Rules)│ ← Entities, Interfaces (NO dependencies)
└─────────────────────────────────────────┘
```

### Why This Matters

- **Independence**: Each layer can be tested independently
- **Flexibility**: Can swap implementations without breaking everything
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features

### Our Implementation

```
OcdItInventory.Backend/
├── OcdItInventory.Domain/              ← Layer 5: Pure business rules
├── OcdItInventory.Application/         ← Layer 2: Use cases & business logic
├── OcdItInventory.Infrastructure/      ← Layer 3: External services
├── OcdItInventory.Persistence/         ← Layer 4: Database access
└── OcdItInventory.Presentation/        ← Layer 1: API endpoints
```

---

## Database Structure

### Database Name
```
OcdItInventoryDb
```

### InventoryItems Table

The database has ONE main table that stores all inventory information:

```sql
CREATE TABLE InventoryItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ItemName NVARCHAR(200) NOT NULL,
    ItemCode NVARCHAR(50) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    Location NVARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500),
    CreatedDate DATETIME2 NOT NULL,
    UpdatedDate DATETIME2 NOT NULL
)
```

### Column Descriptions

| Column | Type | Purpose |
|--------|------|---------|
| `Id` | INT | Unique identifier (auto-generated) |
| `ItemName` | String | Name of the inventory item |
| `ItemCode` | String | Unique code (auto-generated: ABC-1234567890) |
| `Category` | String | Item category (Electronics, Furniture, etc.) |
| `Location` | String | Where item is stored (Office, Warehouse, etc.) |
| `Quantity` | Int | Number of units available |
| `UnitPrice` | Decimal | Price per unit (in Philippine Peso ₱) |
| `Status` | String | Item status (Active, Inactive, Pending) |
| `Description` | String | Additional notes about the item |
| `CreatedDate` | DateTime | When the item was added |
| `UpdatedDate` | DateTime | When the item was last modified |

### Example Data

```
Id = 1
ItemName = "Dell Monitor"
ItemCode = "DEL-1709676667890"
Category = "Electronics"
Location = "Office"
Quantity = 5
UnitPrice = 12999.99
Status = "Active"
Description = "27-inch 4K monitor"
CreatedDate = 2026-02-23 12:30:45
UpdatedDate = 2026-02-23 12:30:45
```

---

## Backend Architecture

The backend follows Clean Architecture with 5 projects:

### 1. **OcdItInventory.Domain** (Layer 5 - Core)

**Purpose**: Contains core business entities and interfaces. NO external dependencies allowed.

**Key Files**:

```
Domain/
├── Entities/
│   ├── BaseEntity.cs          ← Abstract base class with Id, dates
│   └── InventoryItem.cs       ← Main entity definition
├── Interfaces/
│   ├── IRepository.cs         ← Generic repository contract
│   ├── IInventoryRepository.cs ← Inventory-specific repository
│   └── IUnitOfWork.cs         ← Transaction management
```

**Example - InventoryItem Entity**:
```csharp
public class InventoryItem : BaseEntity
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
```

---

### 2. **OcdItInventory.Application** (Layer 2 - Business Logic)

**Purpose**: Handles business logic using the CQRS pattern. Converts data to/from DTOs (Data Transfer Objects).

**Key Concepts**:

- **DTO**: Data Transfer Object - a simplified version of the entity for API communication
- **CQRS**: Separates Queries (reading) from Commands (writing)
- **MediatR**: Framework that sends Commands/Queries to Handlers

**Key Files**:

```
Application/
├── DTOs/
│   ├── InventoryItemDto.cs        ← For reading data
│   ├── CreateInventoryItemDto.cs  ← For creating data
│   └── UpdateInventoryItemDto.cs  ← For updating data
├── Features/
│   └── InventoryItems/
│       ├── Queries/
│       │   ├── GetAllInventoryItemsQuery.cs
│       │   ├── GetAllInventoryItemsHandler.cs
│       │   ├── GetInventoryItemByIdQuery.cs
│       │   └── GetInventoryItemByIdHandler.cs
│       └── Commands/
│           ├── CreateInventoryItemCommand.cs
│           ├── CreateInventoryItemHandler.cs
│           ├── UpdateInventoryItemCommand.cs
│           ├── UpdateInventoryItemHandler.cs
│           ├── DeleteInventoryItemCommand.cs
│           └── DeleteInventoryItemHandler.cs
├── Mappings/
│   └── MappingProfile.cs          ← AutoMapper configuration
└── Extensions/
    └── ServiceCollectionExtensions.cs ← DI registration
```

**Example - Query/Handler Pattern**:

```csharp
// QUERY (Request)
public class GetAllInventoryItemsQuery : IRequest<List<InventoryItemDto>>
{
}

// HANDLER (Response)
public class GetAllInventoryItemsHandler : IRequestHandler<GetAllInventoryItemsQuery, List<InventoryItemDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public async Task<List<InventoryItemDto>> Handle(GetAllInventoryItemsQuery request, CancellationToken cancellationToken)
    {
        var items = await _unitOfWork.InventoryRepository.GetAllAsync();
        return _mapper.Map<List<InventoryItemDto>>(items);
    }
}
```

---

### 3. **OcdItInventory.Persistence** (Layer 4 - Data Access)

**Purpose**: Manages database communication using Entity Framework Core.

**Key Files**:

```
Persistence/
├── Data/
│   ├── ApplicationDbContext.cs      ← Database configuration
│   └── ApplicationDbContextFactory.cs ← For migrations
├── Repositories/
│   ├── Repository.cs                ← Generic CRUD operations
│   ├── InventoryRepository.cs       ← Inventory-specific queries
│   └── UnitOfWork.cs                ← Transaction coordinator
├── Migrations/
│   └── 20260224010115_InitialCreate.cs ← Database schema
└── Extensions/
    └── ServiceCollectionExtensions.cs ← DI registration
```

**Repository Pattern**: Abstracts database queries into reusable methods

```csharp
// Generic Repository Interface
public interface IRepository<T> where T : BaseEntity
{
    Task<T> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

// Concrete Implementation
public class Repository<T> : IRepository<T> where T : BaseEntity
{
    private readonly ApplicationDbContext _context;

    public async Task<T> GetByIdAsync(int id)
    {
        return await _context.Set<T>().FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _context.Set<T>().ToListAsync();
    }
}
```

---

### 4. **OcdItInventory.Infrastructure** (Layer 3 - External Services)

**Purpose**: Handles external integrations (email, storage, etc.). Currently a placeholder for future features.

---

### 5. **OcdItInventory.Presentation** (Layer 1 - API)

**Purpose**: Exposes HTTP endpoints for the frontend to call.

**Key Files**:

```
Presentation/
├── Controllers/
│   └── InventoryController.cs    ← API endpoints
├── Program.cs                    ← Configuration & DI setup
├── appsettings.json              ← Connection string, JWT config
└── appsettings.Development.json  ← Development logging
```

**API Endpoints**:

```
GET    /api/inventory              ← Get all items
GET    /api/inventory/{id}         ← Get single item
POST   /api/inventory              ← Create new item
PUT    /api/inventory/{id}         ← Update existing item
DELETE /api/inventory/{id}         ← Delete item
GET    /api/inventory/search/{term} ← Search items
GET    /api/inventory/status/{status} ← Filter by status
```

**Example Controller**:

```csharp
[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IMediator _mediator;

    [HttpGet]
    public async Task<ActionResult<List<InventoryItemDto>>> GetAll()
    {
        var query = new GetAllInventoryItemsQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<InventoryItemDto>> Create([FromBody] CreateInventoryItemDto dto)
    {
        var command = new CreateInventoryItemCommand { /* ... */ };
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }
}
```

---

## Frontend Architecture

The frontend is a React application with component-based architecture.

### Directory Structure

```
adminInventory/
├── src/
│   ├── components/           ← Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Layout.jsx
│   │   ├── InventoryForm.jsx
│   │   ├── InventoryTable.jsx
│   │   ├── theme-provider.tsx
│   │   ├── hook-forms/
│   │   │   └── RHFSelect.jsx
│   │   ├── patterns/
│   │   │   └── p-input-10.tsx
│   │   └── ui/               ← Basic UI elements
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── field.tsx
│   │       ├── separator.tsx
│   │       └── switch.tsx
│   ├── pages/                ← Full page components
│   │   ├── Dashboard.jsx     ← Shows inventory summary
│   │   ├── Inventory.jsx     ← Lists all items with filter
│   │   ├── AddItem.jsx       ← Create new item
│   │   └── EditItem.jsx      ← Modify existing item
│   ├── context/              ← Global state management
│   │   ├── InventoryContext.jsx   ← Inventory data + API calls
│   │   └── ThemeContext.jsx       ← Dark/light mode
│   ├── hooks/                ← Custom React hooks
│   │   └── useInventory.js   ← Access inventory context
│   ├── services/             ← API communication
│   │   └── api.js            ← Axios client & endpoints
│   ├── App.jsx               ← Main app component
│   ├── main.jsx              ← Entry point
│   ├── App.css
│   └── index.css
├── public/                   ← Static assets
├── package.json              ← Dependencies
├── vite.config.js            ← Build configuration
└── tsconfig.json             ← TypeScript config
```

### Key Components

#### 1. **InventoryContext** (Global State)

**Purpose**: Manages all inventory data and API calls globally

```jsx
const InventoryContext = createContext()

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load items on mount
  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    const data = await getInventoryItems()
    setItems(data)
  }

  const addItem = async (item) => {
    const newItem = await createInventoryItem(item)
    setItems([...items, newItem])
  }

  const deleteItem = async (id) => {
    await deleteInventoryItem(id)
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <InventoryContext.Provider value={{ items, loading, error, addItem, deleteItem }}>
      {children}
    </InventoryContext.Provider>
  )
}
```

#### 2. **api.js** (Backend Communication)

**Purpose**: All HTTP requests go through this file

```javascript
const API_BASE_URL = "http://localhost:5278/api"

export const getInventoryItems = async () => {
  const response = await apiClient.get("/inventory")
  return response.data
}

export const createInventoryItem = async (item) => {
  const response = await apiClient.post("/inventory", item)
  return response.data
}

export const updateInventoryItem = async (id, item) => {
  const response = await apiClient.put(`/inventory/${id}`, item)
  return response.data
}

export const deleteInventoryItem = async (id) => {
  await apiClient.delete(`/inventory/${id}`)
}
```

#### 3. **InventoryForm** (User Input)

**Purpose**: Reusable form for creating/editing items

```jsx
export default function InventoryForm({ initialData = {}, onSubmit }) {
  const [itemName, setItemName] = useState(initialData.itemName || '')
  const [category, setCategory] = useState(initialData.category || '')
  // ... other fields

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      itemName,
      itemCode: `${itemName.substring(0, 3).toUpperCase()}-${Date.now()}`,
      category,
      // ...
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input value={itemName} onChange={e => setItemName(e.target.value)} />
      {/* More fields... */}
      <Button type="submit">Save Item</Button>
    </form>
  )
}
```

#### 4. **Inventory Page** (List & Filter)

**Purpose**: Display all items with category filtering

```jsx
export default function Inventory() {
  const { items } = useInventory()
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Get unique categories
  const categories = useMemo(() => {
    const unique = [...new Set(items.map(i => i.category))]
    return ['All', ...unique.sort()]
  }, [items])

  // Filter items
  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(i => i.category === selectedCategory)

  return (
    <Layout title="Inventory">
      <select onChange={e => setSelectedCategory(e.target.value)}>
        {categories.map(cat => <option key={cat}>{cat}</option>)}
      </select>
      <InventoryTable items={filteredItems} />
    </Layout>
  )
}
```

### Component Tree

```
App.jsx
├── InventoryProvider (Global State)
│   ├── Header
│   ├── Sidebar
│   └── Routes
│       ├── Dashboard
│       │   └── Summary cards
│       ├── Inventory
│       │   ├── Category filter
│       │   └── InventoryTable
│       ├── AddItem
│       │   └── InventoryForm
│       └── EditItem
│           └── InventoryForm (with initial data)
```

---

## How Everything Works Together

### Complete Flow Diagram

```
USER ACTION (Frontend)
    ↓
React Component updates state
    ↓
API Call via api.js
    ↓
HTTP Request to Backend
    ↓
InventoryController receives request
    ↓
MediatR sends Query/Command
    ↓
Handler executes business logic
    ↓
Repository accesses database
    ↓
Database returns data
    ↓
Handler maps entity to DTO
    ↓
Controller returns JSON response
    ↓
Frontend receives data
    ↓
React Context updates global state
    ↓
Components re-render with new data
    ↓
User sees updated UI
```

### CQRS Pattern Detailed

#### **Query (Get data)**

```
Frontend calls getInventoryItems()
    ↓
HTTP GET /api/inventory
    ↓
InventoryController.GetAll()
    ↓
MediatR sends GetAllInventoryItemsQuery
    ↓
GetAllInventoryItemsHandler executes
    ↓
Query database for all items
    ↓
Map entities to DTOs
    ↓
Return List<InventoryItemDto>
    ↓
Frontend receives JSON array
    ↓
setItems(data) updates state
```

#### **Command (Modify data)**

```
Frontend calls createInventoryItem(formData)
    ↓
HTTP POST /api/inventory with body
    ↓
InventoryController.Create(dto)
    ↓
MediatR sends CreateInventoryItemCommand
    ↓
CreateInventoryItemHandler executes
    ↓
Map DTO to Entity
    ↓
Add to database
    ↓
Call SaveChanges()
    ↓
Return created item as DTO
    ↓
Frontend receives new item
    ↓
setItems([...items, newItem])
    ↓
UI updates with new row
```

---

## Key Workflows

### Workflow 1: Viewing All Items

**Steps**:
1. User navigates to `/inventory` page
2. Dashboard calls `useInventory()` hook
3. Hook returns `items` from context
4. useEffect in context loads data on mount: `loadItems()`
5. `loadItems()` calls `getInventoryItems()` from api.js
6. HTTP GET request sent to `http://localhost:5278/api/inventory`
7. Backend's `InventoryController.GetAll()` receives request
8. Sends `GetAllInventoryItemsQuery` through MediatR
9. Handler queries database for all `InventoryItems`
10. Maps entities to `InventoryItemDto` objects
11. Returns JSON array to frontend
12. Context calls `setItems(data)` 
13. Components re-render and display table

**Code Flow**:
```
Inventory.jsx → useInventory() → InventoryContext
→ getInventoryItems() → api.js → Axios
→ InventoryController.GetAll()
→ MediatR.Send(GetAllInventoryItemsQuery)
→ Handler → UnitOfWork.InventoryRepository.GetAllAsync()
→ Database Query
→ Mapper.Map(entities, InventoryItemDto)
→ JSON Response
→ Frontend setItems()
```

---

### Workflow 2: Creating a New Item

**Steps**:
1. User fills out `InventoryForm` and clicks "Save Item"
2. Form calls `onSubmit(formData)` callback
3. Parent component (AddItem.jsx) calls `addItem(formData)`
4. `addItem()` calls `createInventoryItem(item)` from api.js
5. HTTP POST request to `http://localhost:5278/api/inventory`
6. Backend's `InventoryController.Create(dto)` receives request
7. Sends `CreateInventoryItemCommand` through MediatR
8. Handler maps DTO to `InventoryItem` entity
9. Calls `repository.AddAsync(entity)`
10. Database INSERT executes
11. `unitOfWork.SaveChangesAsync()` commits transaction
12. Returns saved entity as DTO with generated `Id`
13. Frontend receives response
14. Calls `setItems([...items, newItem])` to add to list
15. User navigated to `/inventory` page
16. New item appears in table

**Code Flow**:
```
InventoryForm.onSubmit()
→ AddItem.addItem()
→ api.createInventoryItem()
→ HTTP POST to /api/inventory
→ InventoryController.Create()
→ MediatR.Send(CreateInventoryItemCommand)
→ Handler: Mapper.Map(dto, entity)
→ Repository.AddAsync()
→ UnitOfWork.SaveChangesAsync()
→ Database INSERT
→ Entity Framework generates Id
→ Mapper.Map(entity, InventoryItemDto)
→ JSON Response with new item
→ Frontend setItems()
→ Navigation to /inventory
→ Table displays new row
```

---

### Workflow 3: Filtering by Category

**Steps**:
1. User selects a category from dropdown on `/inventory`
2. `setSelectedCategory(newCategory)` updates state
3. `filteredItems` useMemo re-calculates:
   - If "All" selected: return all items
   - Otherwise: filter items by selected category
4. InventoryTable receives filtered array
5. Table only renders matching items
6. **No API call** - all filtering happens on frontend

**Code Flow**:
```
Category Dropdown onChange
→ setSelectedCategory()
→ useMemo recalculates filteredItems
→ items.filter(i => i.category === selected)
→ InventoryTable key={filteredItems}
→ UI updates (only matching items shown)
```

---

### Workflow 4: Deleting an Item

**Steps**:
1. User clicks "Delete" button for an item
2. Calls `deleteItem(itemId)`
3. Context calls `deleteInventoryItem(id)` from api.js
4. HTTP DELETE request to `http://localhost:5278/api/inventory/{id}`
5. Backend's `InventoryController.Delete(id)` receives request
6. Sends `DeleteInventoryItemCommand` through MediatR
7. Handler fetches entity from database
8. Calls `repository.DeleteAsync(entity)` (marks for deletion)
9. `unitOfWork.SaveChangesAsync()` commits DELETE
10. Returns OK (200) response
11. Frontend calls `setItems(items.filter(i => i.id !== id))`
12. Item removed from state
13. Table re-renders without deleted item

**Code Flow**:
```
Delete Button Click
→ InventoryTable onClick={() => deleteItem(id)}
→ Context deleteItem()
→ api.deleteInventoryItem(id)
→ HTTP DELETE /api/inventory/{id}
→ InventoryController.Delete()
→ MediatR.Send(DeleteInventoryItemCommand)
→ Handler: Repository.DeleteAsync()
→ UnitOfWork.SaveChangesAsync()
→ Database DELETE
→ 200 OK Response
→ Frontend setItems(filtered)
→ Table updates
```

---

## Data Flow Diagram

### Adding an Item (Complete)

```
┌─────────────────────────────────────────────┐
│ FRONTEND: User fills form and clicks Save   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ InventoryForm.jsx    │
        │ handleSubmit()       │
        │ Calls onSubmit()     │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ AddItem.jsx          │
        │ Calls addItem()      │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ InventoryContext.jsx     │
        │ addItem() function       │
        │ Calls API function       │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ api.js                   │
        │ createInventoryItem()    │
        │ Makes HTTP POST request  │
        └──────────┬───────────────┘
                   │
   ┌───────────────┼───────────────┐
   │ NETWORK TRANSMISSION (HTTP) │
   └───────────────┼───────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │ BACKEND: HTTP POST Received      │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │ InventoryController.cs           │
        │ Create(createDto)                │
        │ Sends Command via MediatR        │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │ MediatR                          │
        │ Routes to Handler                │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌───────────────────────────────────────┐
        │CreateInventoryItemHandler.cs          │
        │ - Map DTO to Entity                   │
        │ - Call Repository.AddAsync()          │
        │ - Call UnitOfWork.SaveChangesAsync()  │
        └──────────┬────────────────────────────┘
                   │
                   ▼
        ┌───────────────────────────────────────┐
        │ Repository.cs                         │
        │ AddAsync(entity)                      │
        │ dbContext.Set<T>().Add(entity)        │
        └──────────┬────────────────────────────┘
                   │
                   ▼
        ┌───────────────────────────────────────┐
        │ UnitOfWork.cs                         │
        │ SaveChangesAsync()                    │
        │ dbContext.SaveChangesAsync()          │
        └──────────┬────────────────────────────┘
                   │
                   ▼
        ┌───────────────────────────────────────┐
        │ Entity Framework Core                 │
        │ Generates INSERT SQL                  │
        └──────────┬────────────────────────────┘
                   │
                   ▼
        ┌───────────────────────────────────────┐
        │ DATABASE: Local SQL Server            │
        │ Executes INSERT                       │
        │ Generates Identity (ID)               │
        └──────────┬────────────────────────────┘
                   │
                   ▼
        ┌───────────────────────────────────────┐
        │ Handler                               │
        │ Map Entity back to DTO                │
        │ Return DTO                            │
        └──────────┬────────────────────────────┘
                   │
                   ▼
        ┌───────────────────────────────────────┐
        │ InventoryController                   │
        │ Return CreatedAtAction(201)           │
        └──────────┬────────────────────────────┘
                   │
   ┌───────────────┼───────────────┐
   │ NETWORK TRANSMISSION (JSON)  │
   └───────────────┼───────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │ FRONTEND: Response Received      │
        │ HTTP 201 with item JSON          │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │ InventoryContext.jsx             │
        │ setItems([...items, newItem])    │
        │ Updates global state             │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │ React Components                 │
        │ useInventory() hook triggered    │
        │ Re-render with new data          │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │ USER: Sees new item in table ✓   │
        └──────────────────────────────────┘
```

---

## Summary

### Frontend Responsibility
- Display user interface
- Collect user input
- Call backend APIs
- Manage local state (context)
- Re-render when data changes

### Backend Responsibility
- Validate incoming data
- Execute business logic
- Manage database transactions
- Return data in standardized format (DTO)
- Handle errors and return appropriate responses

### Database Responsibility
- Persist data to disk
- Ensure data consistency
- Execute queries efficiently
- Maintain data integrity with ID generation

### Clean Architecture Benefits
- **Testability**: Test each layer independently
- **Maintainability**: Know exactly where to make changes
- **Scalability**: Add features without breaking existing code
- **Flexibility**: Swap implementations easily

---

## Running the System

### Start Database
```powershell
sqllocaldb start MSSQLLocalDB
```

### Start Backend
```powershell
cd C:\Users\jason.maunes\Desktop\ocd-it-inventory\OcdItInventory.Backend\OcdItInventory.Presentation
dotnet run
# Backend runs on http://localhost:5278
```

### Start Frontend
```powershell
cd c:\Users\jason.maunes\Desktop\ocd-it-inventory\adminInventory
npm run dev
# Frontend runs on http://localhost:5174
```

Open browser to `http://localhost:5174` and start using the application!

---

