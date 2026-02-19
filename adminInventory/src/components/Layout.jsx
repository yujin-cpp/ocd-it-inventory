import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header title={title} />
        <div className="mt-6">
          {children}
        </div>
      </main>
    </div>
  )
}
