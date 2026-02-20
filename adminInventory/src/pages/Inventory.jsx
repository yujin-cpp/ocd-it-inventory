import Layout from '../components/Layout'
import { useInventory } from '../context/InventoryContext'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'

export default function Inventory() {
  const { items, deleteItem } = useInventory()
  const navigate = useNavigate()

  const [selectedCategory, setSelectedCategory] = useState('All')

  // 🔹 Get unique categories dynamically
  const categories = useMemo(() => {
    const unique = [...new Set(items.map(item => item.category))]
    return ['All', ...unique]
  }, [items])

  // 🔹 Filter items based on selected category
  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter(item => item.category === selectedCategory)

  return (
    <Layout title="Inventory">
      
      {/* 🔽 Filter Dropdown */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text- font-medium">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/inventory/edit/${item.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}