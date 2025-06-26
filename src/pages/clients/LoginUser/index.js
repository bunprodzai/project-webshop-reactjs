import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./LoginUser.scss";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setCookie } from "../../../helpers/cookie";
import { loginUserPost } from "../../../services/client/loginServies";
import { checkLoginUser } from "../../../actions/loginUser";
import ForgotPassword from "../ForgotPassword";

import { Checkbox, Card, Divider, Typography } from "antd"
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons"
import Register from "../Register";
const { Title, Text } = Typography

function LoginUser(props) {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  
  // eslint-disable-next-line no-unused-vars
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { onMenuOpen } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    const response = await loginUserPost(e);
    if (response.code === 200) {
      message.success("Đăng nhập thành công");
      setCookie("email", e.email, 24);
      setCookie("avatar", response.avatar, 24);
      setCookie("tokenUser", response.tokenUser, 24);
      setCookie("fullName", response.fullName, 24);
      dispatch(checkLoginUser(true));
      handleCancel();
      onMenuOpen();
    } else {
      message.error(response.message);
    }
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReload = () => {
    
  }

  return (
    <>
      <Button color="default" onClick={showModal} >Sign in</Button>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={"25%"}
      >
        <div>
          <Card
            style={{
              width: "100%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Title level={2} style={{ marginBottom: "8px" }}>
                Login
              </Title>
              <Text type="secondary">Enter your credentials to access your account</Text>
            </div>

            <Form name="login" initialValues={{ remember: true }} onFinish={handleSubmit} layout="vertical" size="large">
              <Form.Item name="email" rules={[{ required: true, message: "Please input your username or email!" }]}>
                <Input prefix={<UserOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />} placeholder="Email" type="email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
                style={{ marginBottom: "12px" }}
              >
                <Input.Password prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />} placeholder="Password" />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <ForgotPassword onCancel={handleCancel} />
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={loading}>
                  {loading ? "Logging in..." : "Sign in"}
                </Button>
              </Form.Item>

              <Divider plain>Or continue with</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Button icon={<GoogleOutlined />} style={{ width: "100%" }}>
                    Google
                  </Button>
                </Col>
                <Col span={12}>
                  <Button icon={<GithubOutlined />} style={{ width: "100%" }}>
                    GitHub
                  </Button>
                </Col>
              </Row>
            </Form>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Text type="secondary">
                Don't have an account?
                {/* <AntLink >Sign up</AntLink> */}
                <Register onReload={handleReload} page="login" onCancelLoginModal={handleCancel} onMenuOpen={() => setIsMenuOpen(false)} />
              </Text>
            </div>
          </Card>
        </div>
      </Modal>
    </>
  )
}

export default LoginUser;