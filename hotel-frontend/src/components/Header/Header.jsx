import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import "./Header.scss";
import {
  LogoutOutlined,
  MessageOutlined,
  CalendarOutlined,
  UserOutlined,
  ShopOutlined,
  DashboardOutlined,
  SolutionOutlined
} from "@ant-design/icons";
import { Dropdown, Space, Modal, Form, Input, Button } from "antd";
import Notify from "../Notify/Notify";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { login } from "@/service/loginServices";
import { getToken, getUserIdFromToken, setToken } from "@/service/tokenService";
import { getUserById, preRegister, verifyRegister } from "@/service/userService";
import { useDispatch, useSelector, useStore } from "react-redux";
import { checkLogin } from "@/action/login";
import { setUser, clearUser } from "@/action/user";
import ClipLoader from "react-spinners/ClipLoader";
import ForgotPassword from "@/pages/ForgotPassword/ForgotPassword";
import { connectWebSocket, disconnectWebSocket } from "@/service/websocketService";

function Header() {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [otpForm] = Form.useForm();
  const [pendingEmail, setPendingEmail] = useState(null);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const store = useStore();

  const isLogin = useSelector((state) => state.loginReducer);
  const userDetails = useSelector((state) => state.userReducer);
  const isLoginModalVisible = useSelector(
    (state) => state.uiReducer?.isLoginModalOpen
  );
  const dispatch = useDispatch();

  // 2. Dùng ref để ngăn lặp
  const connectionAttempted = useRef(false);

  const isHotelAdmin = userDetails?.roles?.some(
    (role) => role.roleName === "HOTEL_ADMIN"
  );
  const isAdmin = userDetails?.roles?.some(
    (role) => role.roleName === "ADMIN"
  );
  const isRegularUser = isLogin && !isAdmin && !isHotelAdmin;

  const items = [{ key: "2", label: "Profile", icon: <UserOutlined /> }];

  if (isHotelAdmin) {
    items.push({ key: "3", label: "Hotel Management", icon: <ShopOutlined /> });
    items.push({ key: "8", label: "My Bookings", icon: <CalendarOutlined /> });
    items.push({ key: "6", label: "My Chats", icon: <MessageOutlined /> });
  } else if (isAdmin) {
    items.push({ key: "7", label: "Admin Dashboard", icon: <DashboardOutlined /> });
  } else if (isRegularUser) {
    items.push({ key: "3", label: "Hotel business registration", icon: <SolutionOutlined /> });
    items.push({ key: "6", label: "My Chats", icon: <MessageOutlined /> });
    items.push({ key: "8", label: "My Bookings", icon: <CalendarOutlined /> });
  }

  items.push({ type: "divider" });
  items.push({ key: "5", label: "Log out", icon: <LogoutOutlined />, danger: true });

  useEffect(() => {
    const token = getToken();

    if (isLogin && token && userDetails && !connectionAttempted.current) {
      setLoadingUser(false);
      connectWebSocket(token, store, userDetails.id);
      connectionAttempted.current = true;
      console.log("WS connected on scenario 1: Login success");
    }
    else if (isLogin && token && !userDetails && !connectionAttempted.current) {
      setLoadingUser(true);

      const userId = getUserIdFromToken();
      getUserById(userId)
        .then((userPrf) => {
          dispatch(setUser(userPrf));
          connectWebSocket(token, store, userPrf.id);
          connectionAttempted.current = true;
          console.log("WS connected on scenario 2: Page reload");
        })
        .catch((err) => {
          console.error("Token invalid, logging out:", err);
          dispatch(checkLogin(false));
          dispatch(clearUser());
        })
        .finally(() => setLoadingUser(false));
    }
    else if (!isLogin || !token) {
      dispatch(checkLogin(false));
      dispatch(clearUser());
      setLoadingUser(false);
      disconnectWebSocket();
      connectionAttempted.current = false;
    }
    else if (isLogin && !userDetails) {
      setLoadingUser(true);
    }
    else {
      setLoadingUser(false);
    }
  }, [dispatch, isLogin, userDetails, store]);


  useEffect(() => {
    if (isLoginModalVisible) {
      setIsLoginModalOpen(true);
    }
  }, [isLoginModalVisible]);

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    dispatch({ type: "CLOSE_LOGIN_MODAL" });
  };

  const handleLogin = async (values) => {
    try {
      const response = await login(values);
      if (response.result) {
        const token = response.result.token;
        loginForm.resetFields();
        toast.success("Login Successfully!");
        setToken(token, 60);

        setLoadingUser(true);
        const userId = getUserIdFromToken();
        const userPrf = await getUserById(userId);

        dispatch(setUser(userPrf));
        dispatch(checkLogin(true));

        setLoadingUser(false);
        handleCloseLoginModal();

        const isAdmin = userPrf?.roles?.some((role) => role.roleName === "ADMIN");
        if (isAdmin) {
          navigate("/admin");
        }
      } else {
        toast.error(response.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  const handleRegister = async (values) => {
    try {
      const { confirmPassword, ...userData } = values;
      setLoadingRegister(true);
      const response = await preRegister(userData);
      if (response.message?.includes("Verification code sent")) {
        setLoadingRegister(false);
        toast.success("Verification code sent to your email!");
        setPendingEmail(userData.email);
        setIsRegisterModalOpen(false);
        setIsOtpModalOpen(true);
      } else {
        toast.error(response.message || "Register failed!");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      const response = await verifyRegister({
        email: pendingEmail,
        code: values.code,
      });

      if (response.result) {
        toast.success("Register successfully! Please login.");
        otpForm.resetFields();
        setIsOtpModalOpen(false);
        setIsLoginModalOpen(true);
      } else {
        toast.error("Invalid verification code!");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleLogout = () => {
    disconnectWebSocket();
    dispatch(checkLogin(false));
    dispatch(clearUser());
    toast.info("You have been logged out!");
    navigate("/");
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "2":
        navigate("/profile");
        break;
      case "3":
        if (isHotelAdmin) navigate("/hotel-admin-dashboard");
        if (isRegularUser) navigate("/profile");
        break;
      case "5":
        handleLogout();
        break;
      case "6":
        navigate("/chat");
        break;
      case "7":
        if (isAdmin) navigate("/admin");
        break;
      case "8":
        navigate("/my-bookings");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="header">
        <div className="header__logo" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="Agoda Logo"
          />
        </div>

        <div className="header__nav">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Contact us
              </NavLink>
              <NavLink
                to="/offers"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
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
            <p className="header__name">
              {userDetails.fullName || userDetails.username}
            </p>
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <img
                    src={
                      userDetails.imagePath ||
                      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    }
                    alt="avatar"
                    className="header__avatar"
                  />
                </Space>
              </a>
            </Dropdown>
          </div>
        ) : (
          <div className="header__button">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="header__button--login"
            >
              Login
            </button>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="header__button--register"
            >
              Register
            </button>
          </div>
        )}
      </div>

      <Modal
        title="Login"
        open={isLoginModalOpen}
        onCancel={handleCloseLoginModal}
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
          <Form.Item>
            <Button
              type="link"
              onClick={() => {
                handleCloseLoginModal();
                setIsForgotPasswordModalOpen(true);
              }}
              style={{ padding: 0, marginBottom: 8 }}
            >
              Forgot password?
            </Button>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Register"
        open={isRegisterModalOpen}
        onCancel={() => setIsRegisterModalOpen(false)}
        footer={null}
        centered
      >
        <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
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
                  return Promise.reject(
                    new Error("Passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>
          <Button type="primary" loading={loadingRegister} htmlType="submit" block>
            Register
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Email Verification"
        open={isOtpModalOpen}
        onCancel={() => setIsOtpModalOpen(false)}
        footer={null}
        centered
      >
        <Form form={otpForm} layout="vertical" onFinish={handleVerifyOtp}>
          <Form.Item
            label="Verification Code"
            name="code"
            rules={[{ required: true, message: "Please enter the code sent to your email" }]}
          >
            <Input placeholder="Enter verification code" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Verify
          </Button>
        </Form>
      </Modal>

      <ForgotPassword
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />
    </>
  );
}

export default Header;