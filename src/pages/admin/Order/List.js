import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { Card, DatePicker, message, Modal, Select, Space, Table } from "antd";
import { changeStatusOrderGet, listOrderGet } from "../../../services/admin/orderServies";
import { ExclamationCircleFilled } from '@ant-design/icons';
import OrderDetail from "./Detail";
import NoRole from "../../../components/NoRole";
import { formatDate } from "../../../helpers/dateTime";
import ShippingSetting from "./Shipping"

const { confirm } = Modal;

function OrderList() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [orders, setOrders] = useState([]);
  const token = getCookie("token");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");

  const fetchApi = async () => {
    try {
      const response = await listOrderGet(token, day, month);
      // Biến đổi mảng
      const transformedOrders = response.records.map(order => ({
        _id: order._id,
        fullName: order.userInfo.fullName,
        phone: order.userInfo.phone,
        address: order.userInfo.address,
        totalOrder: order.totalOrder,
        createdAt: order.createdAt,
        quantityOrder: order.products.reduce((sum, product) => sum + product.quantity, 0),
        products: order.products,
        paymentMethod: order.paymentMethod,
        code: order.code,
        status: order.status,
        email: order.userInfo.email,
        shippingFee: order.shippingFee
      }));

      setOrders(transformedOrders)
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu vai trò!');
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month])

  const handleReload = () => {
    fetchApi();
  }

  const handleChangeStatus = (newStatus, code) => {
    confirm({
      title: 'Bạn chắc chắn muốn thay đổi trạng thái đơn hàng?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        const fetchApiChangeStatus = async () => {
          const response = await changeStatusOrderGet(token, newStatus, code);

          if (response.code === 200) {
            message.success(response.message);
            handleReload();
          } else {
            message.error(response.message);
          }
        };

        fetchApiChangeStatus();
      },
      onCancel() { },
    });
  };

  // Data đổ vào table

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
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
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
        // Tính toán option cần disable
        const disabledOptions = {
          initialize: ['initialize', 'received', 'processing', 'shipping', 'completed', 'returned'],
          confirmed: ['initialize', 'confirmed', 'shipping', 'completed', 'returned'],
          received: ['initialize', 'received', 'shipping', 'completed', 'returned'],
          processing: ['initialize', 'confirmed', 'processing', 'completed'],
          shipping: ['initialize', 'confirmed', 'received', 'processing', 'shipping'],
          completed: ['initialize', 'confirmed', 'received', 'processing', 'shipping', 'completed', 'cancelled', 'returned'],
          cancelled: ['initialize', 'confirmed', 'received', 'processing', 'shipping', 'completed', 'cancelled', 'returned'],
          returned: ['initialize', 'confirmed', 'received', 'processing', 'shipping', 'completed', 'cancelled', 'returned'],
        };

        return (
          <Select
            defaultValue={record.status}
            style={{ width: 180 }}
            onChange={(value) => handleChangeStatus(value, record.code)}
          >
            <Select.Option
              value="initialize"
              style={{ color: "#1677ff" }} // xanh dương
              disabled={disabledOptions[record.status].includes("initialize")}
            >
              <span style={{ color: "#1677ff" }}>Khởi tạo</span>
            </Select.Option>

            <Select.Option
              value="received"
              style={{ color: "#fa8c16" }} // cam
              disabled={disabledOptions[record.status].includes("received")}
            >
              <span style={{ color: "#fa8c16" }}>Đã thanh toán</span>
            </Select.Option>

            <Select.Option
              value="confirmed"
              style={{ color: "#722ed1" }} // tím
              disabled={disabledOptions[record.status].includes("confirmed")}
            >
              <span style={{ color: "#722ed1" }}>Đã xác nhận đơn</span>
            </Select.Option>

            <Select.Option
              value="processing"
              style={{ color: "#13c2c2" }} // xanh ngọc
              disabled={disabledOptions[record.status].includes("processing")}
            >
              <span style={{ color: "#13c2c2" }}>Đang xử lý đơn</span>
            </Select.Option>

            <Select.Option
              value="shipping"
              style={{ color: "#1890ff" }} // xanh dương sáng
              disabled={disabledOptions[record.status].includes("shipping")}
            >
              <span style={{ color: "#1890ff" }}>Đang giao hàng</span>
            </Select.Option>

            <Select.Option
              value="completed"
              style={{ color: "#52c41a" }} // xanh lá
              disabled={disabledOptions[record.status].includes("completed")}
            >
              <span style={{ color: "#52c41a" }}>Hoàn thành</span>
            </Select.Option>

            <Select.Option
              value="cancelled"
              style={{ color: "red", fontWeight: 600 }} // đỏ
              disabled={disabledOptions[record.status].includes("cancelled")}
            >

              <span style={{ color: "red" }}>Đã hủy</span>
            </Select.Option>

            <Select.Option
              value="returned"
              style={{ color: "#d46b08" }} // nâu cam
              disabled={disabledOptions[record.status].includes("returned")}
            >
              <span style={{ color: "#d46b08" }}>Hoàn hàng / Hoàn tiền</span>
            </Select.Option>
          </Select>

        );
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalOrder',
      key: 'totalOrder',
      render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
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
            <div key={`action-${record._id}`}>
              <OrderDetail record={record} shippingFee={record.shippingFee} />
            </div>
          </>
        )
      }
    }
  ];

  const onChangeDay = (_date, dateString) => {
    setMonth("");
    setDay(dateString);
  };
  const onChangeMonth = (_date, dateString) => {
    setDay("");
    setMonth(dateString);
  };
  return (
    <>
      {permissions.includes("orders_view") ?
        <Card title="Danh sách đơn hàng" style={{ height: "100vh" }}>
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Space direction="horizontal" size={12} style={{ marginBottom: 10 }}>
              <DatePicker onChange={onChangeDay} />
              <DatePicker onChange={onChangeMonth} picker="month" />
              <ShippingSetting />
            </Space>
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
        :
        <NoRole />
      }
    </>
  )
}

export default OrderList;