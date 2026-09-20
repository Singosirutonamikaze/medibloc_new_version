import './App.css'
import { AppRouter } from './routes'
import { AuthProvider, NotificationProvider } from './contexts'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
