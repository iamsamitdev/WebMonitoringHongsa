import { AppRouter } from "./routes"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className="App">
      <AppRouter />
      <Toaster />
    </div>
  )
}

export default App