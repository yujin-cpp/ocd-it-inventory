import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import InventoryForm from '../components/InventoryForm'
import { useInventory } from '../context/InventoryContext'
import { useNavigate } from 'react-router-dom'

export default function AddItem() {
  const { addItem } = useInventory()
  const navigate = useNavigate()

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <Header title="Add Inventory Item" />
        <InventoryForm onSubmit={(item) => {
          addItem(item)
          navigate('/inventory')
        }} />
      </main>
    </div>
  )
}
