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
      <img src={assets.logo} className='h-10' alt="logo" />
      <ul className='flex items-center space-x-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center space-x-6'>
        <NavLink to='/sell'>
        <img onClick={() => Cookies.get('token') ? null : navigate('/login')} src={assets.plus} className='h-5' alt="sell" />
        </NavLink>
        <NavLink to='/product'>
        <img onClick={() => Cookies.get('token') ? null : navigate('/login')} src={assets.search} className='h-8' alt="search" />
        </NavLink>
        <div className='group relative'>
          <img onClick={() => Cookies.get('token') ? null : navigate('/login')} src={assets.profile} className='h-8' alt="profile" />
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
