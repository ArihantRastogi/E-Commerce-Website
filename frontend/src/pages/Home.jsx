import React from 'react'
import { assets } from '../assets/assets'

const Home = () => {
  return (
    <div className="flex items-center justify-center p-40">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex h-70">
        {/* Left half - Image */}
        <div className="w-1/2">
          <img 
            src={assets.iiith} 
            alt="IIITH Buy/Sell Platform" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right half - Title */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <h1 className="text-6xl font-bold text-center text-black leading-tight">
            BUY/SELL
            <br />
            @
            <br />
            IIITH
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Home