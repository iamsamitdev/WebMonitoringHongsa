import { AppRouter } from "./routes"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <div className="App">
      <AppRouter />
      <Toaster position="top-right" />
    </div>
  )
}

export default App