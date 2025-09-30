
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, Typography, Badge, Button, Row, Col, Divider, Space, Image, Spin, Result, Alert } from "antd"
import {
  CloseCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  InboxOutlined ,
  ReloadOutlined,
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { detailOrderGet } from "../../../services/client/checkoutServies"

const { Title, Text, Paragraph } = Typography

const FailCheckout = () => {
  const params = useParams()
  const [code, setCode] = useState(params.code || "")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorReason, setErrorReason] = useState("")

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true)
        const response = await detailOrderGet(code)
        if (response.code === 200 && response.status !== "received") {
          setOrder(response.recordsOrder)
          // Giả sử có thông tin lỗi từ API
          setErrorReason(response.errorReason || "Thanh toán không thành công")
        }
      } catch (error) {
        console.error("Lỗi lấy đơn hàng: ", error)
        setErrorReason("Không thể kết nối đến server")
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      fetchApi()
    }
  }, [code])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusConfig = (status) => {
    const statusMap = {
      failed: { text: "Thanh toán thất bại", color: "red" },
      cancelled: { text: "Đã hủy", color: "default" },
      expired: { text: "Hết hạn", color: "orange" },
      pending: { text: "Đang chờ", color: "blue" },
    }
    return statusMap[status] || { text: "Thất bại", color: "red" }
  }

  const handleRetryPayment = () => {
    // Logic thử lại thanh toán
    console.log("Thử lại thanh toán cho đơn hàng:", order?.code)
    // Redirect to payment page
    window.location.href = `/checkout/payment/${code}`
  }

  const handleContactSupport = () => {
    // Logic liên hệ hỗ trợ
    console.log("Liên hệ hỗ trợ cho đơn hàng:", order?.code)
    // Open support chat or redirect to support page
  }

  const handleContinueShopping = () => {
    // Logic tiếp tục mua sắm
    window.location.href = "/"
  }

  const handleBackToCart = () => {
    // Logic quay lại giỏ hàng
    window.location.href = "/cart"
  }

  const getFailureReasons = () => {
    return [
      "Thông tin thẻ tín dụng không chính xác",
      "Tài khoản không đủ số dư",
      "Thẻ đã hết hạn hoặc bị khóa",
      "Vượt quá hạn mức giao dịch",
      "Lỗi kết nối với ngân hàng",
      "Phiên giao dịch đã hết hạn",
    ]
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Spin size="large" />
        <Text style={{ marginLeft: 16 }}>Đang tải thông tin đơn hàng...</Text>
      </div>
    )
  }

  if (!order) {
    return (
      <Result
        status="404"
        title="Không tìm thấy đơn hàng"
        subTitle="Đơn hàng không tồn tại hoặc đã bị xóa."
        extra={
          <Button type="primary" onClick={handleContinueShopping}>
            Về trang chủ
          </Button>
        }
      />
    )
  }

  const statusConfig = getStatusConfig(order.status)

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "24px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {/* Header thất bại */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <CloseCircleOutlined
            style={{
              fontSize: 64,
              color: "#ff4d4f",
              marginBottom: 16,
            }}
          />
          <Title level={2} style={{ color: "#262626", marginBottom: 8 }}>
            Thanh toán không thành công!
          </Title>
          <Paragraph style={{ fontSize: 16, color: "#8c8c8c" }}>
            Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.
          </Paragraph>
        </div>

        {/* Thông báo lỗi */}
        <Alert
          message="Lỗi thanh toán"
          description={errorReason}
          type="error"
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 24 }}
          showIcon
        />

        <Row gutter={[24, 24]}>
          {/* Cột trái - Thông tin đơn hàng và sản phẩm */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Thông tin đơn hàng */}
              <Card
                title={
                  <Space>
                    <InboxOutlined  />
                    <span>Thông tin đơn hàng</span>
                  </Space>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Mã đơn hàng:</Text>
                  </Col>
                  <Col span={12}>
                    <Text code style={{ fontSize: 18 }}>
                      {order.code}
                    </Text>
                  </Col>

                  <Col span={12}>
                    <Text strong>Trạng thái:</Text>
                  </Col>
                  <Col span={12}>
                    <Badge color={statusConfig.color} text={statusConfig.text} />
                  </Col>

                  <Col span={12}>
                    <Text strong>Thời gian thử thanh toán:</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">{formatDate(order.updatedAt || order.createdAt)}</Text>
                  </Col>

                  <Col span={12}>
                    <Text strong>Phương thức thanh toán:</Text>
                  </Col>
                  <Col span={12}>
                    <Text>{order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : order.paymentMethod}</Text>
                  </Col>
                </Row>
              </Card>

              {/* Nguyên nhân có thể */}
              <Card
                title={
                  <Space>
                    <ExclamationCircleOutlined />
                    <span>Nguyên nhân có thể</span>
                  </Space>
                }
              >
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {getFailureReasons().map((reason, index) => (
                    <li key={index} style={{ marginBottom: 8 }}>
                      <Text>{reason}</Text>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Danh sách sản phẩm */}
              <Card title="Sản phẩm trong đơn hàng">
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {order.products.map((product, index) => (
                    <Card key={product._id} size="small" style={{ backgroundColor: "#fafafa" }}>
                      <Row gutter={16} align="middle">
                        <Col xs={6} sm={4}>
                          <Image
                            width={80}
                            height={80}
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
                                {formatPrice(product.price)}
                              </Text>
                              <Text strong style={{ color: "#ff4d4f" }}>
                                {formatPrice(product.price * (1 - product.discountPercentage / 100))}
                              </Text>
                              <Badge count={`-${product.discountPercentage}%`} style={{ backgroundColor: "#ff4d4f" }} />
                            </Space>
                          </Space>
                        </Col>

                        <Col xs={24} sm={6} style={{ textAlign: "right" }}>
                          <Title level={4} style={{ color: "#8c8c8c", margin: 0 }}>
                            {formatPrice(product.totalPrice)}
                          </Title>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              </Card>
            </Space>
          </Col>

          {/* Cột phải - Thông tin khách hàng và tổng tiền */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
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

                  {order.userInfo.note && (
                    <>
                      <Divider style={{ margin: "12px 0" }} />
                      <div>
                        <Text strong>Ghi chú: </Text>
                        <Text type="secondary">{order.userInfo.note}</Text>
                      </div>
                    </>
                  )}
                </Space>
              </Card>

              {/* Tổng tiền */}
              <Card
                title={
                  <Space>
                    <CreditCardOutlined />
                    <span>Tổng cộng</span>
                  </Space>
                }
              >
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Row justify="space-between">
                    <Col>
                      <Text>Tạm tính:</Text>
                    </Col>
                    <Col>
                      <Text>{formatPrice(order.totalPriceProducts)}</Text>
                    </Col>
                  </Row>

                  <Row justify="space-between">
                    <Col>
                      <Text>Phí vận chuyển:</Text>
                    </Col>
                    <Col>
                      <Text>Miễn phí</Text>
                    </Col>
                  </Row>

                  <Divider style={{ margin: "12px 0" }} />

                  <Row justify="space-between">
                    <Col>
                      <Title level={4}>Tổng cộng:</Title>
                    </Col>
                    <Col>
                      <Title level={4} style={{ color: "#ff4d4f", margin: 0 }}>
                        {formatPrice(order.totalPriceProducts)}
                      </Title>
                    </Col>
                  </Row>
                </Space>
              </Card>

              {/* Nút hành động */}
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<ReloadOutlined />}
                  onClick={handleRetryPayment}
                  style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                >
                  Thử lại thanh toán
                </Button>

                <Button
                  size="large"
                  block
                  icon={<CustomerServiceOutlined />}
                  onClick={handleContactSupport}
                  style={{ borderColor: "#ff4d4f", color: "#ff4d4f" }}
                >
                  Liên hệ hỗ trợ
                </Button>

                <Button size="large" block onClick={handleBackToCart}>
                  Quay lại giỏ hàng
                </Button>

                <Button size="large" block icon={<ShoppingOutlined />} onClick={handleContinueShopping}>
                  Tiếp tục mua sắm
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Thông tin hỗ trợ */}
        <Card style={{ marginTop: 24 }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <CustomerServiceOutlined style={{ fontSize: 32, color: "#1890ff", marginBottom: 8 }} />
              <Title level={4}>Hỗ trợ 24/7</Title>
              <Text>Hotline: 1900 1234</Text>
            </Col>

            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <MailOutlined style={{ fontSize: 32, color: "#1890ff", marginBottom: 8 }} />
              <Title level={4}>Email hỗ trợ</Title>
              <Text>support@example.com</Text>
            </Col>

            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <ReloadOutlined style={{ fontSize: 32, color: "#1890ff", marginBottom: 8 }} />
              <Title level={4}>Thử lại dễ dàng</Title>
              <Text>Chỉ cần 1 click để thử lại</Text>
            </Col>
          </Row>
        </Card>

        {/* Lưu ý quan trọng */}
        <Alert
          message="Lưu ý quan trọng"
          description={
            <div>
              <p>• Đơn hàng của bạn vẫn được lưu trong hệ thống và có thể thanh toán lại.</p>
              <p>• Nếu bạn đã bị trừ tiền, số tiền sẽ được hoàn lại trong 3-5 ngày làm việc.</p>
              <p>• Liên hệ ngay với chúng tôi nếu cần hỗ trợ khẩn cấp.</p>
            </div>
          }
          type="info"
          style={{ marginTop: 24 }}
          showIcon
        />
      </div>
    </div>
  )
}

export default FailCheckout;