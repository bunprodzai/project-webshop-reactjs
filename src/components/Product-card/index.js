import { useState } from "react"
import { NavLink } from 'react-router-dom';
import { Card, Typography, Rate, Button, Badge } from "antd"
import { HeartOutlined } from "@ant-design/icons"

const { Meta } = Card
const { Text } = Typography
// const dispatch = useDispatch();
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
export default function ProductCard({ product }) {

  const discountedPrice = product.discountPercentage ? product.price * (1 - product.discountPercentage / 100) : product.price

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Badge.Ribbon text={`${product.discountPercentage}% OFF`} color="red" style={{ display: product.discountPercentage ? "block" : "none" }}>
      <Card
        hoverable
        className="product-card h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        cover={
          <div className="relative overflow-hidden h-64">
            <img
              alt={product.title}
              src={product.thumbnail || "https://via.placeholder.com/300x300?text=Product"}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            {product.discount && (
              <Badge.Ribbon text={`-${product.discount}%`} color="red" className="absolute top-0 right-0" />
            )}
            <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex space-x-2">
                <Button
                  type="default"
                  icon={<HeartOutlined />}
                  size="small"
                  className="bg-white"
                />
              </div>
            </div>
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
                    {discountedPrice.toLocaleString()} đ
                  </Text>
                  <Text delete type="secondary" style={{ marginLeft: "8px" }}>
                    ${product.price.toLocaleString()} đ
                  </Text>
                </div>
              ) : (
                <Text strong style={{ fontSize: "16px" }}>
                  {product.price.toLocaleString()} đ
                </Text>
              )}
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  )
}
