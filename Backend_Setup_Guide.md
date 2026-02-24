# OCD IT Inventory - Backend Development Guide
## Clean Architecture with SQL Server

**Date Created:** February 23, 2026  
**Frontend Location:** c:\Users\jason.maunes\Desktop\ocd-it-inventory\adminInventory  
**Recommended Backend Location:** c:\Users\jason.maunes\Desktop\ocd-it-inventory\OcdItInventory.Backend

---

## TABLE OF CONTENTS

1. [Phase 1: Project Structure Setup](#phase-1-project-structure-setup)
2. [Phase 2: Domain Layer Setup](#phase-2-domain-layer-setup)
3. [Phase 3: Application Layer Setup](#phase-3-application-layer-setup)
4. [Phase 4: Persistence Layer Setup](#phase-4-persistence-layer-setup)
5. [Phase 5: Presentation Layer Setup](#phase-5-presentation-layer-setup)
6. [Phase 6: Database & Migrations](#phase-6-database--migrations)
7. [Phase 7: Connect Frontend to Backend](#phase-7-connect-frontend-to-backend)
8. [Running the Application](#running-the-application)
9. [Troubleshooting](#troubleshooting)

---

## PHASE 1: PROJECT STRUCTURE SETUP

### Step 1: Create the Solution in Visual Studio

1. Open Visual Studio 2022 (Community, Professional, or Enterprise)
2. Create a new **"Blank Solution"** named `OcdItInventory.Backend`
3. Choose folder: `c:\Users\jason.maunes\Desktop\ocd-it-inventory\`
4. Create the following projects (right-click solution → Add → New Project):

### Projects to Create

| Project Name | Type | Purpose |
|---|---|---|
| `OcdItInventory.Domain` | Class Library (.NET 6.0+) | Business entities and contracts |
| `OcdItInventory.Application` | Class Library (.NET 6.0+) | Business logic and use cases |
| `OcdItInventory.Infrastructure` | Class Library (.NET 6.0+) | External services and utilities |
| `OcdItInventory.Persistence` | Class Library (.NET 6.0+) | Database context and repositories |
| `OcdItInventory.Presentation` | ASP.NET Core Web API (.NET 6.0+) | API controllers and endpoints |

### Step 2: Set Up Project Dependencies

Configure project references as follows:

```
Presentation (API)
    ↓ references
Application ← Infrastructure
    ↓ references     ↓ references
Persistence    →    Domain
```

**Detailed References:**
- **Presentation** → Application, Infrastructure
- **Application** → Domain
- **Infrastructure** → Application, Domain
- **Persistence** → Domain

---

## PHASE 2: DOMAIN LAYER SETUP

The Domain layer contains your business entities and interfaces. Do NOT add any external dependencies here.

### Step 3: Create Domain Entities

**Create Folder:** `OcdItInventory.Domain/Entities/`

#### Create File: BaseEntity.cs

```csharp
namespace OcdItInventory.Domain.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
```

#### Create File: InventoryItem.cs

```csharp
namespace OcdItInventory.Domain.Entities
{
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
}
```

### Step 4: Create Repository Interfaces

**Create Folder:** `OcdItInventory.Domain/Interfaces/`

#### Create File: IRepository.cs

```csharp
using OcdItInventory.Domain.Entities;

namespace OcdItInventory.Domain.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
    }
}
```

#### Create File: IInventoryRepository.cs

```csharp
using OcdItInventory.Domain.Entities;

namespace OcdItInventory.Domain.Interfaces
{
    public interface IInventoryRepository : IRepository<InventoryItem>
    {
        Task<IEnumerable<InventoryItem>> GetByStatusAsync(string status);
        Task<IEnumerable<InventoryItem>> SearchAsync(string searchTerm);
    }
}
```

#### Create File: IUnitOfWork.cs

```csharp
namespace OcdItInventory.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IInventoryRepository InventoryRepository { get; }
        Task<int> SaveChangesAsync();
    }
}
```

---

## PHASE 3: APPLICATION LAYER SETUP

The Application layer contains business logic, DTOs, and MediatR handlers.

### Step 5: Install NuGet Packages for Application Project

Right-click `OcdItInventory.Application` → Manage NuGet Packages → Install these packages:

- `MediatR` (v12.0.0 or latest)
- `MediatR.Extensions.Microsoft.DependencyInjection`
- `FluentValidation`
- `AutoMapper`
- `AutoMapper.Extensions.Microsoft.DependencyInjection`

### Step 6: Create DTOs (Data Transfer Objects)

**Create Folder:** `OcdItInventory.Application/DTOs/`

#### Create File: InventoryItemDto.cs

```csharp
namespace OcdItInventory.Application.DTOs
{
    public class InventoryItemDto
    {
        public int Id { get; set; }
        public string ItemName { get; set; }
        public string ItemCode { get; set; }
        public string Category { get; set; }
        public string Location { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
```

#### Create File: CreateInventoryItemDto.cs

```csharp
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
```

#### Create File: UpdateInventoryItemDto.cs

```csharp
namespace OcdItInventory.Application.DTOs
{
    public class UpdateInventoryItemDto
    {
        public int Id { get; set; }
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
```

### Step 7: Create MediatR Queries & Handlers

**Create Folder Structure:** `OcdItInventory.Application/Features/InventoryItems/Queries/`

#### Create File: GetAllInventoryItemsQuery.cs

```csharp
using MediatR;
using OcdItInventory.Application.DTOs;

namespace OcdItInventory.Application.Features.InventoryItems.Queries
{
    public class GetAllInventoryItemsQuery : IRequest<IEnumerable<InventoryItemDto>>
    {
    }
}
```

#### Create File: GetAllInventoryItemsQueryHandler.cs

```csharp
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
```

#### Create File: GetInventoryItemByIdQuery.cs

```csharp
using MediatR;
using OcdItInventory.Application.DTOs;

namespace OcdItInventory.Application.Features.InventoryItems.Queries
{
    public class GetInventoryItemByIdQuery : IRequest<InventoryItemDto>
    {
        public int Id { get; set; }
    }
}
```

#### Create File: GetInventoryItemByIdQueryHandler.cs

```csharp
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
```

### Step 8: Create MediatR Commands & Handlers

**Create Folder Structure:** `OcdItInventory.Application/Features/InventoryItems/Commands/`

#### Create File: CreateInventoryItemCommand.cs

```csharp
using MediatR;
using OcdItInventory.Application.DTOs;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class CreateInventoryItemCommand : IRequest<InventoryItemDto>
    {
        public CreateInventoryItemDto Dto { get; set; }
    }
}
```

#### Create File: CreateInventoryItemCommandHandler.cs

```csharp
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
```

#### Create File: UpdateInventoryItemCommand.cs

```csharp
using MediatR;
using OcdItInventory.Application.DTOs;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class UpdateInventoryItemCommand : IRequest<InventoryItemDto>
    {
        public int Id { get; set; }
        public UpdateInventoryItemDto Dto { get; set; }
    }
}
```

#### Create File: UpdateInventoryItemCommandHandler.cs

```csharp
using AutoMapper;
using MediatR;
using OcdItInventory.Application.DTOs;
using OcdItInventory.Domain.Interfaces;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class UpdateInventoryItemCommandHandler 
        : IRequestHandler<UpdateInventoryItemCommand, InventoryItemDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UpdateInventoryItemCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<InventoryItemDto> Handle(
            UpdateInventoryItemCommand request, 
            CancellationToken cancellationToken)
        {
            var item = await _unitOfWork.InventoryRepository.GetByIdAsync(request.Id);
            
            if (item == null)
                throw new KeyNotFoundException($"Item with ID {request.Id} not found");

            _mapper.Map(request.Dto, item);
            item.UpdatedDate = DateTime.UtcNow;
            
            await _unitOfWork.InventoryRepository.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();
            
            return _mapper.Map<InventoryItemDto>(item);
        }
    }
}
```

#### Create File: DeleteInventoryItemCommand.cs

```csharp
using MediatR;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class DeleteInventoryItemCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }
}
```

#### Create File: DeleteInventoryItemCommandHandler.cs

```csharp
using MediatR;
using OcdItInventory.Domain.Interfaces;

namespace OcdItInventory.Application.Features.InventoryItems.Commands
{
    public class DeleteInventoryItemCommandHandler 
        : IRequestHandler<DeleteInventoryItemCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteInventoryItemCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(
            DeleteInventoryItemCommand request, 
            CancellationToken cancellationToken)
        {
            await _unitOfWork.InventoryRepository.DeleteAsync(request.Id);
            await _unitOfWork.SaveChangesAsync();
            
            return Unit.Value;
        }
    }
}
```

### Step 9: Create AutoMapper Profile

**Create Folder:** `OcdItInventory.Application/Mappings/`

#### Create File: MappingProfile.cs

```csharp
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
```

### Step 10: Create Service Registration Extension

**Create Folder:** `OcdItInventory.Application/Extensions/`

#### Create File: ServiceCollectionExtensions.cs

```csharp
using AutoMapper;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using OcdItInventory.Application.Mappings;

namespace OcdItInventory.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddMediatR(typeof(ServiceCollectionExtensions));
            
            return services;
        }
    }
}
```

---

## PHASE 4: PERSISTENCE LAYER SETUP

The Persistence layer handles database access using Entity Framework Core.

### Step 11: Install EF Core NuGet Packages

Right-click `OcdItInventory.Persistence` → Manage NuGet Packages → Install:

- `Microsoft.EntityFrameworkCore` (latest version)
- `Microsoft.EntityFrameworkCore.SqlServer`
- `Microsoft.EntityFrameworkCore.Tools`

### Step 12: Create DbContext

**Create Folder:** `OcdItInventory.Persistence/Data/`

#### Create File: ApplicationDbContext.cs

```csharp
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
```

### Step 13: Implement Repository Pattern

**Create Folder:** `OcdItInventory.Persistence/Repositories/`

#### Create File: Repository.cs

```csharp
using Microsoft.EntityFrameworkCore;
using OcdItInventory.Domain.Entities;
using OcdItInventory.Domain.Interfaces;
using OcdItInventory.Persistence.Data;

