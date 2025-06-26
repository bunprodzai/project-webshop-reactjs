import { Button, Col, Divider, Layout, Row, Space, Typography } from "antd";
// import { EnvironmentOutlined, FacebookOutlined, PhoneOutlined, } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { settingGeneralGet } from "../../services/client/settingServies";
import { Link } from "react-router-dom";
const { Footer } = Layout;
const { Title, Text } = Typography
function FooterClient() {
  const [setting, setSetting] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await settingGeneralGet();
        setSetting(response.settings);
      } catch (error) {
      }
    };

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Footer className="layout-default__footer">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <Row gutter={[48, 32]}>
            <Col xs={12} md={6}>
              <Title level={5}>Shop</Title>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">All Products</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">New Arrivals</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Best Sellers</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Discounted</Link>
                </li>
              </ul>
            </Col>
            <Col xs={12} md={6}>
              <Title level={5}>Company</Title>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">About Us</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Careers</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Press</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Affiliates</Link>
                </li>
              </ul>
            </Col>
            <Col xs={12} md={6}>
              <Title level={5}>Support</Title>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Contact Us</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">FAQs</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Shipping</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Returns</Link>
                </li>
              </ul>
            </Col>
            <Col xs={12} md={6}>
              <Title level={5}>Legal</Title>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Terms of Service</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Privacy Policy</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Cookie Policy</Link>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <Link href="#">Accessibility</Link>
                </li>
              </ul>
            </Col>
          </Row>
          <Divider />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <Text type="secondary">{setting.copyright}</Text>
            <Space>
              <Button
                type="text"
                icon={
                  <span role="img" aria-label="facebook">
                    📘
                  </span>
                }
              />
              <Button
                type="text"
                icon={
                  <span role="img" aria-label="instagram">
                    📷
                  </span>
                }
              />
              <Button
                type="text"
                icon={
                  <span role="img" aria-label="twitter">
                    🐦
                  </span>
                }
              />
              <Button
                type="text"
                icon={
                  <span role="img" aria-label="linkedin">
                    💼
                  </span>
                }
              />
            </Space>
          </div>
        </div>
        {/* <div className="container">
          <div className="content">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <ul>
                  <li>LIÊN HỆ</li>
                  <li>
                    <EnvironmentOutlined style={{ marginRight: "5px" }} />
                    {setting.address}
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      <FacebookOutlined style={{ marginRight: "5px" }} />
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href={setting.instagram} target="_blank" rel="noreferrer">
                      <FacebookOutlined style={{ marginRight: "5px" }} />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <PhoneOutlined style={{ marginRight: "5px" }} />
                    {setting.phone}
                  </li>
                </ul>
              </Col>
              <Col span={6}>
                <ul>
                  <li>HỖ TRỢ KHÁCH HÀNG</li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Hướng dẫn mua hàng trực tuyến
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Hướng dẫn thanh toán
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Hướng dẫn mua hàng trả góp
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Check Hoá đơn điện tử
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Liên hệ góp ý
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={6}>
                <ul>
                  <li>VỀ CHÚNG TÔI</li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Giới thiệu về công ty
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Hệ thống cửa hàng
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Tuyển dụng
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={6}>
                <ul>
                  <li>CHĂM SÓC KHÁCH HÀNG</li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Chính sách bảo hành
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Chính sách đổi trả sản phẩm
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
          
        </div> */}
      </Footer>
    </>
  )
}

export default FooterClient;