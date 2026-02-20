import Layout from '../components/Layout'
import InventoryForm from '../components/InventoryForm'
import { useInventory } from '../context/InventoryContext'
import { useNavigate } from 'react-router-dom'

export default function AddItem() {
  const { addItem } = useInventory()
  const navigate = useNavigate()

  return (
    <Layout title="Add Inventory Item">
      <InventoryForm
        onSubmit={(item) => {
          addItem(item)
          navigate('/inventory')
        }}
      />
    </Layout>
  )
}