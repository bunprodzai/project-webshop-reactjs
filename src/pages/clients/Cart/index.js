import { useEffect, useState } from "react";
import { delCartPatch, findCartGet, updateCartPatch } from "../../../services/client/cartServies";
import { Table, Button, InputNumber, Typography, message } from "antd";
import "antd/dist/reset.css";
import { updateCartLength } from "../../../actions/cart";
import { useDispatch } from "react-redux";

const { Text } = Typography;

function Cart() {
  const dispatch = useDispatch();
  const cartId = localStorage.getItem("cartId");

  const [cart, setCart] = useState([]);

  const fetchApi = async () => {
    try {
      const response = await findCartGet(cartId);
      if(response.code === 200){
        setCart(response.recordsCart.products);
      }
    } catch (error) {

    }
  }
  useEffect(() => {

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (e, record) => {
    const fetchApiChangeQuantity = async () => {
      const response = await updateCartPatch(record.productInfo._id, { quantity: e, cartId: localStorage.getItem("cartId"), size: record.size });
      if (response.code === 200) {
        const updatedItems = cart.map((item) =>
          item._id === record._id ? { ...item, quantity: e } : item
        );
        setCart(updatedItems);
        dispatch(updateCartLength(response.totalQuantityProduts));
        fetchApi();
        message.success(response.message)
      } else {
        message.error(response.message);
      }
    }

    fetchApiChangeQuantity();
  };

  // Xóa sản phẩm
  const handleRemove = (record) => {
    const fetchApiDelProduct = async () => {
      const response = await delCartPatch(record.productInfo._id, { cartId: localStorage.getItem("cartId"), size: record.size });
      if (response.code === 200) {
        dispatch(updateCartLength(response.totalQuantityProduts));
        fetchApi();
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    }

    fetchApiDelProduct();
  };

  // Cấu hình cột của bảng
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={record.productInfo.thumbnail} alt={record.productInfo.title} width={50} />
          <div>
            <a href={`/detail/${record.productInfo.slug}`} >{record.productInfo.title}</a>
            <br />
            <Button
              type="link"
              danger
              onClick={() => handleRemove(record)}
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
      render: (_, record) => `${record.productInfo.price.toLocaleString()} VNĐ`,
    },
    {
      title: "Giảm giá",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      render: (_, record) => `${record.productInfo.discountPercentage}%`,
    },
    {
      title: "Thành tiền",
      dataIndex: "newPrice",
      key: "newPrice",
      render: (_, record) => `${(Number(record.productInfo.price) * (100 - Number(record.productInfo.discountPercentage)) / 100).toLocaleString()} VNĐ` ,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(e) => handleQuantityChange(e, record)}
        />
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size"
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice"
    },
  ];

  return (
    <>
      <div className="cart" style={{ padding: "20px", margin: "0 auto" }}>
        <Typography.Title level={4}>
          Thông tin sản phẩm
        </Typography.Title>
        <Table
          dataSource={cart}
          columns={columns}
          pagination={false}
          key={"data-cart"}
          summary={() => (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={6} align="right">
                  <Text strong>Tổng tiền</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text strong>
                    {cart.reduce((total, item) => total + item.totalPrice, 0).toLocaleString()} VNĐ
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={7} align="right">
                  <a href={`/order/info-checkout`}>
                    <Button
                      type="primary"
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        backgroundColor: "#ffc107",
                        borderColor: "#ffc107",
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
      </div>
    </>
  )
}

export default Cart;