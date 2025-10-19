// src/layout/layoutAdmin/LayoutAdmin.jsx

import React, { useState, useEffect } from 'react';
import { Layout, Dropdown, Space, Avatar, Button, Modal, Form, Input } from 'antd';
import { SearchOutlined, MenuFoldOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import Notify from '@/components/Notify/Notify';
import MenuSiderAdmin from '@/components/MenuSiderAdmin/MenuSiderAdmin';
import { getToken, getUserIdFromToken } from "@/service/tokenService";
import { getUserById } from "@/service/userService";
import { checkLogin } from "@/action/login";
import { setUser, clearUser } from "@/action/user";

import logo from "@/images/logo.png";
import logoClose from "@/images/logo-close.png";
import "./LayoutAdmin.scss";

const { Sider, Content } = Layout;

function LayoutAdmin() {
  const [collapse, setCollapse] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userReducer);

  useEffect(() => {
    const token = getToken();
    if (token && !userDetails) {
      const userId = getUserIdFromToken();
      if (userId) {
        getUserById(userId)
          .then((userPrf) => {
            dispatch(setUser(userPrf));
          })
          .catch((err) => {
            console.error("Failed to fetch user in LayoutAdmin:", err);
            dispatch(clearUser());
          });
      }
    }
  }, [dispatch, userDetails]);

  const handleLogout = () => {
    dispatch(checkLogin(false));
    dispatch(clearUser());
    toast.info("You have been logged out!");
    navigate("/");
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    }
    if (key === 'profile') {
      navigate("/profile");
    }
  };

  const adminItems = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Log out',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <>
      <Layout className="admin-layout">
        <header className="admin-header">
          <div className={"admin-header__logo " + (collapse ? "admin-header__logo--collapse" : "")}>
            <img src={collapse ? logoClose : logo} alt='logo' />
          </div>
          <div className="admin-header__nav">
            <div className="admin-header__nav-left">
              <div className="admin-header__collapse" onClick={() => setCollapse(!collapse)}>
                <MenuFoldOutlined />
              </div>
              {/* <div className="admin-header__search">
                <SearchOutlined />
              </div> */}
            </div>
            <div className="admin-header__nav-right">
              <Notify />
              <Dropdown menu={{ items: adminItems, onClick: handleMenuClick }} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {!collapse && <span className="admin-header__username">{userDetails?.fullName || userDetails?.username}</span>}
                    <Avatar
                      className="admin-header__avatar"
                      src={userDetails?.imagePath || "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"}
                    />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        </header>
        <Layout>
          <Sider className="admin-sider" collapsed={collapse} theme="light">
            <div className="admin-sider__wrapper">
              <MenuSiderAdmin collapsed={collapse} />
              <Button
                type="dashed"
                danger
                className="admin-sider__logout-btn"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                {!collapse && "Logout"}
              </Button>
            </div>
          </Sider>
          <Content className="admin-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutAdmin;