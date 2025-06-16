import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { detailProductGet } from "../../../services/client/productServies";
import { Row, Col, Image, Typography, Button, InputNumber, message, Tag, Carousel } from "antd";
import { addCartPatch } from "../../../services/client/cartServies";
import { updateCartLength } from "../../../actions/cart";
import { useDispatch } from "react-redux";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

function DetailProduct() {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await detailProductGet(params.slug);
        if (response.code === 200) {
          setProduct(response.record);
          setImages(response.record.images || []);
        } else {
        }
      } catch (error) {
        console.log(error.message);

      }
    }
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCart = () => {
    const productId = product._id;

    const fetchApiAddCart = async () => {
      try {
        const resAddToCart = await addCartPatch(productId, { quantity: quantity, cartId: localStorage.getItem("cartId") });

        if (resAddToCart.code === 200) {
          const newLength = resAddToCart.totalQuantityProduts; // Lấy số lượng sản phẩm mới từ API
          dispatch(updateCartLength(newLength)); // Cập nhật lengthCart trong Redux
          message.success("Thêm vào giỏ hàng thành công!");
        } else {
          message.error("Thêm vào giỏ hàng thất bại");
        }
      } catch (error) {

      }
    }
    fetchApiAddCart();
  }

  const handleChangeQuantity = (e) => {
    setQuantity(e);
  }

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  return (
    <>
      <Row style={{ padding: "20px", backgroundColor: "#fff" }}>
        {/* Hình ảnh sản phẩm */}
        <Col span={12} style={{ textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              width: 300,
              height: 400,
              margin: "0 auto",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {/* Carousel */}
            <Carousel
              ref={carouselRef}
              dotPosition="bottom"
              style={{ width: "100%", height: "100%" }}
            >
              {images.map((url, idx) => (
                <Image
                  key={idx}
                  width="100%"
                  height={400}
                  src={url}
                  style={{ objectFit: "contain", background: "#f5f5f5" }}
                  preview={true}
                />
              ))}
            </Carousel>

            {/* Nút trái */}
            <LeftOutlined
              onClick={handlePrev}
              style={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                fontSize: 24,
                color: "#ddd",
                background: "rgba(0,0,0,0.3)",
                padding: 8,
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 1,
              }}
            />

            {/* Nút phải */}
            <RightOutlined
              onClick={handleNext}
              style={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                fontSize: 24,
                color: "#ddd",
                background: "rgba(0,0,0,0.3)",
                padding: 8,
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 1,
              }}
            />
          </div>
        </Col>
        {/* <Col span={12} style={{ textAlign: "center" }}>
          <Image
            width={300}
            height={400}
            src={product.thumbnail}
            style={{ objectFit: "contain" }}
          />
        </Col> */}

        {/* Thông tin sản phẩm */}
        <Col span={12}>
          <Title level={3}>{product.title}</Title>
          <Text type="secondary">Danh mục: {product.titleCategory ?
            <a href={`/danh-muc?danhmuc=${product.slugCategory}`} >{product.titleCategory}</a> : ""}</Text>

          {/* Giá sản phẩm */}
          <div style={{ marginTop: "20px" }}>
            <Text strong style={{ fontSize: "18px", color: "#ff4d4f" }}>
              Giá: {product.newPrice},000 ₫
            </Text>
            <br />
            <Text>Giá gốc: <strike>{product.price},000 ₫</strike></Text>
          </div>

          {/* Chức năng */}
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text strong style={{ marginRight: "10px", marginBottom: "5px" }}>
                Số lượng còn lại: {product.stock}
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Text strong style={{ marginRight: "10px" }}>
                Số lượng:
              </Text>
              {product.stock > 0 ?
                <InputNumber min={1} max={product.stock} defaultValue={quantity} onChange={handleChangeQuantity} />
                :
                <Tag color="#cd201f">
                  Hết hàng
                </Tag>
              }
            </div>
            {product.stock > 0 ?
              <>
                <Button
                  type="primary"
                  style={{ marginTop: "10px", width: "100%", backgroundColor: "#ffcd39", color: "#000" }}
                >
                  MUA HÀNG NGAY
                </Button>
                <Button
                  type="default"
                  style={{ marginTop: "10px", width: "100%" }}
                  onClick={addCart}
                >
                  THÊM VÀO GIỎ HÀNG
                </Button>
              </>
              :
              ""
            }
          </div>
        </Col>
      </Row>
    </>
  );
}

export default DetailProduct;