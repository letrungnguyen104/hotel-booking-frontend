import { useState } from "react";
import { Form, Input, Button, Modal, Steps } from "antd";
import { MailOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons';
import { toast } from "sonner";
import axios from "axios";

const { Step } = Steps;

// Base API URL
const API_URL = "http://localhost:8081/auth/forgot-password";

function ForgotPassword({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const handleSendOtp = async (values) => {
    try {
      setLoading(true);

      // Call API to send OTP to email
      const response = await axios.post(`${API_URL}/send-otp`, {
        email: values.email
      });

      setEmail(values.email);
      toast.success(response.data.result.message || "Verification code sent to your email!");
      setCurrentStep(1);
    } catch (error) {
      console.error("Send OTP error:", error);
      const errorMessage = error.response?.data?.message || "Failed to send verification code!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      setLoading(true);

      // Call API to verify OTP
      const response = await axios.post(`${API_URL}/verify-otp`, {
        email: email,
        code: values.code
      });

      // Lưu OTP code để dùng ở bước reset password
      setOtpCode(values.code);

      toast.success(response.data.result.message || "Verification code verified!");
      setCurrentStep(2);
    } catch (error) {
      console.error("Verify OTP error:", error);
      const errorMessage = error.response?.data?.message || "Invalid verification code!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      setLoading(true);

      // Call API to reset password - GỬI CẢ EMAIL, CODE VÀ PASSWORD
      const response = await axios.post(`${API_URL}/reset-password`, {
        email: email,
        code: otpCode, // Gửi OTP code đã verify
        password: values.password
      });

      toast.success(response.data.result.message || "Password reset successfully! Please login with your new password.");
      handleClose();
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage = error.response?.data?.message || "Failed to reset password!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/send-otp`, {
        email: email
      });

      toast.success(response.data.result.message || "Verification code resent!");
      otpForm.resetFields();
    } catch (error) {
      console.error("Resend OTP error:", error);
      const errorMessage = error.response?.data?.message || "Failed to resend verification code!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setEmail("");
    setOtpCode(""); // Reset OTP code
    emailForm.resetFields();
    otpForm.resetFields();
    resetForm.resetFields();
    onClose();
  };

  const steps = [
    {
      title: 'Enter Email',
      icon: <MailOutlined />,
    },
    {
      title: 'Verify Code',
      icon: <SafetyOutlined />,
    },
    {
      title: 'Reset Password',
      icon: <LockOutlined />,
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={emailForm} onFinish={handleSendOtp} layout="vertical">
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email address"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Send Verification Code
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form form={otpForm} onFinish={handleVerifyOtp} layout="vertical">
            <p style={{ marginBottom: 16, color: '#666', textAlign: 'center' }}>
              We've sent a 6-digit verification code to<br />
              <strong>{email}</strong>
            </p>
            <Form.Item
              name="code"
              label="Verification Code"
              rules={[
                { required: true, message: 'Please input verification code!' },
                { len: 6, message: 'Verification code must be 6 digits!' },
                { pattern: /^[0-9]+$/, message: 'Verification code must contain only numbers!' }
              ]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="Enter 6-digit code"
                maxLength={6}
                size="large"
                style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '18px' }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Verify Code
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#666' }}>Didn't receive the code? </span>
              <Button
                type="link"
                onClick={handleResendOtp}
                disabled={loading}
                style={{ padding: 0 }}
              >
                Resend
              </Button>
            </div>
          </Form>
        );

      case 2:
        return (
          <Form form={resetForm} onFinish={handleResetPassword} layout="vertical">
            <p style={{ marginBottom: 16, color: '#666', textAlign: 'center' }}>
              Create a new password for your account
            </p>
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: 'Please input new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title="Forgot Password"
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={500}
      maskClosable={!loading}
      closable={!loading}
    >
      <Steps current={currentStep} style={{ marginBottom: 32 }}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      {renderStepContent()}
    </Modal>
  );
}

export default ForgotPassword;