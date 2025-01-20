import { Button, Col, Form, Input, message, Row } from "antd";
import "./Login.scss";
import { login } from "../../../services/admin/loginServies";
import { setCookie } from "../../../helpers/cookie";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../../actions/login";
import { useNavigate } from "react-router-dom";
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const data = await login(e);
    
    if (data.code === 200) {
      message.success("Đăng nhập thành công");
      localStorage.setItem('permissions', JSON.stringify(data.permissions));
      setCookie("token", data.token, 24);
      setCookie("name", data.fullName, 24);
      dispatch(checkLogin(data.token));
      navigate("/admin/dashboard");
    } else {
      message.error("Tài khoản hoặc mật khẩu không chính xác!!");
    } 
  }

  return (
    <>
      <div className="login">
        <Row>
          <div className="form-input">
            <h1>Đăng nhập quản trị</h1>
            <Form className="login__form" onFinish={handleSubmit} >
              <Col span={24}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your Your  Email!' }]}
                >
                  <Input placeholder="Email"/>
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input.Password
                    placeholder="input password"
                    // iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <Form.Item name="btn">
                  <Button htmlType="submit" ghost className="login-form-button">
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </div>
        </Row>
      </div>
    </>
  )
}

export default Login;