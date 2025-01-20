import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { useState } from "react";
import { getCookie, setCookie } from "../../../helpers/cookie";
import { LockOutlined } from "@ant-design/icons";
import { resetPasswordPost } from "../../../services/client/userServies";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkLoginUser } from "../../../actions/loginUser";


function ResetPassword() {
  const tokenUser = getCookie("tokenUser") ? getCookie("tokenUser") : "";

  const [isModalOpen, setIsModalOpen] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.tokenUser = tokenUser;
    const response = await resetPasswordPost(e);
    if (response.code === 200) {
      message.success(response.message);
      setCookie("email", e.email, 1);
      setCookie("tokenUser", response.tokenUser, 24);
      dispatch(checkLoginUser(true));
      handleCancel();
      navigate(`/`);
    } else {
      message.error(response.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
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
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="otp-form-button">
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </div>
    </Modal>
  );
}

export default ResetPassword;