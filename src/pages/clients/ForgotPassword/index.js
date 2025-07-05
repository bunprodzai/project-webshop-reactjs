import { Button, Form, Input, message, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <>
        <Button
          type="link"
          onClick={showModal}
          style={{ padding: 0, fontSize: 14 }}
        >
          Quên mật khẩu?
        </Button>

        <Modal
          title="Khôi phục mật khẩu"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={400}
          centered
        >
          <Form
            layout="vertical"
            className="forgot-password-form"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Nhập email của bạn"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
              >
                Nhận mã OTP
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {isOtpOpen && (
          <OtpPassword onCancel={() => setIsOtpOpen(false)} />
        )}
      </>

    </>
  )
}

export default ForgotPassword;