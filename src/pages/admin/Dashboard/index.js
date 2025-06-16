
import { Card, Row, Col, Statistic, Table, Tag, Input, Button, Progress, Space, Typography, Badge, Select, Spin } from "antd"
import {
  ShoppingCartOutlined,
  UserOutlined,
  FolderOpenOutlined,
  RiseOutlined,
  FallOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  BarChartOutlined,
  PieChartOutlined,
  CalendarOutlined,
  FilterOutlined,
  TrophyOutlined,
  WarningOutlined,
  ShoppingOutlined,
} from "@ant-design/icons"
import { useEffect, useState } from "react"
import { Option } from "antd/es/mentions"
import { getLatestRevenue, getpercentGrowthCategory, getpercentGrowthOrder, getpercentGrowthProduct, getpercentGrowthUser, getTimeStartWeb } from "../../../services/admin/dashboardServies"
import { getCookie } from "../../../helpers/cookie"

const { Title, Text } = Typography
const { Search } = Input

// Dữ liệu cho bảng đơn hàng
const orderColumns = [
  {
    title: "Mã Đơn",
    dataIndex: "orderCode",
    key: "orderCode",
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: "Khách Hàng",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Sản Phẩm",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Trạng Thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusConfig = {
        completed: { color: "green", text: "Hoàn thành" },
        processing: { color: "orange", text: "Đang xử lý" },
        shipping: { color: "blue", text: "Đang giao" },
        cancelled: { color: "red", text: "Đã hủy" },
      }
      const config = statusConfig[status]
      return <Tag color={config.color}>{config.text}</Tag>
    },
  },
  {
    title: "Tổng Tiền",
    dataIndex: "total",
    key: "total",
    render: (amount) => <Text strong>{amount.toLocaleString()} VNĐ</Text>,
  },
  {
    title: "Ngày Đặt",
    dataIndex: "date",
    key: "date",
  },
]

const orderData = [
  {
    key: "1",
    orderCode: "#DH001",
    customer: "Nguyễn Văn A",
    product: "iPhone 15 Pro",
    status: "completed",
    total: 25990000,
    date: "15/03/2024",
  },
  {
    key: "2",
    orderCode: "#DH002",
    customer: "Trần Thị B",
    product: "Áo khoác nữ",
    status: "processing",
    total: 450000,
    date: "14/03/2024",
  },
  {
    key: "3",
    orderCode: "#DH003",
    customer: "Lê Văn C",
    product: "Laptop Dell XPS",
    status: "shipping",
    total: 18500000,
    date: "13/03/2024",
  },
  {
    key: "4",
    orderCode: "#DH004",
    customer: "Phạm Thị D",
    product: "Nồi cơm điện",
    status: "cancelled",
    total: 1200000,
    date: "12/03/2024",
  },
  {
    key: "5",
    orderCode: "#DH005",
    customer: "Hoàng Văn E",
    product: "Sách lập trình",
    status: "completed",
    total: 299000,
    date: "11/03/2024",
  },
]

