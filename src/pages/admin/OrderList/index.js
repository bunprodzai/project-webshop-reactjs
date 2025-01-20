import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { Card, message, Modal, Table, Tag } from "antd";
import { changeStatusOrderGet, listOrderGet } from "../../../services/admin/orderServies";
import { ExclamationCircleFilled } from '@ant-design/icons';
import OrderDetail from "../OrderDetail";
import NoRole from "../../../components/NoRole";

const { confirm } = Modal;

function OrderList() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [orders, setOrders] = useState([]);
  const token = getCookie("token");

  const fetchApi = async () => {
    try {
      const response = await listOrderGet(token);
      // Biến đổi mảng
      const transformedOrders = response.records.map(order => ({
        _id: order._id,
        cart_id: order.cart_id,
        fullName: order.userInfo.fullName,
        phone: order.userInfo.phone,
        address: order.userInfo.address,
        totalMoney: order.totalOrder,
        createdAt: order.createdAt,
        quantityOrder: order.products.reduce((sum, product) => sum + product.quantity, 0),
        products: order.products,
        code: order.code,
        status: order.status
      }));

      setOrders(transformedOrders)
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu vai trò!');
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleReload = () => {
    fetchApi();
  }

  const handleCLickStatus = (e) => {
    confirm({
      title: 'Bạn chắc chắn là hoàn thành đơn hàng này?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        const code = e.target.attributes[0].value.split("-")[1];

        const fetchApiChangeStatus = async () => {
          const response = await changeStatusOrderGet(token, "success", code);

          if (response.code === 200) {
            message.success(response.message);
            handleReload();
          } else {
            message.error(response.message)
          }
        }

        fetchApiChangeStatus();
      },
      onCancel() {
      },
    });
  }

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
            {record.status === "received" && (
              <Tag color={"orange"} key={`received-${record.code}`} data-id={`received-${record.code}`} onClick={handleCLickStatus} style={{ cursor: "pointer" }} >
                Đã nhận
              </Tag>
            )}
            {record.status === "success" && (
              <Tag color={"success"} key={`success-${record.code}`} style={{ cursor: "pointer" }} >
                Hoàn thành
              </Tag>
            )}
          </>
        )
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
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
              <OrderDetail record={record} />
            </div>
          </>
        )
      }
    }
  ];

  return (
    <>
      {permissions.includes("orders_view") ?
        <Card title="Danh sách sản phẩm" style={{ height: "100vh" }}>
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
                pageSize: 5, // Số mục trên mỗi trang
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