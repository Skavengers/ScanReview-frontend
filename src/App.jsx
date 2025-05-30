import { Outlet } from 'react-router-dom'
import "./index.css"
import Navbar from "./components/Navbar"
import Footer from './components/Footer'
import { AuthProvide } from "./context/AuthContext"
// max-w-screen-2xl mx-auto ne fonctionne pas
function App() {
  //<Navbar/>
  return (
    <>
    <AuthProvide >
      <Navbar />
      <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6'>
        <Outlet/>
      </main>
      <Footer />    
    </AuthProvide>

    </>
    
  )
}

export default App
