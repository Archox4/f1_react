import { useContext } from 'react'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import RaceList from './components/RaceList'

function App() {

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar/>
      <RaceList/>
      <Footer/>
    </div>
  )
}

export default App