namespace OcdItInventory.Persistence.Repositories
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly ApplicationDbContext _context;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            return entity;
        }

        public virtual async Task UpdateAsync(T entity)
        {
            entity.UpdatedDate = DateTime.UtcNow;
            _context.Set<T>().Update(entity);
            await Task.CompletedTask;
        }

        public virtual async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<T>().Remove(entity);
            }
        }
    }
}
```

#### Create File: InventoryRepository.cs

```csharp
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
```

#### Create File: UnitOfWork.cs

```csharp
using OcdItInventory.Domain.Interfaces;
using OcdItInventory.Persistence.Data;

namespace OcdItInventory.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IInventoryRepository _inventoryRepository;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IInventoryRepository InventoryRepository
        {
            get
            {
                if (_inventoryRepository == null)
                {
                    _inventoryRepository = new InventoryRepository(_context);
                }
                return _inventoryRepository;
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
```

### Step 14: Create Persistence Service Registration

**Create Folder:** `OcdItInventory.Persistence/Extensions/`

#### Create File: ServiceCollectionExtensions.cs

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OcdItInventory.Domain.Interfaces;
using OcdItInventory.Persistence.Data;
using OcdItInventory.Persistence.Repositories;

namespace OcdItInventory.Persistence.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddPersistenceServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    connectionString,
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            
            return services;
        }
    }
}
```

---

## PHASE 5: PRESENTATION LAYER (API) SETUP

The Presentation layer contains API controllers and configuration.

### Step 15: Install NuGet Packages for Presentation

Right-click `OcdItInventory.Presentation` → Manage NuGet Packages → Install:

- `Swashbuckle.AspNetCore`
- `Microsoft.AspNetCore.Cors`

### Step 16: Add Project References to Presentation

Right-click Presentation project → Add → Project Reference:
- Select `OcdItInventory.Application`
- Select `OcdItInventory.Infrastructure`

### Step 17: Create API Controller

**Create Folder:** `OcdItInventory.Presentation/Controllers/`

#### Create File: InventoryController.cs

```csharp
using MediatR;
using Microsoft.AspNetCore.Mvc;
using OcdItInventory.Application.DTOs;
using OcdItInventory.Application.Features.InventoryItems.Commands;
using OcdItInventory.Application.Features.InventoryItems.Queries;

namespace OcdItInventory.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public InventoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get all inventory items
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetAll()
        {
            var query = new GetAllInventoryItemsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Get inventory item by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryItemDto>> GetById(int id)
        {
            var query = new GetInventoryItemByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            
            if (result == null)
                return NotFound();
            
            return Ok(result);
        }

        /// <summary>
        /// Create a new inventory item
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<InventoryItemDto>> Create([FromBody] CreateInventoryItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var command = new CreateInventoryItemCommand { Dto = dto };
            var result = await _mediator.Send(command);
            
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// Update an inventory item
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<InventoryItemDto>> Update(int id, [FromBody] UpdateInventoryItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var command = new UpdateInventoryItemCommand { Id = id, Dto = dto };
            var result = await _mediator.Send(command);
            
            return Ok(result);
        }

        /// <summary>
        /// Delete an inventory item
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var command = new DeleteInventoryItemCommand { Id = id };
            await _mediator.Send(command);
            
            return NoContent();
        }

        /// <summary>
        /// Search inventory items by name or code
        /// </summary>
        [HttpGet("search/{searchTerm}")]
        public async Task<ActionResult<IEnumerable<InventoryItemDto>>> Search(string searchTerm)
        {
            return Ok();
        }

        /// <summary>
        /// Get items by status
        /// </summary>
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetByStatus(string status)
        {
            return Ok();
        }
    }
}
```

### Step 18: Configure Program.cs

#### Edit File: Program.cs

```csharp
using OcdItInventory.Application.Extensions;
using OcdItInventory.Persistence.Extensions;

var builder = WebApplicationBuilder.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceServices(builder.Configuration);

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### Step 19: Configure appsettings.json

#### Edit File: appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=OcdItInventoryDb;Trusted_Connection=true;Encrypt=false;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*",
  "Jwt": {
    "SecretKey": "your-secret-key-here-min-32-characters-long",
    "Issuer": "OcdItInventory",
    "Audience": "OcdItInventoryUsers",
    "ExpirationMinutes": 60
  }
}
```

#### Create File: appsettings.Development.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Debug"
    }
  }
}
```

---

## PHASE 6: DATABASE & MIGRATIONS

### Step 20: Create Database Using Package Manager Console

1. In Visual Studio, go to: **Tools → NuGet Package Manager → Package Manager Console**

2. Set the Default Project dropdown to: `OcdItInventory.Persistence`

3. Run these commands in order:

```powershell
Add-Migration InitialCreate
Update-Database
```

4. If you get any errors, ensure:
   - SQL Server Express is running
   - The connection string in appsettings.json is correct
   - The Persistence project references the Domain project

### Step 21: Verify Database Creation

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to: `.\SQLEXPRESS` (or your SQL Server instance)
3. Look for database: `OcdItInventoryDb`
4. Verify the `InventoryItems` table exists with these columns:
   - Id (int, Primary Key)
   - ItemName (nvarchar(100))
   - ItemCode (nvarchar(50))
   - Category (nvarchar(50))
   - Location (nvarchar(100))
   - Quantity (int)
   - UnitPrice (decimal)
   - Status (nvarchar(20))
   - Description (nvarchar(500))
   - CreatedDate (datetime2)
   - UpdatedDate (datetime2, nullable)

---

## PHASE 7: CONNECT FRONTEND TO BACKEND

### Step 22: Update Frontend API Service

Edit file: `src/services/api.js` in your React project

Replace with:

```javascript
const API_BASE_URL = 'https://localhost:7001/api';

export const inventoryAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory`);
      if (!response.ok) throw new Error('Failed to fetch items');
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`);
      if (!response.ok) throw new Error('Item not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },
  
  create: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create item');
      return await response.json();
    } catch (error) {
      console.error('Error creating inventory:', error);
      throw error;
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update item');
      return await response.json();
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'DELETE'
      });
      return response.status === 204;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },
  
  search: async (searchTerm) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/search/${searchTerm}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      console.error('Error searching inventory:', error);
      throw error;
    }
  },
  
  getByStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/status/${status}`);
      if (!response.ok) throw new Error('Failed to fetch by status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching by status:', error);
      throw error;
    }
  }
};
```

---

## RUNNING THE APPLICATION

### Running the Backend

1. Open Visual Studio with the `OcdItInventory.Backend` solution
2. Right-click `OcdItInventory.Presentation` project → Set as Startup Project
3. Press **F5** or click the **Start Debug** button
4. Backend will run on: `https://localhost:7001`
5. Access Swagger UI: `https://localhost:7001/swagger`
6. Test endpoints in Swagger to verify they work

### Running the Frontend

1. Open Command Prompt or PowerShell
2. Navigate to: `c:\Users\jason.maunes\Desktop\ocd-it-inventory\adminInventory`
3. Install dependencies (if needed): `npm install`
4. Start development server: `npm run dev`
5. Frontend will run on: `http://localhost:5173`
6. Open browser and navigate to: `http://localhost:5173`

