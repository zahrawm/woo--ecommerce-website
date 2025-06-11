import { Route, Routes } from 'react-router-dom';
import './App.css'
import { Navbar } from './components/Navbar';
import Home from './pages/home';
import Cart from './pages/cart';
import Products from './pages/products';
import Profile from './pages/profile';
import Login from './pages/login';

function App() {
  return (
    <>
      <Navbar/>
      <div className=''>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<Products />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  )
}

export default App