import { Button, Form, Input, message, Modal} from "antd";
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
      title="Đổi mật khẩu"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={400}
      centered
    >
      <Form
        layout="vertical"
        className="reset-password-form"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Nhập mật khẩu mới"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Nhập lại mật khẩu mới"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </Modal>

  );
}

export default ResetPassword;