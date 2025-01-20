import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useState } from "react";
import './OtpPassword.scss';
import { getCookie, setCookie } from "../../../helpers/cookie";
import { optPasswordPost } from "../../../services/client/userServies";
import ResetPassword from "../ResetPassword";


function OtpPassword() {
  const email = getCookie("email") ? getCookie("email") : "";
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isResetOpen, setIsResetOpen] = useState(false); // Trạng thái hiển thị OTP modal


  const handleSubmit = async (e) => {
    // eslint-disable-next-line no-const-assign
    const response = await optPasswordPost(email, e);
    if (response.code === 200) {
      message.success(response.message);
      setCookie("tokenUser", response.tokenUser, 24);
      setIsModalOpen(false);
      setIsResetOpen(true); // Hiển thị modal OTP
    } else {
      message.error(response.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={"25%"}
      >
        <div className="otp">
          <Row>
            <Form className="otp__form" onFinish={handleSubmit} >
              <Col span={24}>
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Please input your OTP!' }]}
                >
                  <Input placeholder="Nhập mã OTP" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="otp-form-button">
                    Xác nhận
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        </div>
      </Modal>
      {isResetOpen && <ResetPassword onCancel={() => setIsResetOpen(false)} />}
    </>
  );
}

export default OtpPassword;
