import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import InventoryForm from '../components/InventoryForm'
import { useInventory } from '../context/InventoryContext'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditItem() {
  const { items, updateItem } = useInventory()
  const navigate = useNavigate()
  const { id } = useParams()
  const item = items.find(i => i.id === Number(id))

  if (!item) return <p>Item not found</p>

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <Header title="Edit Inventory Item" />
        <InventoryForm initialData={item} onSubmit={(updatedItem) => {
          updateItem(item.id, updatedItem)
          navigate('/inventory')
        }} />
      </main>
    </div>
  )
}
