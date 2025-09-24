import { NavLink } from "react-router"
import "./Header.scss"
import { DownOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

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
      extra: '⌘P',
    },
    {
      key: '3',
      label: 'Billing',
      extra: '⌘B',
    },
    {
      key: '4',
      label: 'Log out',
      icon: <LogoutOutlined />,
      extra: '⌘S',
    },
  ];
  return (
    <>
      <div className="container">
        <div className="header">
          <div className="header__logo">
            <img src="https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg" alt="" />
          </div>
          <div className="header__nav">
            <ul>
              <li>
                <NavLink to="/#">Home</NavLink>
                <NavLink to="#">Contact us</NavLink>
                <NavLink to="#">Discounts and Offers</NavLink>
              </li>
            </ul>
          </div>
          <div className="header__account">
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
      </div>
    </>
  )
}

export default Header