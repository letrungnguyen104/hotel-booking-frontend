import { NavLink } from "react-router";
import "./Header.scss";
import { LogoutOutlined } from "@ant-design/icons";
import { Dropdown, Space, Modal, Form, Input, Button } from "antd";
import Notify from "../Notify/Notify";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { login } from "@/service/loginServices";
import { getToken, getUserIdFromToken, setToken } from "@/service/tokenService";
import { getUserById, register } from "@/service/userService";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin } from "@/action/login";
import { setUser, clearUser } from "@/action/user";
import ClipLoader from "react-spinners/ClipLoader";

function Header() {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const isLogin = useSelector((state) => state.loginReducer);
  const userDetails = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  // ✅ Kiểm tra role
  const isHotelAdmin = userDetails?.roles?.some(
    (role) => role.roleName === "HOTEL_ADMIN"
  );

  // ✅ Menu động
  const items = [
    { key: "1", label: "My Account", disabled: true },
    { type: "divider" },
    { key: "2", label: "Profile" },
    isHotelAdmin
      ? { key: "3", label: "Hotel Management" }
      : { key: "3", label: "Hotel business registration" },
    { key: "4", label: "Billing" },
    { key: "5", label: "Log out", icon: <LogoutOutlined /> },
  ];

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(checkLogin(true));
      if (!userDetails) {
        setLoadingUser(true);
        const userId = getUserIdFromToken();
        getUserById(userId)
          .then((userPrf) => {
            dispatch(setUser(userPrf));
          })
          .catch((err) => {
            console.error("Failed to fetch user after reload:", err);
          })
          .finally(() => setLoadingUser(false));
      } else {
        setLoadingUser(false);
      }
    } else {
      dispatch(checkLogin(false));
      dispatch(clearUser());
      setLoadingUser(false);
    }
  }, [dispatch]);

  const handleLogin = async (values) => {
    try {
      const response = await login(values);
      if (response.result) {
        loginForm.resetFields();
        dispatch(checkLogin(true));
        toast.success("Login Successfully!");
        setToken(response.result.token, 60);

        setLoadingUser(true);
        const userId = getUserIdFromToken();
        const userPrf = await getUserById(userId);
        dispatch(setUser(userPrf));
        setLoadingUser(false);
        setIsLoginModalOpen(false);
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed!");
    }
  };

  const handleRegister = async (values) => {
    try {
      const response = await register(values);
      console.log("Register response:", response);

      if (response.code === 1001) {
        toast.success("Register successfully! Please login.");
        registerForm.resetFields();
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
      } else if (response.code === 1012 && response.message.includes("Email")) {
        toast.error("Email already in use!");
      } else if (response.code === 1011 && response.message.includes("Username")) {
        toast.error("Username already in use!");
      } else if (response.code === 1004) {
        toast.error("Password must be at least 8 characters!");
      } else {
        toast.error("Register failed!");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleLogout = () => {
    dispatch(checkLogin(false));
    dispatch(clearUser());
    toast.info("You have been logged out!");
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

        {loadingUser ? (
          <div className="header__loading">
            <ClipLoader size={28} color="#36d7b7" />
          </div>
        ) : isLogin && userDetails ? (
          <div className="header__account">
            <div className="header__notify">
              <Notify />
            </div>
            <p className="header__name">Hi! {userDetails.username}</p>
            <Dropdown menu={{ items, onClick: ({ key }) => key === "5" && handleLogout() }}>
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
      <Modal title="Login" open={isLoginModalOpen} onCancel={() => setIsLoginModalOpen(false)} footer={null} centered>
        <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}>
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Modal>

      {/* Register Modal */}
      <Modal title="Register" open={isRegisterModalOpen} onCancel={() => setIsRegisterModalOpen(false)} footer={null} centered>
        <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}>
            <Input placeholder="Enter your username" />
          </Form.Item>
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
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
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