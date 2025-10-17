// src/pages/ProfilePage/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Form, Input, Button, Upload, Avatar, Row, Col, Spin, Modal, Result, Select } from 'antd';
import { UserOutlined, UploadOutlined, SolutionOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { updateUserProfile, changeMyPassword } from '@/service/userService';
import { getMyBusinessProfile, updateMyBusinessProfile, createMyBusinessProfile, checkMyBusinessProfileStatus } from '@/service/hotelAdminService';
import { setUser } from '@/action/user';
import { toast } from 'sonner';
import './ProfilePage.scss';
import { useNavigate } from 'react-router-dom';
import { getProvinces } from '@/service/locationService';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProfilePage = () => {
  const [profileForm] = Form.useForm();
  const [businessForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [registerBusinessForm] = Form.useForm(); // Form mới cho đăng ký

  const userDetails = useSelector((state) => state.userReducer);
  const isLogin = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [provinces, setProvinces] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingBusiness, setIsSubmittingBusiness] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [loadingBusiness, setLoadingBusiness] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // STATE MỚI CHO MODAL ĐĂNG KÝ
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);

  const isHotelAdmin = userDetails?.roles?.some(
    (role) => role.roleName === 'HOTEL_ADMIN'
  );

  useEffect(() => {
    if (!isLogin) {
      toast.error("Please log in to view your profile.");
      navigate('/');
    } else if (userDetails) {
      profileForm.setFieldsValue({
        fullName: userDetails.fullName,
        phoneNumber: userDetails.phoneNumber,
        address: userDetails.address,
      });

      getProvinces().then(data => {
        if (data) {
          setProvinces(data.map(p => ({ value: p.name, label: p.name })));
        }
      });

      setLoadingBusiness(true);
      checkMyBusinessProfileStatus()
        .then(data => {
          setBusinessProfile(data);
          if (data) {
            businessForm.setFieldsValue(data);
          }
        })
        .catch(err => {
          console.error("Failed to check business profile status", err);
          setBusinessProfile(null);
        })
        .finally(() => setLoadingBusiness(false));
    }
  }, [isLogin, userDetails, navigate, profileForm, businessForm]);

  const handleProfileUpdate = async (values) => {
    setIsSubmittingProfile(true);
    try {
      const formData = new FormData();
      formData.append('request', JSON.stringify(values));
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('file', fileList[0].originFileObj);
      }
      const updatedUser = await updateUserProfile(formData);
      dispatch(setUser(updatedUser));
      toast.success('Profile updated successfully!');
      setFileList([]);
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleBusinessUpdate = async (values) => {
    if (!businessProfile) return;
    setIsSubmittingBusiness(true);
    try {
      await updateMyBusinessProfile(businessProfile.id, values);
      toast.success('Business profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update business profile.');
    } finally {
      setIsSubmittingBusiness(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setIsSubmittingPassword(true);
    try {
      await changeMyPassword(values);
      toast.success("Password changed successfully!");
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (error) {
      toast.error("Failed to change password. Check your current password.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleBusinessRegister = async (values) => {
    setIsSubmittingRegistration(true);
    try {
      const requestData = {
        ...values,
        ownerId: userDetails.id,
      };
      const newProfile = await createMyBusinessProfile(requestData);
      toast.success("Business profile submitted! Please wait for admin verification.");
      setIsRegisterModalOpen(false);
      setBusinessProfile(newProfile);
    } catch (error) {
      console.error("Business registration failed:", error);
      toast.error("Business registration failed. Please try again.");
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const filterProvinces = (input, option) =>
    (option?.label ?? '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .includes(input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  if (!userDetails) {
    return <Spin tip="Loading user details..." fullscreen />;
  }

  const uploadButton = (<div><UploadOutlined /><div style={{ marginTop: 8 }}>Change</div></div>);

  const PendingVerification = () => (
    <Card className="business-card">
      <Result
        icon={<ClockCircleOutlined />}
        title="Verification Pending"
        subTitle="Your business profile has been submitted and is currently awaiting admin approval. Please check back later."
      />
    </Card>
  );

  const RegisterBusinessCTA = () => (
    <Card className="business-card">
      <Result
        icon={<SolutionOutlined />}
        title="Become a Partner"
        subTitle="You have not registered a business profile yet. Register now to start listing your properties."
        extra={<Button type="primary" onClick={() => setIsRegisterModalOpen(true)}>Register Your Business</Button>}
      />
    </Card>
  );

  return (
    <>
      <div className="profile-page-container">
        <Row justify="center" gutter={[24, 24]}>
          <Col xs={24} sm={20} md={16} lg={8}>
            <Card title="My Profile" className="profile-card">
              <Form form={profileForm} layout="vertical" onFinish={handleProfileUpdate}>
                <div>
                  <div className="avatar-section">
                    <Upload
                      listType="picture-circle"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                      beforeUpload={() => false}
                      maxCount={1}
                    >
                      {fileList.length > 0 ? null : (userDetails.imagePath ? <Avatar size={120} src={userDetails.imagePath} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : uploadButton)}
                    </Upload>
                  </div>
                  <Form.Item name="fullName" label="Full Name"><Input /></Form.Item>
                  <Form.Item label="Email"><Input value={userDetails.email} disabled /></Form.Item>
                  <Form.Item name="phoneNumber" label="Phone Number"><Input /></Form.Item>
                  <Form.Item name="address" label="Address (Province/City)">
                    <Select
                      showSearch
                      placeholder="Select or search for your province"
                      options={provinces}
                      filterOption={filterProvinces}
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item><Button type="primary" htmlType="submit" loading={isSubmittingProfile} block>Save Changes</Button></Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}><Button block onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button></Form.Item>
                </div>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            {loadingBusiness ? (
              <Card><Spin /></Card>
            ) : businessProfile?.verified === 1 ? (
              <Card title="Business Profile" className="business-card">
                <Form form={businessForm} layout="vertical" onFinish={handleBusinessUpdate}>
                  <Row gutter={16}>
                    <Col span={12}><Form.Item name="businessName" label="Business Name"><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item name="taxCode" label="Tax Code"><Input /></Form.Item></Col>
                    <Col span={24}><Form.Item name="businessAddress" label="Business Address (Province/City)">
                      <Select
                        showSearch
                        placeholder="Select or search for your province"
                        options={provinces}
                        filterOption={filterProvinces}
                      />
                    </Form.Item></Col>
                    <Col span={12}><Form.Item name="licenseNumber" label="License Number"><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item name="idCardOrPassport" label="ID Card/Passport"><Input /></Form.Item></Col>
                    <Col span={24}><Form.Item name="bankAccount" label="Bank Account"><Input /></Form.Item></Col>
                  </Row>
                  <Form.Item><Button type="primary" htmlType="submit" loading={isSubmittingBusiness} block>Update Business Info</Button></Form.Item>
                </Form>
              </Card>
            ) : businessProfile?.verified === 0 ? (
              <PendingVerification />
            ) : (
              <RegisterBusinessCTA />
            )}
          </Col>
        </Row>
      </div>

      <Modal open={previewOpen} title="Avatar Preview" footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="avatar" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      <Modal
        title="Change Password"
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 8 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmittingPassword} block>
              Confirm Change
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Register Your Business"
        open={isRegisterModalOpen}
        onCancel={() => setIsRegisterModalOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form form={registerBusinessForm} layout="vertical" onFinish={handleBusinessRegister}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="businessName" label="Business Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="taxCode" label="Tax Code" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={24}><Form.Item name="businessAddress" label="Business Address" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="licenseNumber" label="License Number" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="idCardOrPassport" label="ID Card/Passport" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={24}><Form.Item name="bankAccount" label="Bank Account" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmittingRegistration} block>
              Submit for Verification
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProfilePage;