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
            {/* Google Maps */}
            <Col xs={24} sm={24} lg={6}>
              <Title level={4} style={{ color: "white", marginBottom: "20px" }}>
                Vị trí cửa hàng
              </Title>
              <div
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  border: "2px solid rgba(255,255,255,0.1)",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.0315914447!2d108.22082731533!3d16.06778438889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a83%3A0x36ac5073f8618a0b!2zTmd1eeG7hW4gVsSDbiBMaW5oLCBIw6BpIENow6J1LCDEkMOgIE7hurVuZyA1NTAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1642678901234!5m2!1svi!2s"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí cửa hàng"
                />
              </div>
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
      </Footer>
    </>
  )
}

export default FooterClient;