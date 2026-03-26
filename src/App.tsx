import './App.css'
import RaceList from './components/RaceList'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SessionPage from './SessionPage'
import MainLayout from './components/MainLayout'

function App() {

  return (
    <div className='flex flex-col min-h-screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout/>}>
            <Route index element={<RaceList/>}/>
            <Route path='/session/:session_key' element={<SessionPage/>}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
