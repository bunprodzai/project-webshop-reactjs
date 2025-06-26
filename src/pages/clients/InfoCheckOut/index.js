import { useEffect, useState } from "react";
import { findCartGet } from "../../../services/client/cartServies";
import { Button, Col, Form, Input, message, Row, Table, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { orderPost } from "../../../services/client/checkoutServies";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCartLength } from "../../../actions/cart"
const { Text } = Typography;

function InfoCheckOut() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartId = localStorage.getItem("cartId");
  const [form] = Form.useForm();
  const [cart, setCart] = useState([]);

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
            <p>Đơn giá: {(Number(record.productInfo.price) * (100 - Number(record.productInfo.discountPercentage)) / 100).toFixed(0)}</p>
            <p>Thành tiền: {record.quantity * (Number(record.productInfo.price) * (100 - Number(record.productInfo.discountPercentage)) / 100).toFixed(0)}</p>
          </div>
        </div>
      ),
    }
  ];

  const onFinish = async () => {
    const values = await form.validateFields();
    if (!values.fullName) {
      message.error("Vui lòng nhập họ tên!");
      return;
    }

    if (!values.email) {
      message.error("Vui lòng nhập Email!");
      return;
    }

    if (!values.address) {
      message.error("Vui lòng nhập địa chỉ!");
      return;
    }
    if (!values.phone) {
      message.error("Vui lòng nhập số điện thoại!");
      return;
    }
    values.note = values.note ? values.note : "";

    const userInfo = {
      fullName: values.fullName,
      phone: values.phone,
      address: values.address,
      note: values.note,
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
    }
  }

  return (
    <>
      <div className="check-out">
        <Row gutter={[16, 16]}>
          <Col span={14}>
            <Typography.Title level={4}>
              Thông tin cá nhân
            </Typography.Title>
            <div className="info-user">
              <Form layout="vertical" form={form} >
                <Row gutter={[16,16]}>
                  <Col span={12}>
                    <Form.Item label="Họ tên" name="fullName">
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Email" name="email">
                      <Input allowClear required/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Địa chỉ" name="address">
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Số điện thoại" name="phone">
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Ghi chú" name="note">
                      <TextArea rows={6} allowClear />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
          <Col span={10}>
            <div className="cart">
              <Typography.Title level={4}>
                Giỏ hàng
              </Typography.Title>
              <Table
                dataSource={cart}
                columns={columns}
                pagination={false}
                key={"data-cart"}
                summary={() => (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={1} align="right">
                        <Text strong>Tổng tiền: {cart.reduce((total, item) => total + item.totalPrice, 0).toLocaleString()} $</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={1} align="left">
                        <Button
                          type="primary"
                          style={{
                            marginTop: "10px",
                            width: "100%",
                            backgroundColor: "#ffc107",
                            borderColor: "#ffc107",
                          }}
                          onClick={onFinish}
                        >
                          Tiến hành thanh toán
                        </Button>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default InfoCheckOut;