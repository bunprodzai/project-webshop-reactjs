import { Card, Col, Image, Row, Spin, Tag, Typography } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import "./SlideProducts.scss";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

function SlideProducts(props) {
  const navigate = useNavigate();
  const { products, title } = props;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [])

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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
    <>
      <Title level={4}>{title}</Title>
      <Row
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
        }}
      >
        <Col span={24} style={{ marginBottom: "20px" }}>
          {products.length > 0 ?
            <Slider {...settings}>
              {products.map((product) => (
                <div
                  className="products-list"
                  key={product._id}
                  style={{
                    padding: "0 10px",
                    width: "100%",
                    height: "auto",
                  }}
                >
                  <Card onClick={() => {navigate(`/detail/${product.slug}`)}} size="default" hoverable className="products-list__item"
                    style={{
                      height: "300px", // Đặt chiều cao cố định
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "start",
                    }}>
                    <Image
                      width={"100%"}
                      height={"auto"}
                      src={product.thumbnail}
                      preview={false}
                      style={{
                        objectFit: "cover",
                        aspectRatio: "4/3",
                      }}
                      alt={product.title}
                    />
                    <a className="title" href={`/detail/${product.slug}`}>
                      <Text strong>{product.title}</Text>
                    </a>
                    <p className="priceOld">{product.price} $</p>
                    <p className="price">
                      {(product.price * (100 - product.discountPercentage) / 100).toFixed(0)} $ <Tag color="red">-{product.discountPercentage}%</Tag>
                    </p>
                  </Card>
                </div>
              ))}
            </Slider> :
            <>
              <h3 style={{ textAlign: "center", margin: "20px 0" }}>Không tìm thấy sản phẩm</h3>
            </>
          }
        </Col>
      </Row>
    </>
  )
}

export default SlideProducts;