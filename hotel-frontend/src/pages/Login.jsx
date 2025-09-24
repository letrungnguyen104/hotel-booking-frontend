import { checkLogin } from "@/action/login";
import { login } from "@/service/loginServices";
import { setToken } from "@/service/tokenService";
import { Button, Input } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";

function Login() {
  const [userData, setUserData] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const response = await login(userData);
      if (response?.result?.token) {
        toast.success("Login Successfully!");
        dispatch(checkLogin(true));
        setToken(response.result.token, 60);
        navigate("/");
      } else {
        toast.error(response?.message || "Login failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login error!");
    }
  };

  return (
    <div className="w-full h-dvh flex items-center justify-center bg-gradient-to-br from-pink-950/30 to-green-400/50">
      <form
        onSubmit={submitData}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500">Login to continue</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Username</label>
          <Input
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <Input.Password
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button onClick={() => navigate("/")} className="rounded-lg">
            Back
          </Button>
          <Button type="primary" htmlType="submit" className="rounded-lg">
            Login
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;