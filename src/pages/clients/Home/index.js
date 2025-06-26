import { useEffect, useState } from "react";
import { listHomeGet } from "../../../services/client/homeServies";
import ListProduct from "../../../components/ListProduct";

import { Layout, Button, Input, Typography, Row, Col, Form, Space, Card } from "antd"
import CategoryCard from "../../../components/Category-card"

const { Content } = Layout
const { Title, Text, Paragraph } = Typography


function Home() {
  const [productFeatured, setProductFeatured] = useState([]);

  const fetchApi = async () => {
    try {
      const response = await listHomeGet();
      if (response.code === 200) {
        setProductFeatured(response.newFeaturedProducts);
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);


  return (
    <>

      <Layout className="min-h-screen">
        <Content>
          {/* Hero Section */}
          <section style={{ padding: "48px 0", background: "linear-gradient(to right, #f0f5ff, #e6f7ff)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} lg={12}>
                  <div style={{ maxWidth: "560px" }}>
                    <Title level={1} style={{ marginBottom: "16px" }}>
                      Summer Collection 2025
                    </Title>
                    <Paragraph style={{ fontSize: "16px", color: "rgba(0, 0, 0, 0.65)", marginBottom: "24px" }}>
                      Discover our latest arrivals with up to 40% off. Limited time offer on all summer essentials.
                    </Paragraph>
                    <Space>
                      <Button type="primary" size="large">
                        Shop Now
                      </Button>
                      <Button size="large">View Catalog</Button>
                    </Space>
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <div style={{ maxWidth: "500px", margin: "0 auto", borderRadius: "8px", overflow: "hidden" }}>
                    <img
                      src="/placeholder.svg?height=500&width=800"
                      alt="Summer collection showcase"
                      style={{ width: "100%", height: "auto", objectFit: "cover" }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </section>

          {/* Categories */}
          <section style={{ padding: "48px 0", background: "white" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <Title level={2}>Shop by Category</Title>
                <Paragraph style={{ maxWidth: "700px", margin: "0 auto", color: "rgba(0, 0, 0, 0.65)" }}>
                  Browse our wide selection of products across popular categories
                </Paragraph>
              </div>
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                  <CategoryCard name="Fashion" image="/placeholder.svg?height=300&width=300" itemCount={120} />
                </Col>
                <Col xs={12} md={6}>
                  <CategoryCard name="Electronics" image="/placeholder.svg?height=300&width=300" itemCount={85} />
                </Col>
                <Col xs={12} md={6}>
                  <CategoryCard name="Home & Living" image="/placeholder.svg?height=300&width=300" itemCount={64} />
                </Col>
                <Col xs={12} md={6}>
                  <CategoryCard name="Beauty" image="/placeholder.svg?height=300&width=300" itemCount={42} />
                </Col>
              </Row>
            </div>
          </section>

          {/* Featured Products */}
          <ListProduct products={productFeatured} filter={false} title={`Featured Products`} />

          {/* Special Offers */}
          <section style={{ padding: "48px 0", background: "white" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
              <Card
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "linear-gradient(to right, #ff85c0, #b37feb)",
                  padding: "1px",
                }}
              >
                <Card style={{ borderRadius: "8px", background: "white" }}>
                  <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} lg={12}>
                      <Title level={2}>Special Offer</Title>
                      <Paragraph style={{ fontSize: "16px", color: "rgba(0, 0, 0, 0.65)", marginBottom: "24px" }}>
                        Get 30% off on all accessories when you buy any smartphone. Limited time offer!
                      </Paragraph>
                      <Space>
                        <Button type="primary" size="large">
                          Shop Now
                        </Button>
                        <Button size="large">Learn More</Button>
                      </Space>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div style={{ maxWidth: "500px", margin: "0 auto", borderRadius: "8px", overflow: "hidden" }}>
                        <img
                          src="/placeholder.svg?height=400&width=600"
                          alt="Special offer promotion"
                          style={{ width: "100%", height: "auto", objectFit: "cover" }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Card>
            </div>
          </section>

          {/* Newsletter */}
          <section style={{ padding: "48px 0", background: "#f5f5f5" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
              <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
                <Title level={2}>Join Our Newsletter</Title>
                <Paragraph style={{ color: "rgba(0, 0, 0, 0.65)", marginBottom: "24px" }}>
                  Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                </Paragraph>
                <Form layout="inline" style={{ justifyContent: "center" }}>
                  <Form.Item style={{ flex: 1, maxWidth: "300px" }}>
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Subscribe
                    </Button>
                  </Form.Item>
                </Form>
                <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "8px" }}>
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </div>
            </div>
          </section>
        </Content>
      </Layout>
    </>
  );
}

export default Home;
