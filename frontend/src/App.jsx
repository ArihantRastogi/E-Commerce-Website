import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import Item from './pages/Item'
import Sell from './pages/Sell'
import SellItem from './pages/SellItem'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[10vw] lg:px-[15vw] xl:px-[20vw]'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/register' element={<Register />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product/:id' element={<Item />} />
        <Route path='/sell' element={<Sell />} />
        <Route path='/sellitem' element={<SellItem />} />
      </Routes>
    </div>
  )
}

export default App
