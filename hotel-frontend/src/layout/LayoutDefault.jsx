import { checkLogin } from '@/action/login';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { Input } from '@/components/ui/input'
import { getToken } from '@/service/tokenService';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useNavigate } from 'react-router'
import './LayoutDefault.scss'

const LayoutDefault = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    dispatch(checkLogin(!!token));
  }, [dispatch]);

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default LayoutDefault;