import { useState } from "react"
import { Button, Input, Checkbox, Form, Divider, message } from "antd"
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ShoppingOutlined,
  StarOutlined,
  UserOutlined,
  SafetyOutlined,
  GoogleOutlined,
  GithubOutlined,
} from "@ant-design/icons"
import { loginUserPost } from "../../../services/client/loginServies";
import Link from "antd/es/typography/Link"
import { getCookie, setCookie } from "../../../helpers/cookie";
import { checkLoginUser } from "../../../actions/loginUser";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginUser() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = getCookie("tokenUser");

  useEffect(() => {
    if (token) {
      navigate("/"); // đồng bộ Redux state từ cookie
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    setLoading(true)
    const response = await loginUserPost(e);
    if (response.code === 200) {
      message.success("Đăng nhập thành công");
      setCookie("email", e.email, 24);
      setCookie("avatar", response.avatar, 24);
      setCookie("tokenUser", response.tokenUser, 24);
      setCookie("fullName", response.fullName, 24);
      setCookie("userId", response.userId, 24);
      dispatch(checkLoginUser(true));
      navigate("/");
    } else {
      message.error(response.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding/Introduction */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShoppingOutlined className="text-2xl" />
              </div>
              <h1 className="text-3xl font-bold">ShopHub</h1>
            </div>

            <h2 className="text-4xl font-bold mb-6">Chào mừng trở lại với cửa hàng của chúng tôi</h2>

            <p className="text-xl text-white/90 mb-8">
              Khám phá hàng ngàn sản phẩm chất lượng cao với giá cả tốt nhất. Trải nghiệm mua sắm tuyệt vời đang chờ đón
              bạn.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <StarOutlined className="text-lg" />
                </div>
                <span className="text-lg">Hơn 10,000+ sản phẩm chất lượng</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <UserOutlined className="text-lg" />
                </div>
                <span className="text-lg">Được tin tưởng bởi 50,000+ khách hàng</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <SafetyOutlined className="text-lg" />
                </div>
                <span className="text-lg">Bảo mật thanh toán 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
              <p className="text-lg text-gray-600">Nhập thông tin đăng nhập để truy cập tài khoản của bạn</p>
            </div>

            <Form form={form} onFinish={handleSubmit} layout="vertical" size="large" className="space-y-4">
              <Form.Item
                name="email"
                label={<span className="text-sm font-medium text-gray-900">Email</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Nhập email của bạn"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-sm font-medium text-gray-900">Mật khẩu</span>}
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" className="mb-0">
                  <Checkbox className="text-sm text-gray-600">Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>

                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                  Quên mật khẩu?
                </Link>
              </div>

              <Form.Item className="mb-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-lg font-semibold text-lg"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="my-6">
              <span className="text-xs uppercase text-gray-500">Hoặc tiếp tục với</span>
            </Divider>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                icon={<GoogleOutlined />}
                className="h-12 flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400"
              >
                Google
              </Button>

              <Button
                icon={<GithubOutlined />}
                className="h-12 flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400"
              >
                GitHub
              </Button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Chưa có tài khoản? </span>
              <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
