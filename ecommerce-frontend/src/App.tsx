import { Route, Routes } from 'react-router-dom';
import './App.css'
import { Navbar } from './components/Navbar';

function App() {
  return (
    <>
      <Navbar/>
      <div className=' mt-5 p-7'>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/cart" element={<h1>Cart Page</h1>} />
          <Route path="/products" element={<h1>Products</h1>} />
          <Route path="/profile" element={<h1>Profile Page</h1>} />
          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </div>
    </>
  )
}

export default App