import { Button, Card, Divider, Form, Input, message, Modal, Space, Typography } from "antd";
import { UserOutlined, LockOutlined, UserAddOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./Register.scss";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setCookie } from "../../../helpers/cookie";
import { checkLoginUser } from "../../../actions/loginUser";
import { registerPost } from "../../../services/client/userServies";

const { Title, Text, Link: AntLink } = Typography

function Register(props) {
  const { onMenuOpen, page, onCancelLoginModal } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      const response = await registerPost(e);
      if (response.code === 200) {
        setCookie("email", e.email, 24);
        setCookie("fullName", e.fullName, 24);
        setCookie("tokenUser", response.tokenUser, 24);
        dispatch(checkLoginUser(true));
        handleCancel();
        onMenuOpen();
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("An error occurred while creating your account.");
    } finally {
      setLoading(false);
    }

  }

  const showModal = () => {
    // setIsModalOpen(true);
    if (onCancelLoginModal) {
      onCancelLoginModal(); // 👈 đóng modal login trước
    }
    setIsModalOpen(true); // 👈 rồi mới mở modal register
  };
  const handleOk = () => {
    setIsModalOpen(false);
    form.resetFields()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {page === "login" ? (
        <AntLink onClick={showModal}>Sign up</AntLink>
      ) : (
        <Button color="default" style={{ marginLeft: "5px" }} onClick={showModal} >Sign up</Button>
      )}

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        // width={"25%"}
        width={480}
        centered
        destroyOnClose
        styles={{
          body: { padding: 0 },
        }}
        style={{
          borderRadius: "12px",
        }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: "12px",
            boxShadow: "none",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#f0f9ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <UserAddOutlined
                style={{
                  fontSize: "28px",
                  color: "#1890ff",
                }}
              />
            </div>
            <Title
              level={2}
              style={{
                margin: "0 0 8px 0",
                fontSize: "24px",
                fontWeight: 600,
                color: "#262626",
              }}
            >
              Create Account
            </Title>
            <Text
              type="secondary"
              style={{
                fontSize: "15px",
                lineHeight: "1.5",
              }}
            >
              Join us today and start your journey
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            requiredMark={false}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="fullName"
              label={<span style={{ fontWeight: 500, color: "#262626" }}>Full Name</span>}
              rules={[
                { required: true, message: "Please enter your full name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#8c8c8c" }} />}
                placeholder="Enter your full name"
                style={{
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "15px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 500, color: "#262626" }}>Email Address</span>}
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#8c8c8c" }} />}
                placeholder="Enter your email address"
                style={{
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "15px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 500, color: "#262626" }}>Password</span>}
              rules={[
                { required: true, message: "Please enter your password" },
                // { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
                placeholder="Enter your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
                styles={{
                  input: {
                    padding: "12px 16px",
                  },
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span style={{ fontWeight: 500, color: "#262626" }}>Confirm Password</span>}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error("Passwords do not match"))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
                placeholder="Confirm your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
                styles={{
                  input: {
                    padding: "12px 16px",
                  },
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: "32px", marginBottom: "16px" }}>
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 500,
                    background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <Button
                  type="text"
                  onClick={handleCancel}
                  block
                  size="large"
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#8c8c8c",
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Divider style={{ margin: "24px 0 16px 0" }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              Already have an account?
            </Text>
          </Divider>

          <div style={{ textAlign: "center" }}>
            <AntLink
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#1890ff",
              }}
            >
              Sign in instead
            </AntLink>
          </div>
        </Card>
      </Modal>



      {/* <div className="register_user">
          <Row>
            <Form className="register_user__form" onFinish={handleSubmit} >
              <Col span={24}>
                <h2 style={{ textAlign: "center" }}>Đăng ký tài khoản</h2>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="fullName"
                  rules={[{ required: true, message: 'Please input your Full Name!' }]}
                >
                  <Input placeholder="Full Name" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item
                  name="comfirmPassword"
                  rules={[{ required: true, message: 'Please input your Comfirm Password!' }]}
                >
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Comfirm Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="register-form-button">
                    Đăng ký
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        </div> */}
    </>
  )
}

export default Register;