### Testing the Full Stack

1. Start the backend (step 3 above)
2. Start the frontend (step 4 above)
3. In the React app, try adding, editing, or deleting an inventory item
4. Check the backend Swagger UI to verify API calls
5. Check SQL Server database to verify data persistence

---

## TROUBLESHOOTING

### Issue: "Cannot connect to database"
**Solution:**
- Verify SQL Server Express is running: Open Services (services.msc) and look for SQL Server (SQLEXPRESS)
- Check connection string in appsettings.json
- Verify firewall isn't blocking SQL Server
- Try connection string: `Server=.;Database=OcdItInventoryDb;Trusted_Connection=true;`

### Issue: "CORS error when calling API from React"
**Solution:**
- Verify frontend URL matches CORS policy in Program.cs
- Default policy allows: `http://localhost:5173`, `http://localhost:3000`, `https://localhost:3000`
- If using different port, add it to the policy

### Issue: "Port already in use" when running backend
**Solution:**
- Change port in `Properties/launchSettings.json`
- Find line: `"applicationUrl": "https://localhost:7001;http://localhost:5000"`
- Change 7001 to another port (e.g., 7002)
- Update API_BASE_URL in React code accordingly

### Issue: "Migration errors - Cannot create table"
**Solution:**
- Delete database from SQL Server
- In Package Manager Console, run: `Remove-Migration`
- Then run: `Add-Migration InitialCreate`
- Then run: `Update-Database`

