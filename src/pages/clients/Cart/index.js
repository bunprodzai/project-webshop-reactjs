
import { useEffect, useState } from "react"
import { delCartPatch, findCartGet, updateCartPatch } from "../../../services/client/cartServies"
import { Table, Button, InputNumber, Typography, message, Card, Row, Col, Space, Divider } from "antd"
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import "antd/dist/reset.css"
import { updateCartLength } from "../../../actions/cart"
import { useDispatch } from "react-redux"

const { Text, Title } = Typography

function Cart() {
  const dispatch = useDispatch()
  const cartId = localStorage.getItem("cartId")
  const [cart, setCart] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const fetchApi = async () => {
    try {
      const response = await findCartGet(cartId)
      if (response.code === 200) {
        setCart(response.recordsCart.products)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  useEffect(() => {
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (e, record) => {
    const fetchApiChangeQuantity = async () => {
      const response = await updateCartPatch(record.productInfo._id, {
        quantity: e,
        cartId: localStorage.getItem("cartId"),
        size: record.size,
      })
      if (response.code === 200) {
        const updatedItems = cart.map((item) => (item._id === record._id ? { ...item, quantity: e } : item))
        setCart(updatedItems)
        dispatch(updateCartLength(response.totalQuantityProduts))
        fetchApi()
        message.success(response.message)
      } else {
        message.error(response.message)
      }
    }
    fetchApiChangeQuantity()
  }

  // Xóa sản phẩm
  const handleRemove = (record) => {
    const fetchApiDelProduct = async () => {
      const response = await delCartPatch(record.productInfo._id, {
        cartId: localStorage.getItem("cartId"),
        size: record.size,
      })
      if (response.code === 200) {
        dispatch(updateCartLength(response.totalQuantityProduts))
        fetchApi()
        message.success(response.message)
      } else {
        message.error(response.message)
      }
    }
    fetchApiDelProduct()
  }

  // Mobile Card Layout
  const MobileCartItem = ({ item }) => (
    <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col span={6}>
          <img
            src={item.productInfo.thumbnail || "/placeholder.svg"}
            alt={item.productInfo.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
              maxWidth: 80,
            }}
          />
        </Col>
        <Col span={18}>
          <div>
            <a
              href={`/detail/${item.productInfo.slug}`}
              style={{
                fontSize: 16,
                fontWeight: 500,
                display: "block",
                marginBottom: 8,
                color: "#1890ff",
              }}
            >
              {item.productInfo.title}
            </a>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Text type="secondary">Size: {item.size}</Text>
              <Text>
                Giá: <Text strong>{item.productInfo.price.toLocaleString()} VNĐ</Text>
              </Text>
              <Text>
                Giảm giá: <Text type="warning">{item.productInfo.discountPercentage}%</Text>
              </Text>
              <Text>
                Thành tiền:{" "}
                <Text strong style={{ color: "#52c41a" }}>
                  {(
                    (Number(item.productInfo.price) * (100 - Number(item.productInfo.discountPercentage))) /
                    100
                  ).toLocaleString()}{" "}
                  VNĐ
                </Text>
              </Text>
            </Space>
          </div>
        </Col>
      </Row>

      <Divider style={{ margin: "16px 0" }} />

      <Row justify="space-between" align="middle">
        <Col>
          <Space align="center">
            <Text>Số lượng:</Text>
            <InputNumber
              min={1}
              value={item.quantity}
              onChange={(e) => handleQuantityChange(e, item)}
              size="small"
              style={{ width: 80 }}
            />
          </Space>
        </Col>
        <Col>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemove(item)} size="small">
            Xóa
          </Button>
        </Col>
      </Row>

      <Row justify="end" style={{ marginTop: 12 }}>
        <Col>
          <Text strong style={{ fontSize: 16, color: "#f5222d" }}>
            Tổng: {item.totalPrice.toLocaleString()} VNĐ
          </Text>
        </Col>
      </Row>
    </Card>
  )

  // Desktop Table Columns
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "title",
      key: "title",
      width: 300,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={record.productInfo.thumbnail || "/placeholder.svg"}
            alt={record.productInfo.title}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <div>
            <a
              href={`/detail/${record.productInfo.slug}`}
              style={{
                fontWeight: 500,
                fontSize: 14,
                display: "block",
                marginBottom: 8,
              }}
            >
              {record.productInfo.title}
            </a>
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(record)}
              style={{ padding: 0, height: "auto" }}
            >
              Xóa
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (_, record) => <Text strong>{record.productInfo.price.toLocaleString()} VNĐ</Text>,
    },
    {
      title: "Giảm giá",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      width: 100,
      render: (_, record) => <Text type="warning">{record.productInfo.discountPercentage}%</Text>,
    },
    {
      title: "Thành tiền",
      dataIndex: "newPrice",
      key: "newPrice",
      width: 130,
      render: (_, record) => (
        <Text strong style={{ color: "#52c41a" }}>
          {(
            (Number(record.productInfo.price) * (100 - Number(record.productInfo.discountPercentage))) /
            100
          ).toLocaleString()}{" "}
          VNĐ
        </Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(e) => handleQuantityChange(e, record)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: 80,
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 130,
      render: (text) => (
        <Text strong style={{ color: "#f5222d", fontSize: 16 }}>
          {text.toLocaleString()} VNĐ
        </Text>
      ),
    },
  ]

  const totalAmount = cart.reduce((total, item) => total + item.totalPrice, 0)

  return (
    <div
      style={{
        padding: isMobile ? "16px" : "24px",
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
          gap: 12,
        }}
      >
        <ShoppingCartOutlined style={{ fontSize: 24, color: "#1890ff" }} />
        <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
          Giỏ hàng của bạn
        </Title>
      </div>

      {cart.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <ShoppingCartOutlined style={{ fontSize: 64, color: "#d9d9d9", marginBottom: 16 }} />
          <Title level={4} type="secondary">
            Giỏ hàng trống
          </Title>
          <Text type="secondary">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</Text>
        </Card>
      ) : (
        <>
          {isMobile ? (
            // Mobile Layout
            <div>
              {cart.map((item, index) => (
                <MobileCartItem key={item._id || index} item={item} />
              ))}

              {/* Mobile Summary */}
              <Card style={{ marginTop: 16, backgroundColor: "#fafafa" }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                  <Col>
                    <Title level={4} style={{ margin: 0 }}>
                      Tổng tiền:
                    </Title>
                  </Col>
                  <Col>
                    <Title level={3} style={{ margin: 0, color: "#f5222d" }}>
                      {totalAmount.toLocaleString()} VNĐ
                    </Title>
                  </Col>
                </Row>
                <a href={`/order/info-checkout`} style={{ display: "block" }}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    style={{
                      backgroundColor: "#ffc107",
                      borderColor: "#ffc107",
                      height: 48,
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    Tiến hành đặt hàng
                  </Button>
                </a>
              </Card>
            </div>
          ) : (
            // Desktop Table Layout
            <Table
              dataSource={cart}
              columns={columns}
              pagination={false}
              rowKey={(record) => record._id}
              scroll={{ x: 1000 }}
              summary={() => (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={6} align="right">
                      <Text strong style={{ fontSize: 16 }}>
                        Tổng tiền:
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong style={{ fontSize: 18, color: "#f5222d" }}>
                        {totalAmount.toLocaleString()} VNĐ
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={7} align="right">
                      <a href={`/order/info-checkout`}>
                        <Button
                          type="primary"
                          size="large"
                          style={{
                            marginTop: "16px",
                            minWidth: 200,
                            backgroundColor: "#ffc107",
                            borderColor: "#ffc107",
                            height: 40,
                            fontWeight: 500,
                          }}
                        >
                          Tiến hành đặt hàng
                        </Button>
                      </a>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              )}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Cart
