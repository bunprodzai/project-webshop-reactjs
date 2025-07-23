import { useEffect, useState } from "react";
import { listHomeGet } from "../../../services/client/homeServies";
import ListProduct from "../../../components/ListProduct";

import { Layout, Button, Input, Typography, Row, Col, Form, Space, Card } from "antd"
import CategoryCard from "../../../components/Category-card"
import { listCategoriesGet } from "../../../services/client/categoriesServies";
import { Link } from "react-router-dom";
import Article from "../article";
import TopBanner from "../TopBanner";

const { Content } = Layout
const { Title, Text, Paragraph } = Typography


function Home() {
  const [productFeatured, setProductFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchApi = async () => {
    try {
      const responseCategories = await listCategoriesGet();
      if (responseCategories.code === 200) {
        setCategories(responseCategories.productsCategory);
      }
      const response = await listHomeGet();
      if (response.code === 200) {
        setProductFeatured(response.newFeaturedProducts);
      } else {
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
                      <a href="#products">
                        <Button type="primary" size="large">
                          Shop Now
                        </Button>
                      </a>
                      <Link to="/danh-muc">
                        <Button size="large">View Catalog</Button>
                      </Link>
                    </Space>
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <div style={{ maxWidth: "500px", margin: "0 auto", borderRadius: "8px", overflow: "hidden" }}>
                    <img
                      src="https://img.freepik.com/free-vector/hand-drawn-summer-sale-banner-template-with-photo_23-2148961156.jpg?semt=ais_items_boosted&w=740"
                      alt="Summer collection showcase"
                      style={{ width: "100%", height: "auto", objectFit: "cover" }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </section>

          {/* Categories */}
          {categories.length > 0 && (
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
                    <CategoryCard name={categories[0].title} image={categories[0].thumbnail} itemCount={120} slug={categories[0].slug} />
                  </Col>
                  <Col xs={12} md={6}>
                    <CategoryCard name={categories[1].title} image={categories[1].thumbnail} itemCount={85} slug={categories[1].slug} />
                  </Col>
                  <Col xs={12} md={6}>
                    <CategoryCard name={categories[2].title} image={categories[2].thumbnail} itemCount={64} slug={categories[2].slug} />
                  </Col>
                  <Col xs={12} md={6}>
                    <CategoryCard name={categories[3].title} image={categories[3].thumbnail} itemCount={42} slug={categories[3].slug} />
                  </Col>
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

          {/* Bài biết */}
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
        </Content>
      </Layout>
    </>
  );
}

export default Home;
