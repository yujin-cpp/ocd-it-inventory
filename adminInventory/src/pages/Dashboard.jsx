import Layout from '../components/Layout'
import { useInventory } from '../context/InventoryContext'

export default function Dashboard() {
  const { items } = useInventory()

  const totalItems = items.length
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <h2 className="text-sm text-gray-500">Total Items</h2>
          <p className="text-2xl font-semibold mt-1">{totalItems}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <h2 className="text-sm text-gray-500">Total Quantity</h2>
          <p className="text-2xl font-semibold mt-1">{totalQuantity}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <h2 className="text-sm text-gray-500">Categories</h2>
          <p className="text-2xl font-semibold mt-1">
            {Array.from(new Set(items.map(item => item.category))).length}
          </p>
        </div>
      </div>
    </Layout>
  )
}
