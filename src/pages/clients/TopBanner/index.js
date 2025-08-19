import { Carousel, Button, Typography, Row, Col } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { useEffect, useRef, useState } from "react"
import { listBanner } from "../../../services/client/bannerServies"

const { Title, Text } = Typography

function TopBanner() {
  const carouselRef = useRef(null)
  const [bannerData, setBannerData] = useState([]);
  useEffect(() => {

    const fetchApi = async () => {
      const response = await listBanner();
      if (response.code === 200) {
        response.banners.forEach(item => {
          item.buttonLink = `/banners/${item.slug}`;
          item.buttonText = `Xem thêm`;
        });
        console.log(response.banners);

        setBannerData(response.banners);
      }
    }
    fetchApi();
  }, [])

  // Mảng dữ liệu banner
  // const bannerData = [
  //   {
  //     id: 1,
  //     title: "Summer Sale 2025",
  //     subtitle: "Up to 70% OFF",
  //     description: "Discover amazing deals on summer collection",
  //     image: "https://img.freepik.com/free-vector/hand-drawn-summer-sale-banner-template-with-photo_23-2148961156.jpg",
  //     buttonText: "Shop Now",
  //     buttonLink: "/summer-sale",
  //     backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  //   }
  // ]

  const nextSlide = () => {
    carouselRef.current?.next()
  }

  const prevSlide = () => {
    carouselRef.current?.prev()
  }

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={4000}
        dots={true}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        dotPosition="bottom"
      >
        {bannerData.map((banner) => (
          <div key={banner.id}>
            <div
              style={{
                height: "400px",
                background: banner.backgroundColor,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ maxWidth: "1200px", margin: "0 auto", height: "100%" }}>
                <Row align="middle" style={{ height: "100%", padding: "0 16px" }}>
                  <Col xs={24} md={12}>
                    <div style={{ padding: "20px 0" }}>
                      {/* <Text
                        style={{
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: "16px",
                          fontWeight: "500",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {banner.subtitle}
                      </Text> */}
                      <Title
                        level={1}
                        style={{
                          color: "white",
                          marginBottom: "16px",
                          fontSize: "clamp(28px, 5vw, 48px)",
                        }}
                      >
                        {banner.title}
                      </Title>
                      <Text
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "16px",
                          display: "block",
                          marginBottom: "24px",
                          lineHeight: "1.6",
                        }}
                      >
                        {banner.excerpt}
                      </Text>
                      <Button
                        type="primary"
                        size="large"
                        style={{
                          backgroundColor: "white",
                          borderColor: "white",
                          color: "#1890ff",
                          fontWeight: "600",
                          height: "48px",
                          padding: "0 32px",
                        }}
                        onClick={() => (window.location.href = `banner/${banner.slug}`)}
                      >
                        {banner.buttonText}
                      </Button>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      <img
                        src={banner.image || "/placeholder.svg"}
                        alt={banner.title}
                        style={{
                          maxWidth: "100%",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Custom Navigation Arrows */}
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      />
      <Button
        type="text"
        icon={<RightOutlined />}
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      />
    </div>
  )
}

export default TopBanner
