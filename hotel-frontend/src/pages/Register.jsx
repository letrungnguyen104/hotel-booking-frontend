import { Button, Input } from "antd";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { postPublic } from "@/utils/publicRequest";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitData = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await postPublic("users/register", {
        username: formData.username,
        password: formData.password,
      });

      if (response?.result) {
        toast.success("Register successfully! Please login.");
        navigate("/login");
      } else {
        toast.error(response?.message || "Register failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Register error!");
    }
  };

  return (
    <div className="w-full h-dvh flex items-center justify-center bg-gradient-to-br from-pink-950/30 to-green-400/50">
      <form
        onSubmit={submitData}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500">Register to get started</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Username</label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
          <Input.Password
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button onClick={() => navigate("/")} className="rounded-lg">
            Back
          </Button>
          <Button type="primary" htmlType="submit" className="rounded-lg">
            Register
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;