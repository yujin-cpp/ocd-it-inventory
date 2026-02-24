# OCD IT Inventory - Database Setup Instructions

## Overview
This document provides step-by-step instructions to create and set up the SQL Server database for the OCD IT Inventory application.

---

## Prerequisites
- Visual Studio or SQL Server Express installed
- .NET 10.0+ SDK installed
- Backend solution at: `C:\Users\jason.maunes\Desktop\ocd-it-inventory\OcdItInventory.Backend`

---

## Option 1: Using SQL Server Express (Recommended if already installed)

### Step 1: Start SQL Server Express
1. Press `Windows Key + R` to open Run dialog
2. Type `services.msc` and press Enter
3. Look for **SQL Server (SQLEXPRESS)** in the Services list
4. Right-click it and select **Start** (or **Restart** if already running)
5. Wait for the status to show "Running"
6. Close the Services window

### Step 2: Apply Database Migration
1. Open PowerShell or Command Prompt
2. Navigate to the backend directory:
   ```
   cd C:\Users\jason.maunes\Desktop\ocd-it-inventory\OcdItInventory.Backend
   ```
3. Run the Entity Framework migration command:
   ```
   dotnet ef database update --project OcdItInventory.Persistence
   ```
4. Wait for completion. You should see: "Done. To undo this action, use 'ef migrations remove'."

### Step 3: Verify Database Creation
1. Open SQL Server Management Studio (SSMS)
2. Connect to: `.\SQLEXPRESS`
3. Expand **Databases** in Object Explorer
4. You should see **OcdItInventoryDb** in the list
5. Expand it to verify the **InventoryItems** table exists

---

## Option 2: Using SQL Server LocalDB (Alternative)

### Step 1: Create LocalDB Instance
1. Open PowerShell as Administrator
2. Run:
   ```
   sqllocaldb create MSSQLLocalDB
   sqllocaldb start MSSQLLocalDB
   ```

### Step 2: Update Connection String
1. Open: `C:\Users\jason.maunes\Desktop\ocd-it-inventory\OcdItInventory.Backend\OcdItInventory.Presentation\appsettings.json`
2. Find the line with `"ConnectionString":`
3. Replace the current value with:
   ```
   "Server=(localdb)\\MSSQLLocalDB;Database=OcdItInventoryDb;Trusted_Connection=true;Encrypt=false;TrustServerCertificate=True;"
   ```
4. Save the file

### Step 3: Apply Database Migration
1. Open PowerShell or Command Prompt
2. Navigate to the backend directory:
   ```
   cd C:\Users\jason.maunes\Desktop\ocd-it-inventory\OcdItInventory.Backend
   ```
3. Run the Entity Framework migration command:
   ```
   dotnet ef database update --project OcdItInventory.Persistence
   ```
4. Wait for completion

### Step 4: Verify Database Creation
1. Open PowerShell
2. Run:
   ```
   sqllocaldb connect MSSQLLocalDB
   ```
3. You can query the database (this opens sqlcmd):
   ```
   SELECT name FROM sys.databases WHERE name = 'OcdItInventoryDb';
   GO
   exit
   ```

---

## After Database Creation

### Step 1: Restart the Backend Server
1. Open PowerShell
2. Navigate to backend:
   ```
   cd C:\Users\jason.maunes\Desktop\ocd-it-inventory\OcdItInventory.Backend\OcdItInventory.Presentation
   ```
3. Run:
   ```
   dotnet run
   ```
4. Wait for: "Application started. Press Ctrl+C to shut down."

### Step 2: Verify Frontend Connection
1. Open your browser to: `http://localhost:5174`
2. The Dashboard should now load with empty data (no error messages)
3. Check browser console (F12) for no errors

### Step 3: Test API Endpoint (Optional)
1. Open browser to: `http://localhost:5278/swagger`
2. Try the GET `/api/inventory` endpoint (Click "Try it out" → "Execute")
3. You should get an empty array: `[]`

---

## Troubleshooting

### Error: "A network-related or instance-specific error occurred"
- **Solution**: Ensure SQL Server Express is running (see Option 1, Step 1)
- Use `services.msc` to check the service status

### Error: "Could not create an instance of plugin class"
- **Solution**: Rebuild the solution
  ```
  cd C:\Users\jason.maunes\Desktop\ocd-it-inventory\OcdItInventory.Backend
  dotnet clean
  dotnet build
  ```

### Error: "The database already exists"
- **Solution**: The migration may have already been applied; proceed to "After Database Creation" section

### Database Won't Connect in Frontend
- **Verify**: Backend is running on `http://localhost:5278`
- **Verify**: Swagger works at `http://localhost:5278/swagger`
- **Check**: Browser console (F12) for any errors
- **Restart**: Both frontend and backend servers

---

## Connection String Reference

### SQL Server Express
```
Server=.\SQLEXPRESS;Database=OcdItInventoryDb;Trusted_Connection=true;Encrypt=false;TrustServerCertificate=True;
```

### SQL Server LocalDB
```
Server=(localdb)\MSSQLLocalDB;Database=OcdItInventoryDb;Trusted_Connection=true;Encrypt=false;TrustServerCertificate=True;
```

---

## Database Details

- **Database Name**: OcdItInventoryDb
- **Table**: InventoryItems
- **Columns**: 
  - Id (Primary Key)
  - ItemName (String, max 200)
  - ItemCode (String, max 50)
  - Category (String, max 100)
  - Location (String, max 100)
  - Quantity (int)
  - UnitPrice (decimal)
  - Status (String, max 50)
  - Description (String, max 500)
  - CreatedDate (DateTime)
  - UpdatedDate (DateTime)

---

## Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all paths are correct for your system
3. Ensure SQL Server/LocalDB service is running
4. Check that both frontend and backend servers are running on correct ports
5. Review browser console (F12) and backend terminal for error messages
