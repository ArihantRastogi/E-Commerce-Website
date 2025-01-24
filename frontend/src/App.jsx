import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Product from './pages/Product'
import Item from './pages/Item'
import Sell from './pages/Sell'
import SellItem from './pages/SellItem'
import Cart from './pages/Cart'
import SoldItems from './pages/SoldItems'
import BoughtItems from './pages/BoughtItems'
import Orders from './pages/Orders'
import Deliver from './pages/Deliver'

const App = () => {
  return (
    <div className='px-2 sm:px-[1vw] md:px-[2vw] lg:px-[3vw] xl:px-[4vw]'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product/:id' element={<Item />} />
        <Route path='/sell' element={<Sell />} />
        <Route path='/sellitem' element={<SellItem />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<Orders />} />
        <Route path='/solditems' element={<SoldItems />} />
        <Route path='/boughtitems' element={<BoughtItems />} />
        <Route path='/deliver' element={<Deliver />} />
      </Routes>
    </div>
  )
}

export default App
