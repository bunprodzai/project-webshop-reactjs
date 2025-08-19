import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkVoucherPost, createQrPost, detailOrderGet, successOrderPatch } from "../../../services/client/checkoutServies";
import { Badge, Button, Card, Col, Form, Image, Input, message, Row, Space, Spin, Tabs, Typography } from "antd";
import { CheckCircleOutlined, CreditCardOutlined, EnvironmentOutlined, MailOutlined, NotificationFilled, PhoneOutlined, UserOutlined, WalletOutlined } from "@ant-design/icons";
import "./CheckoutPay.scss";
import Title from "antd/es/typography/Title";
const { Text } = Typography;


function CheckoutPay() {

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code") || "";

  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const fetchApi = async () => {
    try {
      const response = await detailOrderGet(code);
      if (response.code === 200) {
        setOrder(response.recordsOrder);
      }
    } catch (error) {

    }
  }

  useEffect(() => {

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onchange = (key) => {
    setPaymentMethod(key);
  }

  console.log(order);
  

  const handlePayment = () => {
    const fetchApiSuccess = async () => {
      if (paymentMethod === "bank") {
        try {
          const option = {
            code: code,
            Amount: order.totalOrder,
            orderInfo: `Thanh toán đơn hàng ${code}`
          }
          const vnpayResponse = await createQrPost(option);

          window.open(vnpayResponse);
        } catch {

        }
      } else {
        try {
          const response = await successOrderPatch(order._id, { paymentMethod: paymentMethod });
          if (response.code === 200) {
            message.success(response.message);
            navigate("/");
          } else {
            message.error(response.message);
          }
        } catch (error) {

        }
      }

    }

    fetchApiSuccess();
  }

  const items = [
    {
      key: 'cod',
      label: <><WalletOutlined /> Thanh toán khi nhận hàng</>,
      children: 'Thanh toán khi nhận hàng',
    },
    {
      key: 'bank',
      label: <><CreditCardOutlined /> Thanh toán bằng chuyển khoản</>,
      children: 'Thanh toán trực tuyến',
    }
  ];

  const onFinish = (e) => {
    e.order_code = code;

    const fetchApiCheckVoucher = async () => {
      const response = await checkVoucherPost(e);
      if (response.code === 200) {
        message.success(response.message);
        fetchApi();
      } else if (response.code === 204) {
        message.error(response.message);
      } else {
        message.error(response.message);
      }
    }

    fetchApiCheckVoucher();
  }

  return (
    <>
      <div className="check-out">
        {order === null ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" tip="Đang tải đơn hàng..." />
          </div>
        ) : order.status !== "initialize" ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <CheckCircleOutlined
                style={{
                  fontSize: 64,
                  color: "green",
                  marginBottom: 16,
                }}
              />
              <Title level={2} style={{ color: "#262626", marginBottom: 8 }}>
                Bạn đã xử lý đơn hàng này rồi!
              </Title>
            </div>
          </>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              <Col span={14}>
                {/* Thông tin khách hàng */}
                <Card
                  title={
                    <Space>
                      <UserOutlined />
                      <span>Thông tin khách hàng</span>
                    </Space>
                  }
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {order.userInfo && (
                      <>
                        <Space>
                          <UserOutlined style={{ color: "#8c8c8c" }} />
                          <Text>{order.userInfo.fullName}</Text>
                        </Space>

                        <Space>
                          <PhoneOutlined style={{ color: "#8c8c8c" }} />
                          <Text>{order.userInfo.phone}</Text>
                        </Space>

                        <Space>
                          <MailOutlined style={{ color: "#8c8c8c" }} />
                          <Text>{order.userInfo.email}</Text>
                        </Space>

                        <Space align="start">
                          <EnvironmentOutlined style={{ color: "#8c8c8c", marginTop: 4 }} />
                          <Text>{order.userInfo.address}</Text>
                        </Space>

                        <Space align="start">
                          <NotificationFilled style={{ color: "#8c8c8c", marginTop: 4 }} />
                          <Text>{order.userInfo.note}</Text>
                        </Space>
                      </>
                    )}
                  </Space>
                </Card>
                <Card>
                  <div className="pay">
                    <Tabs defaultActiveKey="cod" items={items} type="card" onChange={onchange} />
                    <Button
                      type="primary"
                      style={{
                        marginTop: 20,
                        backgroundColor: "#FFC234",
                        borderColor: "#FFC234",
                        color: "#ffffff",
                        fontWeight: "bold",
                      }}
                      block
                      onClick={handlePayment}
                    >
                      Xác nhận thanh toán đơn hàng.
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col span={10}>
                <div className="cart">
                  {order ? (
                    <>
                      {/* Danh sách sản phẩm */}
                      <Card title="Sản phẩm trong đơn hàng">
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                          {order.products.map((product, index) => (
                            <Card key={product._id} size="small" style={{ backgroundColor: "#fafafa" }}>
                              <Row gutter={16} align="middle">
                                <Col xs={6} sm={4}>
                                  <Image
                                    width={70}
                                    height={70}
                                    src={product.productInfo.thumbnail || "/placeholder.svg"}
                                    alt={product.productInfo.title}
                                    style={{ objectFit: "cover", borderRadius: 8 }}
                                    fallback="/placeholder.svg?height=80&width=80"
                                  />
                                </Col>

                                <Col xs={18} sm={14}>
                                  <Title level={5} style={{ marginBottom: 8 }}>
                                    {product.productInfo.title}
                                  </Title>
                                  <Space direction="vertical" size="small">
                                    <Text type="secondary">Size: {product.size}</Text>
                                    <Text type="secondary">Số lượng: {product.quantity}</Text>
                                    <Space>
                                      <Text delete type="secondary">
                                        {product.price.toLocaleString()} VNĐ
                                      </Text>
                                      <Text strong style={{ color: "#ff4d4f" }}>
                                        {Number(product.priceNew).toLocaleString()} VNĐ
                                      </Text>
                                      <Badge count={`-${product.discountPercentage}%`} style={{ backgroundColor: "#ff4d4f" }} />
                                    </Space>
                                  </Space>
                                </Col>

                                <Col xs={24} sm={6} style={{ textAlign: "right" }}>
                                  <Title level={4} style={{ color: "#8c8c8c", margin: 0 }}>
                                    {Number(product.totalPrice).toLocaleString()} VNĐ
                                  </Title>
                                </Col>
                              </Row>
                            </Card>
                          ))}
                        </Space>
                      </Card>

                      <Card title="Thông tin thanh toán" bordered={false}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                          <Row justify="space-between">
                            <Col>
                              <Text>🎟️ Voucher hiện tại:</Text>
                            </Col>
                            <Col>
                              <Text strong>{order.voucher_code || "Không có"}</Text>
                            </Col>
                          </Row>

                          <Form
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{ discountPercentage: 0 }}
                          >
                            <Row gutter={16}>
                              <Col span={18}>
                                <Form.Item
                                  label="Nhập mã voucher"
                                  name="voucher_code"
                                  rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
                                >
                                  <Input placeholder="Nhập mã giảm giá..." />
                                </Form.Item>
                              </Col>
                              <Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
                                <Form.Item>
                                  <Button type="primary" htmlType="submit" block>
                                    Kiểm tra
                                  </Button>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>

                          <Row justify="space-between" style={{ marginTop: 16 }}>
                            <Col>
                              <Title level={4} strong>Tổng tiền:</Title>
                            </Col>
                            <Col>
                              <Title level={4} strong>
                                {order.totalOrder.toLocaleString()} VNĐ
                              </Title>
                            </Col>
                          </Row>
                        </Space>
                      </Card>

                    </>
                  ) : (
                    <p>Đang tải...</p>
                  )}
                </div>
              </Col>
            </Row>
          </>
        )}

      </div >
    </>
  );
}

export default CheckoutPay;