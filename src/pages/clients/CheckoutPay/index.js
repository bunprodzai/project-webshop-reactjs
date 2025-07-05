import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { detailOrderGet, successOrderPatch } from "../../../services/client/checkoutServies";
import { Button, Card, Col, message, QRCode, Row, Table, Tabs, Typography } from "antd";
import { CreditCardOutlined, WalletOutlined } from "@ant-design/icons";
import "./CheckoutPay.scss";
const { Text } = Typography;


function CheckoutPay() {

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code") || "";

  const [order, setOrder] = useState();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await detailOrderGet(code);
        if (response.code === 200) {
          setOrder(response.recordsOrder);
        }
      } catch (error) {

      }
    }

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  // Cấu hình cột của bảng
  const columns = [
    {
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={record.productInfo.thumbnail} alt={record.productInfo.title} width={50} />
          <div>
            <b>{record.productInfo.title}</b>
            <p>Số lượng: <b>{record.quantity}</b></p>
            <p>Kích cở: <b>{record.size}</b></p>
            
            <p>Đơn giá: {(Number(record.productInfo.price) * (100 - Number(record.productInfo.discountPercentage)) / 100).toLocaleString()} VNĐ</p>
            <p>Thành tiền: {record.quantity * (Number(record.productInfo.price) * (100 - Number(record.productInfo.discountPercentage)) / 100).toLocaleString()} VNĐ</p>
          </div>
        </div>
      ),
    }
  ];

  const onchange = (key) => {
    setPaymentMethod(key);
  }

  const data = [
    { key: "1", label: "Tên ngân hàng", value: "Techcombank" },
    { key: "2", label: "Chủ tài khoản", value: "Dương Tấn Hòa" },
    { key: "3", label: "Số tài khoản", value: "BUNDEPTRAI" },
    {
      key: "4", label: "Hoặc QRCode", value: <QRCode
        errorLevel="H"
        value="00020101021138580010A000000727012800069704070114190389251260100208QRIBFTTA5204601153037045802VN5903TCB6005Hanoi6304326e"
      />
    }
  ];

  const columnsPayment = [
    {
      title: "",
      dataIndex: "label",
      key: "label",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "",
      dataIndex: "value",
      key: "value",
      render: (text) => <Text>{text}</Text>,
    },
  ];

  const handlePayment = () => {
    const fetchApiSuccess = async () => {
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
      children: <>
        <Card
          title={<Text strong>Tài khoản ngân hàng</Text>}
          style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}
        >
          <Table
            dataSource={data}
            columns={columnsPayment}
            pagination={false}
            showHeader={false}
          />
          <div style={{ marginTop: 20 }}>

            <Text strong>Nội dung chuyển khoản: </Text>
            {order ? (
              <>
                <Text style={{ color: "red" }}>{order.code}</Text>
              </>
            ) : (
              <p>Đang tải...</p>
            )}

          </div>
        </Card>
      </>,
    }
  ];

  return (
    <>
      <div className="check-out">
        <Row gutter={[16, 16]}>
          <Col span={14}>
            <Typography.Title level={4}>
              Thông tin cá nhân
            </Typography.Title>
            <Card>
              <div className="info-user">
                {order ? (
                  <>
                    <p>Họ tên: {order.userInfo.fullName}</p>
                    <p>Số điện thoại: {order.userInfo.phone}</p>
                    <p>Địa chỉ: {order.userInfo.address}</p>
                    <p>Ghi chú: {order.userInfo.note}</p>
                  </>
                ) : (
                  <p>Đang tải...</p>
                )}
              </div>
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
              <Typography.Title level={4}>
                Giỏ hàng
              </Typography.Title>
              {order ? (
                <Table
                  dataSource={order.products.map((product, index) => ({
                    ...product,
                    key: product.id || index, // Sử dụng `id` nếu có, nếu không thì dùng chỉ số
                  }))}
                  columns={columns}
                  pagination={false}
                  key={"data-cart"}
                  summary={() => (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={1} align="right">
                          <Text strong>
                            Tổng tiền: {order.products.reduce((total, item) => total + item.totalPrice, 0).toLocaleString()} $
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  )}
                />
              ) : (
                <p>Đang tải...</p>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CheckoutPay;