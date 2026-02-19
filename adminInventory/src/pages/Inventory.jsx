import Layout from '../components/Layout'
import { useInventory } from '../context/InventoryContext'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function Inventory() {
  const { items, deleteItem } = useInventory()
  const navigate = useNavigate()

  return (
    <Layout title="Inventory">
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
            {items.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/inventory/edit/${item.id}`)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No inventory items yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
