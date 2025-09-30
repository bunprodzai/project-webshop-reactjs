import { Button, Card, message, Table, Tag } from "antd";
import { useState } from "react";
import { historyOrderGet } from "../../../services/client/userServies";
import { getCookie } from "../../../helpers/cookie";
import { useEffect } from "react";
import { CreditCardOutlined } from '@ant-design/icons';
import OrderDetail from "./Detail";
import { formatDate } from "../../../helpers/dateTime";

const columns = [
  {
    title: 'Họ tên',
    dataIndex: 'fullName',
    key: 'fullName',
  },
  {
    title: 'CODE',
    dataIndex: 'code',
    key: 'code',
    render: (text) => <b>{text}</b>
  },
  {
    title: 'Phương thức thanh toán',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (_, record) => {
      return (
        <>
          {record.status === "initialize" && (
            <Tag color="processing" key={`initialize-${record.code}`} style={{ cursor: "pointer" }} >
              Khởi tạo
            </Tag>
          )}
          {record.status === "processing" && (
            <Tag color={"orange"} key={`received-${record.code}`} data-id={`received-${record.code}`} style={{ cursor: "pointer" }} >
              Đang xử lý
            </Tag>
          )}
          {record.status === "received" && (
            <Tag color={"blue"} key={`received-${record.code}`} data-id={`received-${record.code}`} style={{ cursor: "pointer" }} >
              Đã xác nhận
            </Tag>
          )}
          {record.status === "success" && (
            <Tag color={"success"} key={`success-${record.code}`} style={{ cursor: "pointer" }} >
              Hoàn thành
            </Tag>
          )}
          {record.status === "cancelled" && (
            <Tag color={"red"} key={`cancelled-${record.code}`} style={{ cursor: "pointer" }} >
              Hoàn thành
            </Tag>
          )}
        </>
      )
    }
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'totalOrder',
    key: 'totalOrder',
    render: (text) => <span>{Number(text.toString()).toLocaleString()} VNĐ</span>
  },
  {
    title: 'Số lượng SP',
    dataIndex: 'quantityOrder',
    key: 'quantityOrder',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) => formatDate(text)
  },
  {
    title: 'Hành động',
    dataIndex: 'actions',
    key: 'actions',
    render: (_, record) => {
      return (
        <>
          {!record.paymentMethod?.trim() && (
            <div key={`action-${record._id}`}>
              <Button
                type="primary"
                icon={<CreditCardOutlined />}
                href={`/order/checkout/pay?code=${record.code}`}
                size="middle"
                style={{ borderRadius: "6px" }}
              >
                Thanh toán
              </Button>
            </div>
          )}
          <div key={`action-${record._id}`}>
            <OrderDetail record={record} />
          </div>
        </>
      )
    }
  }
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const tokenUser = getCookie("tokenUser");

  const fetchApi = async () => {
    try {
      const response = await historyOrderGet(tokenUser);
      if (response.code === 200) {
        // Biến đổi mảng
        const transformedOrders = response.records.map(order => ({
          _id: order._id,
          cart_id: order.cart_id,
          fullName: order.userInfo.fullName,
          phone: order.userInfo.phone,
          address: order.userInfo.address,
          totalOrder: order.totalOrder,
          createdAt: order.createdAt,
          quantityOrder: order.products.reduce((sum, product) => sum + product.quantity, 0),
          products: order.products,
          paymentMethod: order.paymentMethod,
          code: order.code,
          status: order.status
        }));

        setOrders(transformedOrders)
      } else {
        message.error(response.message || 'Lỗi khi tải dữ liệu đơn hàng!');
      }

    } catch (error) {
      message.error('Lỗi khi tải dữ liệu vai trò!');
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Card title="Danh sách đơn hàng" style={{ height: "100vh" }}>
        <Card
          style={{
            marginTop: 10,
            width: "100%"
          }}
          type="inner"
        >
          <Table
            dataSource={orders}
            columns={columns}
            className='table-list'
            rowKey={(record) => record._id} // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
            pagination={{
              pageSize: 10, // Số mục trên mỗi trang
              total: orders.length, // Tổng số mục (dựa trên data)
              showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
              style: { display: 'flex', justifyContent: 'center' }, // Căn giữa phân trang
            }}
          />
        </Card>
      </Card>
    </>
  );
}

export default Orders;