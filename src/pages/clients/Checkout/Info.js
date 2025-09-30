import { useEffect, useState } from "react";
import { findCartGet } from "../../../services/client/cartServies";
import { Button, Col, Form, Input, message, Row, Select, Table, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { orderPost } from "../../../services/client/checkoutServies";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCartLength } from "../../../actions/cart"
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import Title from "antd/es/typography/Title";
const { Text } = Typography;

const { Option } = Select

function InfoCheckout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartId = localStorage.getItem("cartId");
  const [form] = Form.useForm();
  const [cart, setCart] = useState([]);

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProvinces = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://provinces.open-api.vn/api/p/")
      const data = await response.json()
      setProvinces(data)
    } catch (error) {
      console.error("Error fetching provinces:", error)
      message.error("Không thể tải danh sách tỉnh/thành phố")
    } finally {
      setLoading(false)
    }
  }

  const fetchDistricts = async (provinceCode) => {
    try {
      setLoading(true)
      const response = await fetch("https://provinces.open-api.vn/api/p/" + provinceCode + "?depth=2")
      const data = await response.json()
      setDistricts(data.districts || [])
      setWards([])
      form.setFieldsValue({ district: undefined, ward: undefined })
    } catch (error) {
      console.error("Error fetching districts:", error)
      message.error("Không thể tải danh sách quận/huyện")
    } finally {
      setLoading(false)
    }
  }

  const fetchWards = async (districtCode) => {
    try {
      setLoading(true)
      const response = await fetch("https://provinces.open-api.vn/api/d/" + districtCode + "?depth=2")
      const data = await response.json()
      setWards(data.wards || [])
      form.setFieldsValue({ ward: undefined })
    } catch (error) {
      console.error("Error fetching wards:", error)
      message.error("Không thể tải danh sách phường/xã")
    } finally {
      setLoading(false)
    }
  }

  const handleProvinceChange = (value) => {
    fetchDistricts(value)
  }

  const handleDistrictChange = (value) => {
    fetchWards(value)
  }

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await findCartGet(cartId);
        if (response.code === 200) {
          setCart(response.recordsCart.products);
        }
      } catch (error) {

      }
    }
    fetchProvinces();
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cấu hình cột của bảng
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productInfo",
      key: "product",
      render: (_, record) => {
        const discountedPrice =
          (Number(record.productInfo.price) * (100 - Number(record.productInfo.discountPercentage))) / 100

        return (
          <div className="flex items-center gap-4">
            <img
              src={record.productInfo.thumbnail || "/placeholder.svg"}
              alt={record.productInfo.title}
              className="w-16 h-16 object-cover product-image"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">{record.productInfo.title}</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Số lượng: <span className="font-medium">{record.quantity}</span>
                </p>
                <p>
                  Kích cỡ: <span className="font-medium">{record.size}</span>
                </p>
                <p className="price-text font-bold">{discountedPrice.toLocaleString()} đ</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg price-text">{record.totalPrice.toLocaleString()} đ</p>
            </div>
          </div>
        )
      },
    },
  ]

  const onFinish = async (values) => {

    // Tìm tên tương ứng từ code
    const provinceName = provinces.find((p) => p.code === values.province)
    const districtName = districts.find((d) => d.code === values.district)
    const wardName = wards.find((w) => w.code === values.ward)
    // Ghép lại thành địa chỉ đầy đủ
    const fullAddress =
      values.address +
      ", " +
      (wardName ? wardName.name : "") +
      ", " +
      (districtName ? districtName.name : "") +
      ", " +
      (provinceName ? provinceName.name : "")
    const userInfo = {
      fullName: values.fullName,
      phone: values.phone,
      address: fullAddress,
      note: values.note | "",
      email: values.email
    }
    try {
      const resOrderPost = await orderPost({ cartId: cartId, userInfo: userInfo });
      if (resOrderPost.code === 200) {
        dispatch(updateCartLength(0));
        navigate(`/order/checkout/pay?code=${resOrderPost.codeOrder}`);
        message.success(resOrderPost.message);
      } else if (resOrderPost.code === 204) {
        message.error(resOrderPost.message);
      } else {
        message.error("Tạo đơn hàng không thành công");
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  const totalAmount = cart.reduce((total, item) => total + item.totalPrice, 0)

  const filterOption = (input, option) => {
    if (option && option.children) {
      return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    return false
  }

  return (
    <>
      <div className="checkout-container">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-4">
            <Title level={1} className="text-4xl font-bold text-foreground mb-2">
              Hoàn tất đơn hàng
            </Title>
            <Text className="text-lg text-muted-foreground">Vui lòng điền thông tin để hoàn tất đơn hàng của bạn</Text>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} lg={14}>
              <div className="space-y-8">
                <div className="form-section">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="step-number" style={{ fontSize: "30px" }}>1</div>
                    <div>
                      <h2 className="step-title">Thông tin cá nhân</h2>
                      <p className="step-description">Nhập thông tin liên hệ của bạn</p>
                    </div>
                  </div>

                  <Form
                    form={form}
                    name="checkoutForm"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    className="space-y-4"
                  >
                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Họ tên"
                          name="fullName"
                          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                        >
                          <Input
                            prefix={<UserOutlined className="text-muted-foreground" />}
                            placeholder="Nhập họ tên đầy đủ"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                          ]}
                        >
                          <Input
                            prefix={<MailOutlined className="text-muted-foreground" />}
                            placeholder="example@email.com"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Số điện thoại"
                          name="phone"
                          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                        >
                          <Input
                            prefix={<PhoneOutlined className="text-muted-foreground" />}
                            placeholder="0123 456 789"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Địa chỉ cụ thể"
                          name="address"
                          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                        >
                          <Input
                            prefix={<HomeOutlined className="text-muted-foreground" />}
                            placeholder="Số nhà, tên đường..."
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="form-section">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="step-number" style={{ fontSize: "30px" }}>2</div>
                        <div>
                          <h2 className="step-title">Chọn địa chỉ giao hàng</h2>
                          <p className="step-description">Chọn tỉnh/thành phố, quận/huyện và phường/xã</p>
                        </div>
                      </div>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label="Tỉnh/Thành phố"
                            name="province"
                            rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
                          >
                            <Select
                              placeholder="Chọn tỉnh/thành phố"
                              size="large"
                              loading={loading}
                              onChange={handleProvinceChange}
                              showSearch
                              filterOption={filterOption}
                            >
                              {provinces.map((province) => (
                                <Option key={province.code} value={province.code}>
                                  {province.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                          <Form.Item
                            label="Quận/Huyện"
                            name="district"
                            rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                          >
                            <Select
                              placeholder="Chọn quận/huyện"
                              size="large"
                              loading={loading}
                              onChange={handleDistrictChange}
                              disabled={districts.length === 0}
                              showSearch
                              filterOption={filterOption}
                            >
                              {districts.map((district) => (
                                <Option key={district.code} value={district.code}>
                                  {district.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                          <Form.Item
                            label="Phường/Xã"
                            name="ward"
                            rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
                          >
                            <Select
                              placeholder="Chọn phường/xã"
                              size="large"
                              loading={loading}
                              disabled={wards.length === 0}
                              showSearch
                              filterOption={filterOption}
                            >
                              {wards.map((ward) => (
                                <Option key={ward.code} value={ward.code}>
                                  {ward.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item label="Ghi chú đơn hàng" name="note">
                        <TextArea rows={3} placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)" maxLength={200} showCount />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="large"
                          className="w-full mt-6"
                          htmlType="submit"    // dùng submit thay vì onClick
                          loading={loading}
                        >
                          Đặt hàng ngay
                        </Button>
                        <div className="mt-4 text-center">
                          <Text className="text-xs text-muted-foreground">
                            Bằng cách đặt hàng, bạn đồng ý với{" "}
                            <a href="#" className="text-primary hover:underline">
                              Điều khoản dịch vụ
                            </a>{" "}
                            của chúng tôi
                          </Text>
                        </div>
                      </Form.Item>

                    </div>
                  </Form>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={10}>
              <div className="order-summary">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingCartOutlined className="text-2xl text-primary" />
                  <Title level={3} className="text-foreground mb-0">
                    Đơn hàng của bạn
                  </Title>
                </div>

                <Table dataSource={cart} columns={columns} pagination={false} showHeader={false} className="mb-6" />

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Text className="text-muted-foreground">Tạm tính:</Text>
                    <Text className="total-text"><b>{totalAmount.toLocaleString()} đ</b></Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default InfoCheckout;