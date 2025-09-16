import { Button, Card, Form, Input, message, Typography, Divider } from "antd"
import {
  UserOutlined,
  LockOutlined,
  UserAddOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ShoppingOutlined,
  StarOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import Link from "antd/es/typography/Link"
import { getCookie, setCookie } from "../../../helpers/cookie";
import { checkLoginUser } from "../../../actions/loginUser";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerPost } from "../../../services/client/userServies";
import { useEffect } from "react";
const { Title, Text } = Typography

export default function Register() {
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
    try {
      const response = await registerPost(e);
      if (response.code === 200) {
        setCookie("email", e.email, 24);
        setCookie("fullName", e.fullName, 24);
        setCookie("tokenUser", response.tokenUser, 24);
        dispatch(checkLoginUser(true));
        navigate("/");
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("An error occurred while creating your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/30 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border border-white/25 rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <ShoppingOutlined className="text-4xl mr-3" />
              <span className="text-2xl font-bold">ShopHub</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Join Our Shopping Community</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Create your account and discover thousands of products with exclusive deals and personalized
              recommendations.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <StarOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Exclusive Deals</h3>
                <p className="text-blue-100">Get access to member-only discounts and early sales</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                {/* <ShieldCheckOutlined className="text-xl" /> */}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Shopping</h3>
                <p className="text-blue-100">Your data and transactions are protected with enterprise-grade security</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Personalized Experience</h3>
                <p className="text-blue-100">Tailored recommendations based on your preferences</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 text-sm">
              "The best shopping experience I've ever had. Fast delivery and amazing customer service!"
              <span className="block mt-2 font-medium">- Sarah Johnson, Verified Customer</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card
            className="shadow-xl border-0"
            style={{
              borderRadius: "16px",
              background: "white",
            }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserAddOutlined className="text-2xl text-blue-600" />
              </div>
              <Title level={2} className="!mb-2 !text-gray-800">
                Create Account
              </Title>
              <Text className="text-gray-600">Join us today and start your shopping journey</Text>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="fullName"
                label={<span className="font-medium text-gray-700">Full Name</span>}
                rules={[
                  { required: true, message: "Please enter your full name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Enter your full name"
                  className="!py-3 !px-4 !rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="font-medium text-gray-700">Email Address</span>}
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Enter your email address"
                  className="!py-3 !px-4 !rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="font-medium text-gray-700">Password</span>}
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter your password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="!rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                  style={{
                    padding: "12px 16px",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="font-medium text-gray-700">Confirm Password</span>}
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("Passwords do not match"))
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Confirm your password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="!rounded-lg !border-gray-300 hover:!border-blue-400 focus:!border-blue-500"
                  style={{
                    padding: "12px 16px",
                  }}
                />
              </Form.Item>

              <Form.Item className="!mt-8 !mb-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="!h-12 !rounded-lg !font-medium !text-base !bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !border-0 !shadow-lg hover:!shadow-xl !transition-all !duration-200"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="!my-6">
              <Text className="!text-gray-500 !text-sm">Already have an account?</Text>
            </Divider>

            <div className="text-center">
              <Link href="/login">
                <Button
                  type="text"
                  size="large"
                  className="!text-blue-600 hover:!text-blue-700 !font-medium !h-auto !p-0"
                >
                  Sign in instead
                </Button>
              </Link>
            </div>
          </Card>

          <div className="text-center mt-6">
            <Text className="text-gray-500 text-sm">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
