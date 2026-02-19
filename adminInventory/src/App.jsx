import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/add" element={<AddItem />} />
      <Route path="/inventory/edit/:id" element={<EditItem />} />
    </Routes>
  )
}

export default App
