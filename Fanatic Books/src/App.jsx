import React from 'react'
import Home from './Pages/Home'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './Pages/About'
import Cart from './Pages/Cart'
import Contact from './Pages/Contact'
import Shop from './Pages/Shop'
import Login from './Pages/Login'
import Notification from './Pages/Notification'
import Applayout from './Applayout'
import Register from './Pages/Register'
import Singlebook from './Pages/Singlebook'


const App = () => {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Applayout />} >
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book/:id" element={<Singlebook/>} />
        <Route path="/search/:q" element={<Singlebook/>} />
      
        </Route>
        
        <Route path="/notification" element={<Notification />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
