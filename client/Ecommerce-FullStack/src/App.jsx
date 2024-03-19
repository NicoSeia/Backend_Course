import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import ProductPages from './pages/ProductPages'
//import Home from './components/Home'
import TopNavbar from './components/Navbar/TopNavbar'

function App() {

  return (

      <BrowserRouter>
        <TopNavbar />
        <Routes>
          {/* <Route path='/home' element={<Home />} /> */}
          <Route path='/' element={<ProductPages />} />
        </Routes>
      </BrowserRouter>

  )
}

export default App
