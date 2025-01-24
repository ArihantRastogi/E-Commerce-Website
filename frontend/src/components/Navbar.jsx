import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import Cookies from 'js-cookie';
import { useNavigate, Navigate } from 'react-router-dom';

const Navbar = () => {

  const logout = async () => {
    try {
      Cookies.remove('token');
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <NavLink to='/'>
        <img src={assets.logo} className='h-10' alt="logo" />
      </NavLink>
      <div className='flex items-center space-x-5'>
        <NavLink to='/sell'>
          <img onClick={() => Cookies.get('token') ? null : navigate('/login')} src={assets.plus} className='h-6' alt="sell" />
        </NavLink>
        <NavLink to='/product'>
          <img onClick={() => Cookies.get('token') ? null : navigate('/login')} src={assets.search} className='h-10' alt="search" />
        </NavLink>
        <NavLink to='/cart'>
          <img onClick={() => Cookies.get('token') ? null : navigate('/login')} src={assets.cart} className='h-12' alt="cart" />
        </NavLink>
        <div className='group relative'>
          <img onClick={() => navigate('/order')} src={assets.order} className='h-12' alt="order" />
          {Cookies.get('token') ? (
            <>
              <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-20'>
                <div className='flex flex-col gap-2 w-36 px-3 py-5 bg-slate-100 text-gray-500 rounded'>
                  <NavLink to='/order'>
                    <p className='cursor-pointer hover:text-black'>My Orders</p>
                  </NavLink>
                  <NavLink to='/solditems'>
                    <p className='cursor-pointer hover:text-black'>Sold Items</p>
                  </NavLink>
                  <NavLink to='/boughtitems'>
                    <p className='cursor-pointer hover:text-black'>Bought Items</p>
                  </NavLink>
                </div>
              </div>
            </>
          ) : (
            <>
            </>
          )}
        </div>
        <NavLink to='/deliver'>
          <img onClick={() => Cookies.get('token') ? null : navigate('/deliver')} src={assets.deliver} className='h-10' alt="deliver" />
        </NavLink>
        <div className='group relative'>
          <img onClick={() => navigate('/login')} src={assets.profile} className='h-8' alt="profile" />
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 px-3 py-5 bg-slate-100 text-gray-500 rounded'>
              {Cookies.get('token') ? (
                <>
                  <NavLink to='/profile'>
                    <p className='cursor-pointer hover:text-black'>My Profile</p>
                  </NavLink>
                  <p className='cursor-pointer hover:text-black' onClick={logout}>Logout</p>
                </>
              ) : (
                <>
                  <NavLink to='/login'>
                    <p className='cursor-pointer hover:text-black'>Login</p>
                  </NavLink>
                  <NavLink to='/register'>
                    <p className='cursor-pointer hover:text-black'>Register</p>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
