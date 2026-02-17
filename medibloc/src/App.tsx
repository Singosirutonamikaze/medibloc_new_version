import './App.css'
import { AppRouter } from './routes'
import { AuthProvider, ThemeProvider, NotificationProvider } from './contexts'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
