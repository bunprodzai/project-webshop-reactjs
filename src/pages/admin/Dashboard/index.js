import { Col, Row } from "antd";

function Dashboard() {
  return (
    <>
      <h2>Tổng quan</h2>
      <Row gutter={[20, 20]}>
        <Col span={8}>
        1
        </Col>
        <Col span={8}>
        2
        </Col>
        <Col span={8}>
        3
        </Col>
      </Row>
    </>
  )
}

export default Dashboard;