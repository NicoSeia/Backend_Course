import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import UserProvider from './context/UserContext'
import ProductProvider from './context/ProductContext'
import CartProvider from './context/CartContext'


import TopNavbar from './components/Navbar/TopNavbar'

import ProductPages from './pages/ProductPages'
import ProductDetailPages from './pages/ProductDetailPages'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Home from './components/Home'
import ProductsListContainer from './components/ProductsList/ProductsListContainer'
import ChatPage from './pages/ChatPage'
import RealTimeProducts from './pages/RealTimeProductsPage'
import CartPage from './pages/CartPage'
import ProtectedRoute from './ProtectedRoute'


function App() {

  return (

      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <TopNavbar />
            <Routes>
              <Route path='/' element={<ProductPages />} />
              <Route path='/products' element={<ProductPages />} />
              <Route path='/products/detail/:pid' element={<ProductDetailPages />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path='/realtimeproducts' element={<RealTimeProducts />} />
                <Route path='/chat' element={<ChatPage />} />
                <Route path='/cart' element={<CartPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>

  )
}

export default App
