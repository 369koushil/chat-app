
import './App.css'
import AppRoutes from './Routes/AppRoutes'
import { UserProvider } from './context/User.context'


function App() {

  return (
    
    <UserProvider><AppRoutes/></UserProvider>
     
   
   
  )
}

export default App
