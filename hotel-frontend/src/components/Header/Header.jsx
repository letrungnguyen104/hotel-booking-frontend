import { NavLink } from "react-router"
import "./Header.scss"
import { DownOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import Notify from "../Notify/Notify"

function Header() {
  const items = [
    {
      key: '1',
      label: 'My Account',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Profile',
    },
    {
      key: '3',
      label: 'Hotel business registration',
    },
    {
      key: '4',
      label: 'Billing',
    },
    {
      key: '5',
      label: 'Log out',
      icon: <LogoutOutlined />,
    },
  ];
  return (
    <>
      <div className="header">
        <div className="header__logo">
          <img src="https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg" alt="" />
        </div>
        <div className="header__nav">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Home
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Contact us
              </NavLink>
              <NavLink
                to="/offers"
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Discounts and Offers
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="header__account">
          <div className="header__notify">
            <Notify />
          </div>
          <p className="header__name">Hi! Nguyên</p>
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" alt="" className="header__avatar" />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

export default Header