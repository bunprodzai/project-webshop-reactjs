import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Row,
  Col,
  Image,
  Typography,
  Button,
  InputNumber,
  Tag,
  Carousel,
  Radio,
  Space,
  Card,
  Divider,
  Badge,
} from "antd"
import { LeftOutlined, RightOutlined, ShoppingCartOutlined, TagOutlined } from "@ant-design/icons"
import parse from 'html-react-parser';
import ReviewProduct from "../ReviewProduct"
import ProductsRelated from "../../../components/Products-Related"
import { useCart } from "../../../hooks/client/useCart";
import useProducts from "../../../hooks/client/useProducts";

const { Title, Text } = Typography

function DetailProduct() {
  const params = useParams()
  const { add } = useCart()
  const [product, setProduct] = useState({})
  const [quantity, setQuantity] = useState(1)
  const { productQuery } = useProducts({ slugProduct: params.slug });
  const [images, setImages] = useState([])

  const carouselRef = useRef(null)

  const [selectedSize, setSelectedSize] = useState("")
  const [sizeStock, setSizeStock] = useState({})
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [productId, setProductId] = useState("");

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    console.log(productQuery.data);

    if (productQuery.data) {
      setProductId(productQuery.data._id);
      setProduct(productQuery.data);
      setImages(productQuery.data.images || []);

      const sizeStockMap = {};
      (productQuery.data.sizeStock || []).forEach((item) => {
        const [size, stock] = item.split("-");
        sizeStockMap[size] = Number(stock);
      });
      setSizeStock(sizeStockMap);
    }
  }, [productQuery.data]);

  const addCart = () => {
    add(productId, quantity, selectedSize);
  }

  const handleChangeQuantity = (e) => {
    setQuantity(e)
  }

  const handlePrev = () => {
    carouselRef.current?.prev()
  }

  const handleNext = () => {
    carouselRef.current?.next()
  }

  return (
    <div
      style={{
        padding: isMobile ? "16px" : "24px",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      <Row gutter={[24, 24]} justify="center">
        {/* Hình ảnh sản phẩm */}
        <Col xs={24} md={12} lg={10}>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: isMobile ? "100%" : 400,
              margin: "0 auto",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Carousel
              ref={carouselRef}
              dotPosition="bottom"
              autoplay={!isMobile}
              autoplaySpeed={3000}
              style={{ width: "100%" }}
            >
              {images.map((url, idx) => (
                <div key={idx}>
                  <Image
                    width="100%"
                    height={isMobile ? 300 : 400}
                    src={url || "/placeholder.svg"}
                    style={{
                      objectFit: "cover",
                      background: "#f5f5f5",
                      borderRadius: 12,
                    }}
                    preview={true}
                    placeholder={
                      <div
                        style={{
                          height: isMobile ? 300 : 400,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f5f5f5",
                        }}
                      >
                        Đang tải...
                      </div>
                    }
                  />
                </div>
              ))}
            </Carousel>

            {/* Navigation arrows - only show on desktop or when there are multiple images */}
            {images.length > 1 && !isMobile && (
              <>
                <LeftOutlined
                  onClick={handlePrev}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 12,
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color: "#fff",
                    background: "rgba(0,0,0,0.5)",
                    padding: 8,
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 2,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.7)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.5)"
                  }}
                />
                <RightOutlined
                  onClick={handleNext}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 12,
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color: "#fff",
                    background: "rgba(0,0,0,0.5)",
                    padding: 8,
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 2,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.7)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.5)"
                  }}
                />
              </>
            )}
          </div>

          {/* Mobile image counter */}
          {isMobile && images.length > 1 && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {images.length} hình ảnh
              </Text>
            </div>
          )}
        </Col>

        {/* Thông tin sản phẩm */}
        <Col xs={24} md={12} lg={14}>
          <div style={{ padding: isMobile ? 0 : "0 24px" }}>
            {/* Product Title */}
            <Title
              level={isMobile ? 2 : 1}
              style={{
                marginBottom: 16,
                fontSize: isMobile ? 24 : 32,
                lineHeight: 1.3,
              }}
            >
              {product.title}
            </Title>

            {/* Category */}
            {product.titleCategory && (
              <div style={{ marginBottom: 20 }}>
                <TagOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                <Text type="secondary">Danh mục: </Text>
                <a href={`/danh-muc?danhmuc=${product.slugCategory}`} style={{ color: "#1890ff", fontWeight: 500 }}>
                  {product.titleCategory}
                </a>
              </div>
            )}

            {/* Price Section */}
            <Card
              style={{
                marginBottom: 24,
                border: "2px solid #ff4d4f",
                borderRadius: 12,
              }}
              bodyStyle={{ padding: isMobile ? 16 : 20 }}
            >
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Text
                    strong
                    style={{
                      fontSize: isMobile ? 20 : 24,
                      color: "#ff4d4f",
                    }}
                  >
                    {Number(product.newPrice).toLocaleString()} VNĐ
                  </Text>
                  {product.discountPercentage > 0 && (
                    <Badge
                      count={`-${product.discountPercentage}%`}
                      style={{
                        backgroundColor: "#ff4d4f",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </div>
                {product.price !== product.newPrice && (
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    Giá gốc:{" "}
                    <Text delete style={{ color: "#999" }}>
                      {Number(product.price).toLocaleString()} VNĐ
                    </Text>
                  </Text>
                )}
              </Space>
            </Card>

            {/* Size Selection */}
            <div style={{ marginBottom: 24 }}>
              <Title level={4} style={{ marginBottom: 12 }}>
                Chọn kích cỡ:
              </Title>
              <Radio.Group
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{ width: "100%" }}
              >
                <Space direction={isMobile ? "vertical" : "horizontal"} wrap>
                  {Object.entries(sizeStock).map(([size, stock]) => (
                    <Radio.Button
                      key={size}
                      value={size}
                      disabled={stock === 0}
                      style={{
                        height: isMobile ? 40 : 36,
                        minWidth: isMobile ? "100%" : 80,
                        textAlign: "center",
                        borderRadius: 8,
                        marginBottom: isMobile ? 8 : 0,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500 }}>{size}</div>
                        <div style={{ fontSize: 12, color: stock > 0 ? "#52c41a" : "#ff4d4f" }}>
                          {stock > 0 ? `Còn ${stock}` : "Hết hàng"}
                        </div>
                      </div>
                    </Radio.Button>
                  ))}
                </Space>
              </Radio.Group>
            </div>

            {/* Quantity Selection */}
            <div style={{ marginBottom: 24 }}>
              <Space align="center" size={16}>
                <Text strong style={{ fontSize: 16 }}>
                  Số lượng:
                </Text>
                {product.stock > 0 ? (
                  <InputNumber
                    min={1}
                    max={sizeStock[selectedSize] || 1}
                    value={quantity}
                    onChange={handleChangeQuantity}
                    style={{
                      width: isMobile ? 100 : 120,
                    }}
                    size="large"
                  />
                ) : (
                  <Tag color="#cd201f" style={{ fontSize: 14, padding: "4px 12px" }}>
                    Hết hàng
                  </Tag>
                )}
              </Space>
              {selectedSize && sizeStock[selectedSize] && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Còn lại {sizeStock[selectedSize]} sản phẩm
                  </Text>
                </div>
              )}
            </div>

            <Divider />

            {/* Action Buttons */}
            {product.stock > 0 ? (
              <Space direction={isMobile ? "vertical" : "horizontal"} size={12} style={{ width: "100%" }}>
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={addCart}
                  style={{
                    height: 48,
                    width: isMobile ? "100%" : 200,
                    borderRadius: 8,
                    fontWeight: 500,
                  }}
                >
                  THÊM VÀO GIỎ
                </Button>
              </Space>
            ) : (
              <Button
                size="large"
                disabled
                style={{
                  height: 48,
                  width: "100%",
                  borderRadius: 8,
                }}
              >
                HẾT HÀNG
              </Button>
            )}
          </div>
        </Col>
      </Row>
      {/* Product Info */}
      <Card title="Mô tả sản phẩm" style={{ marginTop: 24, marginBottom: 24 }}>
        {parse(product.description || "<p></p>")}
      </Card>

      {product.slugCategory && (
        <>
          {/* Related Products */}
          < ProductsRelated slug={product.slugCategory} />
        </>
      )}
      {productId && (
        <>
          {/* Reviews Products */}
          <ReviewProduct productId={productId} />
        </>
      )}
    </div>
  )
}

export default DetailProduct
