import { useEffect, useState } from "react";
import { listHomeGet } from "../../../services/client/homeServies";
import ListProduct from "../../../components/ListProduct";

import { Layout, Button, Input, Typography, Row, Col, Form, Space, Card } from "antd"
import CategoryCard from "../../../components/Category-card"
import Article from "../article";
import TopBanner from "../TopBanner";
import useProducts from "../../../hooks/client/useProducts";

const { Content } = Layout
const { Title, Text, Paragraph } = Typography

const benefits = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Free Shipping',
    description: 'Free Shipping for orders over £130'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="m12 17 .01 0" />
      </svg>
    ),
    title: 'Money Guarantee',
    description: 'Within 30 days for an exchange.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3c-.552 0-1-.448-1-1V3c0-.552-.448-1-1-1H8c-.552 0-1 .448-1 1v3c0 .552-.448 1-1 1H3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1h3c.552 0 1 .448 1 1v3c0 .552.448 1 1 1h3c.552 0 1 .448 1 1v3c0 .552.448 1 1 1h3c.552 0 1-.448 1-1v-3c0-.552.448-1 1-1h3z" />
      </svg>
    ),
    title: 'Online Support',
    description: '24 hours a day, 7 days a week'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: 'Flexible Payment',
    description: 'Pay with Multiple Credit Cards'
  }
];

function Home() {
  const [productFeatured, setProductFeatured] = useState([]);
  const { categoriesQuery } = useProducts();

  const fetchApi = async () => {
    try {
      const response = await listHomeGet();
      if (response.code === 200) {
        setProductFeatured(response.newFeaturedProducts);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <>

      <Layout className="min-h-screen">
        <Content>
          <TopBanner />

          {/* Categories */}
          {categoriesQuery.data && (
            <section style={{ padding: "48px 0", background: "white" }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                  <Title level={2}>Shop by Category</Title>
                  <Paragraph style={{ maxWidth: "700px", margin: "0 auto", color: "rgba(0, 0, 0, 0.65)" }}>
                    Browse our wide selection of products across popular categories
                  </Paragraph>
                </div>
                <Row gutter={[16, 16]}>
                  {categoriesQuery.data.slice(0, 4).map((category, i) => (
                    <Col xs={12} md={6} key={i}>
                      <CategoryCard name={category.title} image={category.thumbnail} itemCount={120} slug={category.slug} />
                    </Col>
                  ))}
                </Row>
              </div>
            </section>
          )}


          {/* Featured Products */}
          <div id="products">
            <ListProduct products={productFeatured} filter={false} title={`Featured Products`} />
          </div>

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
                        <a href="#products">
                          <Button type="primary" size="large">
                            Shop Now
                          </Button>
                        </a>
                        <Button size="large">Learn More</Button>
                      </Space>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div style={{ maxWidth: "500px", margin: "0 auto", borderRadius: "8px", overflow: "hidden" }}>
                        <img
                          // src="/placeholder.svg?height=400&width=600"
                          src="https://as1.ftcdn.net/jpg/02/63/72/58/1000_F_263725800_Z5BkPmmCD20NaK7c5sQ1hFfqVBC44NkT.jpg"
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

          {/* Bài viết */}
          <Article />

          {/* Newsletter */}
          <section style={{ padding: "48px 0", background: "#ffffff" }}>
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

          {/* Benefits */}
          <div className="py-8 px-2 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <Row gutter={[32, 32]} justify="center" align="middle">
                {benefits.map((benefit, index) => (
                  <Col
                    key={index}
                    xs={24}
                    sm={12}
                    md={6}
                    className="text-center"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-gray-600 mb-2">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Content>
      </Layout>
    </>
  );
}

export default Home;
