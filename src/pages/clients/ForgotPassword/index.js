import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { UserOutlined, LoginOutlined } from "@ant-design/icons";
import { useState } from "react";
import { setCookie } from "../../../helpers/cookie";
import "./ForgotPassword.scss";
import { forgotPasswordPost } from "../../../services/client/userServies";
import OtpPassword from "../OtpPassword";

function ForgotPassword(props) {
  const { onCancel } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false); // Trạng thái hiển thị OTP modal


  const handleSubmit = async (e) => {
    const response = await forgotPasswordPost(e);
    if (response.code === 200) {
      message.success(response.message);
      setCookie("email", e.email, 1);
      setIsModalOpen(false); // Đóng modal quên mật khẩu
      setIsOtpOpen(true); // Hiển thị modal OTP
    } else {
      message.error(response.message);
    }
  }

  const showModal = () => {
    setIsModalOpen(true);
    onCancel()
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <p color="default" className="forgot" icon={<LoginOutlined />} onClick={showModal} >Forgot password?</p>
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
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nhập email" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Nhận mã OTP
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        </div>
      </Modal>
      {isOtpOpen && <OtpPassword onCancel={() => setIsOtpOpen(false)} />}
    </>
  )
}

export default ForgotPassword;