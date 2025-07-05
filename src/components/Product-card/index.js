import { useState } from "react"
import { NavLink } from 'react-router-dom';
import { Card, Typography, Rate, Button, Badge } from "antd"
import { HeartOutlined, HeartFilled } from "@ant-design/icons"

const { Meta } = Card
const { Text } = Typography

export default function ProductCard({ product }) {

  // const dispatch = useDispatch();

  const [isWishlisted, setIsWishlisted] = useState(false)

  const discountedPrice = product.discountPercentage ? product.price * (1 - product.discountPercentage / 100) : product.price

  // const addCart = () => {
  //     const productId = product._id;

  //     const fetchApiAddCart = async () => {
  //       try {
  //         const resAddToCart = await addCartPatch(productId, { quantity: 1, cartId: localStorage.getItem("cartId") });
  //         if (resAddToCart.code === 200) {
  //           console.log(resAddToCart);

  //           const newLength = resAddToCart.totalQuantityProduts; // Lấy số lượng sản phẩm mới từ API
  //           dispatch(updateCartLength(newLength)); // Cập nhật lengthCart trong Redux
  //           message.success("Thêm vào giỏ hàng thành công!");
  //         } else {
  //           message.error("Thêm vào giỏ hàng thất bại");
  //         }
  //       } catch (error) {

  //       }
  //     }
  //     fetchApiAddCart();
  //   }

  // const actions = [
  //   <Button key="add-to-cart" onClick={addCart} type="primary" icon={<ShoppingCartOutlined />} block>
  //     Add to Cart
  //   </Button>,
  // ]

  return (
    <Badge.Ribbon text={`${product.discountPercentage}% OFF`} color="red" style={{ display: product.discountPercentage ? "block" : "none" }}>
      <Card
        hoverable
        cover={
          <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
            <img
              alt={product.title}
              src={product.thumbnail || "/placeholder.svg"}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
            <Button
              type="text"
              icon={isWishlisted ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
              style={{
                position: "absolute",
                top: 150,
                right: 8,
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50%",
              }}
              onClick={() => setIsWishlisted(!isWishlisted)}
            />
          </div>
        }
      // actions={actions}
      >
        <div style={{ marginBottom: "8px" }}>
          <Rate disabled defaultValue={5} style={{ fontSize: "14px" }} />
          <Text type="secondary" style={{ marginLeft: "8px", fontSize: "12px" }}>
            ({120})
          </Text>
        </div>
        <Meta
          title={<NavLink to={`/detail/${product.slug}`} >{product.title}</NavLink>}
          description={
            <div style={{ marginTop: "8px" }}>
              {product.discountPercentage ? (
                <div>
                  <Text strong style={{ fontSize: "16px" }}>
                    {discountedPrice.toLocaleString()} VNĐ
                  </Text>
                  <Text delete type="secondary" style={{ marginLeft: "8px" }}>
                    ${product.price.toLocaleString()} VNĐ
                  </Text>
                </div>
              ) : (
                <Text strong style={{ fontSize: "16px" }}>
                  ${product.price.toLocaleString()} VNĐ
                </Text>
              )}
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  )
}