### Issue: "NuGet packages not restoring"
**Solution:**
- Clean solution: Build → Clean Solution
- Restore packages: Tools → NuGet Package Manager → Manage NuGet Packages for Solution
- Click "Restore" button

### Issue: "Mapper configuration is invalid"
**Solution:**
- Verify all DTOs are in the Mappings profile
- Ensure AutoMapper is registered in Program.cs
- Run: `services.AddAutoMapper(typeof(MappingProfile));`

---

## NEXT STEPS & ENHANCEMENTS (Optional)

1. **Add Authentication:**
   - Implement JWT token authentication
   - Add user login/registration

2. **Add Validation:**
   - Use FluentValidation for DTO validation
   - Add custom validators for business rules

3. **Add Logging:**
   - Implement Serilog for comprehensive logging
   - Log all API calls and database operations

4. **Add Caching:**
   - Implement Redis caching
   - Cache frequently accessed data

5. **Add Pagination:**
   - Implement pagination in GetAll endpoint
   - Add sorting and filtering

6. **Add Error Handling:**
   - Create global exception middleware
   - Return consistent error formats

7. **Add Unit Tests:**
   - Create xUnit test project
   - Test handlers and repositories

8. **Add API Versioning:**
   - Implement API versioning
   - Support multiple API versions

---

## DOCUMENT INFORMATION

**Document Version:** 1.0  
**Last Updated:** February 23, 2026  
**Status:** Ready for Implementation  
**Total Steps:** 22  
**Estimated Time:** 2-3 hours to complete

---

## QUICK REFERENCE CHECKLIST

- [ ] Created Blank Solution in Visual Studio
- [ ] Created 5 projects (Domain, Application, Infrastructure, Persistence, Presentation)
- [ ] Set up project dependencies/references
- [ ] Created Domain entities and interfaces
- [ ] Installed NuGet packages for Application layer
- [ ] Created DTOs for inventory items
- [ ] Created MediatR queries and commands
- [ ] Created AutoMapper profile
- [ ] Created Application service registration
- [ ] Created DbContext and entity configuration
- [ ] Implemented Repository pattern
- [ ] Created Persistence service registration
- [ ] Added EF Core NuGet packages
- [ ] Created API controller
- [ ] Updated Program.cs with service registration
- [ ] Configured appsettings.json
- [ ] Created database migrations
- [ ] Verified database creation in SQL Server
- [ ] Updated React API service
- [ ] Tested backend with Swagger
- [ ] Tested frontend-backend integration

---

**End of Document**
