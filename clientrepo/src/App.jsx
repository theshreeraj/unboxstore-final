import React from 'react'
import Home from './pages/home/Home'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import ProductDetails from './pages/productDetails/ProductDetails'
import Category from './pages/category/Category'
import Checkout from './pages/checkout/Checkout'
import Wishlist from './components/wishlist/Wishlist'
import Cart from './pages/cart/Cart'

const App = () => {
  return (
    <div>

      <BrowserRouter>
      <Wishlist/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
              <Route path="/product-details" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart/>} />
              <Route path="/checkout" element={<Checkout/>} />
        </Routes>
      
      </BrowserRouter>

    </div>
  )
}

export default App