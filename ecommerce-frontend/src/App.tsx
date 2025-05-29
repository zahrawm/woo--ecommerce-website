import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { Navbar } from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/cart" element={<h1>Cart Page</h1>} />
        <Route path="/products" element={<h1>Products</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App