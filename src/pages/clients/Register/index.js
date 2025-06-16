import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Register.scss";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setCookie } from "../../../helpers/cookie";
import { checkLoginUser } from "../../../actions/loginUser";
import { registerPost } from "../../../services/client/userServies";


function Register(props) {
  const { onMenuOpen } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    const response = await registerPost(e);
    if (response.code === 200) {
      message.success(response.message);
      setCookie("email", e.email, 24);
      setCookie("fullName", e.fullName, 24);
      setCookie("tokenUser", response.tokenUser, 24);
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
      <Button color="default" style={{ marginLeft: "5px" }} onClick={showModal} >Sign up</Button>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={"25%"}
      >
        <div className="register_user">
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
        </div>
      </Modal>
    </>
  )
}

export default Register;