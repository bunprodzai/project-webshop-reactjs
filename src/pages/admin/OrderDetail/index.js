import { Button, Card, Col, message, Modal, Row, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { getCookie } from "../../../helpers/cookie";
import { detailOrderGet } from "../../../services/admin/orderServies";
import NoRole from "../../../components/NoRole";


const OrderDetail = (props) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const { record } = props;

  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [detail, setDetail] = useState([]);

  const fetchApi = async () => {
    try {
      const response = await detailOrderGet(record._id, token);
   
      setDetail(response.record);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu vai trò!');
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Data đổ vào table
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Giá cũ',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '% Giảm giá',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
    },
    {
      title: 'Giá mới',
      dataIndex: 'newPrice',
      key: 'newPrice',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice'
    }
  ];

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <>
      {permissions.includes("orders_view") ?
        <>
          <Button icon={<EyeOutlined />} type="primary" ghost onClick={showModal} />
          <Modal
            title="Chi tiết đơn hàng"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={"70%"}
          >
            <Row>
              <Col span={24}>
                <Card title="Thông tin khách hàng" style={{ height: "100%" }}>
                  <Card
                    style={{
                      marginTop: 10,
                      width: "100%"
                    }}
                    type="inner"
                  >
                    <p>Tên: {record.fullName}</p>
                    <p>Số điện thoại: {record.phone}</p>
                    <p>Địa chỉ: {record.address}</p>
                    <p>Email: {record.email}</p>
                    <p>Ngày tạo: {formatDate(record.createdAt)}</p>
                  </Card>
                </Card>
              </Col>
              <Col span={24}>
                <Table
                  dataSource={detail.products ? detail.products : []}
                  columns={columns}
                  className='table-list'
                  rowKey={(record) => record._id} // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
                  pagination={{
                    pageSize: 5, // Số mục trên mỗi trang
                    total: record.products?.length || 0, // Tổng số mục (dựa trên data)
                    showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                    style: { display: 'flex', justifyContent: 'center' } // Căn giữa phân trang
                  }}
                />
              </Col>
              <Col span={24}>
                <b>Trạng thái: {record.status === "initialize" && (
                  <Tag color="processing" key={`initialize-${record.code}`}>
                    Khởi tạo
                  </Tag>
                )}
                  {record.status === "received" && (
                    <Tag color="orange" key={`received-${record.code}`} >
                      Đã nhận
                    </Tag>
                  )}
                  {record.status === "success" && (
                    <Tag color="success" key={`success-${record.code}`} >
                      Hoàn thành
                    </Tag>
                  )}
                </b>
                <br />
                <b>Tổng tiền: {detail.totalPriceProducts}</b>
              </Col>
            </Row>
          </Modal>
        </>
        :
        <NoRole />
      }
    </>
  )
}

export default OrderDetail;