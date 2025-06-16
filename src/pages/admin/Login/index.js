import { Button, Form, Input, message, Card, Typography } from "antd"
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons"
import "./Login.scss"
import { login } from "../../../services/admin/loginServies"
import { setCookie } from "../../../helpers/cookie"
import { useDispatch } from "react-redux"
import { checkLogin } from "../../../actions/login"
import { useNavigate } from "react-router-dom"

const { Title, Text } = Typography

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    const data = await login(e)

    if (data.code === 200) {
      message.success("Đăng nhập thành công")
      localStorage.setItem("permissions", JSON.stringify(data.permissions))
      setCookie("token", data.token, 24)
      setCookie("name", data.fullName, 24)
      dispatch(checkLogin(data.token))
      navigate("/admin/dashboard")
    } else {
      message.error("Tài khoản hoặc mật khẩu không chính xác!!")
    }
  }

  return (
    <div className="login">
      <div className="login__background">
        <div className="login__container">
          <Card className="login__card" bordered={false}>
            <div className="login__header">
              <div className="login__logo">
                <div className="login__logo-icon">
                  <LoginOutlined />
                </div>
              </div>
              <Title level={2} className="login__title">
                Đăng nhập quản trị
              </Title>
              <Text className="login__subtitle">Chào mừng bạn quay trở lại</Text>
            </div>
            <Card className="login__card" bordered={false}>
              <Form className="login__form" onFinish={handleSubmit} layout="vertical" size="large">
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email của bạn!" },
                    { type: "string", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="login__input-icon" />}
                    placeholder="Nhập email của bạn"
                    className="login__input"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="login__input-icon" />}
                    placeholder="Nhập mật khẩu"
                    className="login__input"
                  />
                </Form.Item>

                <Form.Item className="login__submit-wrapper">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login__submit-btn"
                    icon={<LoginOutlined />}
                    block
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            <div className="login__footer">
              <Text className="login__footer-text">🔒 Bảo mật bởi hệ thống xác thực tiên tiến</Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