const getCurrentMonth = () => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${month}-${year}`;
};

// Hàm tính phần trăm tăng trưởng doanh thu theo tháng
function calculateGrowthPercentage(data, currentTime) {
  const current = data.find(item => item.time === currentTime);
  if (!current) {
    return { growth: 0, message: "Không tìm thấy tháng hiện tại trong dữ liệu" };
  }

  const maxRevenue = Math.max(...data.map(item => item.totalRevenue));

  if (maxRevenue === 0) {
    return { growth: 0, message: "Không có dữ liệu doanh thu nào lớn hơn 0 để tính phần trăm" };
  }

  const growth = (current.totalRevenue / maxRevenue) * 100;

  return Math.round(growth * 100) / 100;
}

function Dashboard() {
  const token = getCookie("token");
  const [loading, setLoading] = useState(true);
  // Dữ liệu tháng hiện tại
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  // Dữ liệu thời gian bắt đầu của trang web
  const [timeLine, setTimeLine] = useState([]);

  // Dữ liệu thống kê
  const [countProductCurrent, setCountProductCurrent] = useState(0);
  const [countProductLast, setCountProductLast] = useState(0);

  const [countOrderCurrent, setCountOrderCurrent] = useState(0);
  const [countOrderLast, setCountOrderLast] = useState(0);

  const [countUserCurrent, setCountUserCurrent] = useState(0);
  const [countUserLast, setCountUserLast] = useState(0);

  const [countCategoryCurrent, setCountCategoryCurrent] = useState(0);
  const [countCategoryLast, setCountCategoryLast] = useState(0);
  // End dữ liệu thống kê

  const [latestRevenue, setLatestRevenue] = useState([]);

  const fetchApiPercentGrowthProduct = async (time) => {
    try {
      const response = await getpercentGrowthProduct(token, time);
      if (response.code === 200) {
        setCountProductCurrent(response.countProductCurrent);
        setCountProductLast(response.countProductLast);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng sản phẩm:", error);
    }
  }

  const fetchApiPercentGrowthOrder = async (time) => {
    try {
      const response = await getpercentGrowthOrder(token, time);
      if (response.code === 200) {
        setCountOrderCurrent(response.countOrderCurrent);
        setCountOrderLast(response.countOrderLast);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng sản phẩm:", error);
    }
  }

  const fetchApiPercentGrowthUser = async (time) => {
    try {
      const response = await getpercentGrowthUser(token, time);
      if (response.code === 200) {
        setCountUserCurrent(response.countUserCurrent);
        setCountUserLast(response.countUserLast);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng người dùng:", error);
    }
  }

  const fetchApiPercentGrowthCategory = async (time) => {
    try {
      const response = await getpercentGrowthCategory(token, time);
      if (response.code === 200) {
        setCountCategoryCurrent(response.countCategoryCurrent);
        setCountCategoryLast(response.countCategoryLast);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng danh mục:", error);
    }
  }

  const fetchApiLatesRevenue = async () => {
    try {
      const response = await getLatestRevenue(token);
      if (response.code === 200) {
        setLatestRevenue(response.revenues);
        console.log(response);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng danh mục:", error);
    }
  }

  useEffect(() => {
    const fetchApiTimeStart = async () => {
      try {
        const response = await getTimeStartWeb(token);
        if (response.code === 200) {
          setTimeLine(response.timeLine);

          // Thiết lập tháng được chọn mặc định là tháng hiện tại
          const currentMonth = getCurrentMonth();
          if (response.timeLine.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
          } else if (response.timeLine.length > 0) {
            setSelectedMonth(response.timeLine[0]); // fallback nếu tháng hiện tại chưa có đơn
          }

        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchApiLatesRevenue();
    fetchApiPercentGrowthUser(selectedMonth);
    fetchApiPercentGrowthCategory(selectedMonth);
    fetchApiPercentGrowthOrder(selectedMonth);
    fetchApiPercentGrowthProduct(selectedMonth);
    fetchApiTimeStart();
    setLoading(false);
  }, [])


  const handleChange = (value) => {
    setSelectedMonth(value);
    fetchApiPercentGrowthProduct(value);
    fetchApiPercentGrowthOrder(value);
    fetchApiPercentGrowthUser(value);
    fetchApiPercentGrowthCategory(value);
    console.log('Tháng được chọn:', value);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 24px",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <Title level={2} style={{ margin: 0 }}>
                Bảng Thống Kê
              </Title>
              <Badge status="success" text="Cập nhật mới" />
            </Space>
          </Col>
          <Col>
            <Space>
              <Search placeholder="Tìm kiếm..." style={{ width: 300 }} prefix={<SearchOutlined />} />
              <Button icon={<BellOutlined />} />
              <Button icon={<SettingOutlined />} />
            </Space>
          </Col>
        </Row>
      </div>

      <div style={{ padding: "24px" }}>
        <Col xs={24}>
          <div>
            <label style={{ marginRight: 8 }}>Chọn tháng:</label>
            <Select
              placeholder="Chọn tháng"
              value={selectedMonth}
              onChange={(value) => {
                setSelectedMonth(value);
                handleChange(value, 'month');
              }}
              style={{
                marginBottom: 16,
                width: 150
              }}>
              {timeLine.slice().reverse().map((month) => (
                <Option value={month}>
                  Tháng {month}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          {/* Tổng Đơn Hàng */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                border: "none",
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Tổng Đơn Hàng ({countOrderCurrent - countOrderLast})</span>}
                value={countOrderCurrent}
                valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
                prefix={<ShoppingCartOutlined style={{ color: "white" }} />}
                suffix={
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                    <RiseOutlined /> {((countOrderCurrent - countOrderLast) / countOrderLast) * 100}%
                  </div>
                }
              />
            </Card>
          </Col>

          {/* Sản Phẩm */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                border: "none",
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Sản Phẩm {countProductCurrent}-{countProductLast}</span>}
                value={countProductCurrent}
                valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
                prefix={<ShoppingOutlined style={{ color: "white" }} />}
                suffix={
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                    <RiseOutlined /> {((countProductCurrent - countProductLast) / countProductLast) * 100}%
                  </div>
                }
              />
            </Card>
          </Col>

          {/* Khách Hàng */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
                border: "none",
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Khách Hàng ({countUserCurrent - countUserLast})</span>}
                value={countUserCurrent}
                valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
                prefix={<UserOutlined style={{ color: "white" }} />}
                suffix={
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                    <RiseOutlined /> {((countUserCurrent - countUserLast) / countUserLast) * 100}%
                  </div>
                }
              />
            </Card>
          </Col>

          {/* Danh Mục */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)",
                border: "none",
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)" }}>Danh Mục ({countCategoryCurrent - countCategoryLast})</span>}
                value={countCategoryCurrent}
                valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
                prefix={<FolderOpenOutlined style={{ color: "white" }} />}
                suffix={
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                    <FallOutlined /> {((countCategoryCurrent - countCategoryLast) / countCategoryLast) * 100}%
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Charts and Analytics */}
        {latestRevenue.length >= 4 && (
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Doanh Thu Theo Tháng */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined />
                    <span>Doanh Thu 4 Tháng Gần Nhất</span>
                  </Space>
                }
              >
                <div style={{ padding: "16px 0" }}>
                  <Row justify="space-between" style={{ marginBottom: 16 }}>
                    <Text strong>Tháng {latestRevenue[0].time.split("-")[1]}</Text>
                    <Text type="secondary">{latestRevenue[0].totalRevenue} VNĐ</Text>
                  </Row>
                  <Progress percent={calculateGrowthPercentage(latestRevenue, latestRevenue[0].time)} strokeColor="#ff6b35" style={{ marginBottom: 24 }} />

                  <Row justify="space-between" style={{ marginBottom: 16 }}>
                    <Text strong>Tháng {latestRevenue[1].time.split("-")[1]}</Text>
                    <Text type="secondary">{latestRevenue[1].totalRevenue} VNĐ</Text>
                  </Row>
                  <Progress percent={calculateGrowthPercentage(latestRevenue, latestRevenue[1].time)} strokeColor="#52c41a" style={{ marginBottom: 24 }} />

                  <Row justify="space-between" style={{ marginBottom: 16 }}>
                    <Text strong>Tháng {latestRevenue[2].time.split("-")[1]}</Text>
                    <Text type="secondary">{latestRevenue[2].totalRevenue} VNĐ</Text>
                  </Row>
                  <Progress percent={calculateGrowthPercentage(latestRevenue, latestRevenue[2].time)} strokeColor="#722ed1" style={{ marginBottom: 24 }} />

                  <Row justify="space-between" style={{ marginBottom: 16 }}>
                    <Text strong>Tháng {latestRevenue[3].time.split("-")[1]}</Text>
                    <Text type="secondary">{latestRevenue[3].totalRevenue} VNĐ</Text>
                  </Row>
                  <Progress percent={calculateGrowthPercentage(latestRevenue, latestRevenue[3].time)} strokeColor="#13c2c2" />
                </div>
              </Card>
            </Col>

            {/* Top Danh Mục Bán Chạy */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <PieChartOutlined />
                    <span>Top Danh Mục Bán Chạy</span>
                  </Space>
                }
              >
                <div style={{ padding: "16px 0" }}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Space>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: "#ff6b35",
                          borderRadius: "50%",
                        }}
                      />
                      <Text strong>Điện tử</Text>
                    </Space>
                    <Text type="secondary">35%</Text>
                  </Row>

                  <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Space>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: "#52c41a",
                          borderRadius: "50%",
                        }}
                      />
                      <Text strong>Thời trang</Text>
                    </Space>
                    <Text type="secondary">28%</Text>
                  </Row>

                  <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Space>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: "#722ed1",
                          borderRadius: "50%",
                        }}
                      />
                      <Text strong>Gia dụng</Text>
                    </Space>
                    <Text type="secondary">22%</Text>
                  </Row>

                  <Row justify="space-between" align="middle">
                    <Space>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: "#13c2c2",
                          borderRadius: "50%",
                        }}
                      />
                      <Text strong>Sách</Text>
                    </Space>
                    <Text type="secondary">15%</Text>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        )}
        
        {/* Recent Orders Table */}
        <Card
          title="Đơn Hàng Gần Đây"
          extra={
            <Space>
              <Button icon={<FilterOutlined />}>Lọc</Button>
              <Button icon={<CalendarOutlined />}>Thời gian</Button>
            </Space>
          }
          style={{ marginBottom: 32 }}
        >
          <Table columns={orderColumns} dataSource={orderData} pagination={{ pageSize: 5 }} scroll={{ x: 800 }} />
        </Card>

        {/* Sản Phẩm Bán Chạy */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card title="Sản Phẩm Bán Chạy">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Row justify="space-between" align="middle">
                  <Text>iPhone 15 Pro</Text>
                  <Tag color="blue">127 đã bán</Tag>
                </Row>
                <Row justify="space-between" align="middle">
                  <Text>Samsung Galaxy S24</Text>
                  <Tag color="blue">98 đã bán</Tag>
                </Row>
                <Row justify="space-between" align="middle">
                  <Text>MacBook Air M3</Text>
                  <Tag color="blue">76 đã bán</Tag>
                </Row>
              </Space>
            </Card>
          </Col>

          {/* Khách Hàng VIP */}
          <Col xs={24} md={8}>
            <Card title="Khách Hàng VIP">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Row justify="space-between" align="middle">
                  <Text>Nguyễn Văn A</Text>
                  <Tag color="gold" icon={<TrophyOutlined />}>
                    VIP Gold
                  </Tag>
                </Row>
                <Row justify="space-between" align="middle">
                  <Text>Trần Thị B</Text>
                  <Tag color="silver">VIP Silver</Tag>
                </Row>
                <Row justify="space-between" align="middle">
                  <Text>Lê Văn C</Text>
                  <Tag color="orange">VIP Bronze</Tag>
                </Row>
              </Space>
            </Card>
          </Col>

          {/* Tồn Kho Thấp */}
          <Col xs={24} md={8}>
            <Card title="Tồn Kho Thấp">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Row justify="space-between" align="middle">
                  <Text>Tai nghe AirPods</Text>
                  <Tag color="red" icon={<WarningOutlined />}>
                    5 còn lại
                  </Tag>
                </Row>
                <Row justify="space-between" align="middle">
                  <Text>Ốp lưng iPhone</Text>
                  <Tag color="red" icon={<WarningOutlined />}>
                    3 còn lại
                  </Tag>
                </Row>
                <Row justify="space-between" align="middle">
                  <Text>Cáp sạc USB-C</Text>
                  <Tag color="red" icon={<WarningOutlined />}>
                    8 còn lại
                  </Tag>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
      </div >
    </div >
  )
}

export default Dashboard;