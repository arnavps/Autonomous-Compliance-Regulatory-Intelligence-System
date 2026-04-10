import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { StatusBar } from "@/components/layout/StatusBar"
import { RegulationProvider } from "@/lib/context/RegulationContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RegulationProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-10">
            {children}
          </main>
          <StatusBar />
        </div>
      </div>
    </RegulationProvider>
  )
}
