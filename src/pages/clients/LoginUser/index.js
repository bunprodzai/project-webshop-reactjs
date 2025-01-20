import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import "./LoginUser.scss";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setCookie } from "../../../helpers/cookie";
import { loginUserPost } from "../../../services/client/loginServies";
import { checkLoginUser } from "../../../actions/loginUser";
import ForgotPassword from "../ForgotPassword";


function LoginUser(props) {
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

  return (
    <>
      <Button color="default" icon={<LoginOutlined />} onClick={showModal} >Đăng nhập</Button>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={"25%"}
      >
        <div className="login_user">
          <Row>
            <Form className="login_user__form" onFinish={handleSubmit} >
              <Col span={24}>
                <h2 style={{textAlign: "center"}}>Đăng nhập</h2>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
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
                <ForgotPassword onCancel={handleCancel}/>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        </div>
      </Modal>
    </>
  )
}

export default LoginUser;