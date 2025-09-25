import { NavLink } from "react-router";
import "./Header.scss";
import { LogoutOutlined } from "@ant-design/icons";
import { Dropdown, Space, Modal, Form, Input, Button } from "antd";
import Notify from "../Notify/Notify";
import { useState } from "react";
import { toast } from "sonner";

function Header() {
  const items = [
    { key: "1", label: "My Account", disabled: true },
    { type: "divider" },
    { key: "2", label: "Profile" },
    { key: "3", label: "Hotel business registration" },
    { key: "4", label: "Billing" },
    { key: "5", label: "Log out", icon: <LogoutOutlined /> },
  ];

  // Create form instances
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = (values) => {
    console.log("Login values:", values);
    loginForm.resetFields();
    setIsLogin(true);
    toast.success("Login Successfully!");
    setIsLoginModalOpen(false);
  };

  const handleRegister = (values) => {
    console.log("Register values:", values);
    registerForm.resetFields();
    setIsRegisterModalOpen(false);
  };

  const handleCloseLogin = () => {
    loginForm.resetFields();
    setIsLoginModalOpen(false);
  };

  const handleCloseRegister = () => {
    registerForm.resetFields();
    setIsRegisterModalOpen(false);
  };

  return (
    <>
      <div className="header">
        <div className="header__logo">
          <img
            src="https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg"
            alt="Agoda Logo"
          />
        </div>

        <div className="header__nav">
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Home
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                Contact us
              </NavLink>
              <NavLink to="/offers" className={({ isActive }) => (isActive ? "active" : "")}>
                Discounts and Offers
              </NavLink>
            </li>
          </ul>
        </div>

        {isLogin ? (
          <div className="header__account">
            <div className="header__notify">
              <Notify />
            </div>
            <p className="header__name">Hi! Nguyên</p>
            <Dropdown menu={{
              items, onClick: ({ key }) => {
                if (key === "5") {
                  setIsLogin(false);
                  toast.info("You have been logged out!");
                }
              },
            }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <img
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt="avatar"
                    className="header__avatar"
                  />
                </Space>
              </a>
            </Dropdown>
          </div>
        ) : (
          <div className="header__button">
            <button onClick={() => setIsLoginModalOpen(true)} className="header__button--login">
              Login
            </button>
            <button onClick={() => setIsRegisterModalOpen(true)} className="header__button--register">
              Register
            </button>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <Modal
        title="Login"
        open={isLoginModalOpen}
        onCancel={handleCloseLogin}
        footer={null}
        centered
      >
        <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Modal>

      {/* Register Modal */}
      <Modal
        title="Register"
        open={isRegisterModalOpen}
        onCancel={handleCloseRegister}
        footer={null}
        centered
      >
        <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form>
      </Modal>
    </>
  );
}

export default Header;