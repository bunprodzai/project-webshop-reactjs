import { useState } from "react"
import { NavLink } from 'react-router-dom';
import { Card, Typography, Rate, Button, Badge, message } from "antd"
import { HeartFilled, HeartOutlined } from "@ant-design/icons"
import { useEffect } from "react";
import { addFavorite, getFavorites, removeFavorite } from "../../helpers/favorites";
import { getCookie } from "../../helpers/cookie";
import { productFavorite } from "../../services/client/productServies";

const { Meta } = Card
const { Text } = Typography

export default function ProductCard({ product }) {

  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(getFavorites().includes(product._id));
  }, [product._id])

  const discountedPrice = product.discountPercentage ? product.price * (1 - product.discountPercentage / 100) : product.price


  const handleToggleFavorite = async () => {
    const tokenUser = getCookie("tokenUser")
    try {
      if (tokenUser) {
        // nếu user đã login -> call API
        const typeFavorite = isFavorite ? "unfavorite" : "favorite";
        const res = await productFavorite(typeFavorite, product._id, tokenUser);
        if (res.code === 200) {
          setIsFavorite(!isFavorite);
          addFavorite(product._id);
          message.success(res.message)
        } else if (res.code === 201) {
          setIsFavorite(!isFavorite);
          removeFavorite(product._id);
          message.success(res.message)
        } else {
          message.error(res.message);
        }
      } else {
        message.error("Vui lòng đăng nhập để thêm sản phẩm yêu thích")
      }
    } catch (err) {
      message.error(err);
    }
  };

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
                  icon={
                    isFavorite ? (
                      <HeartFilled style={{ color: "red" }} />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  size="middle"
                  className="bg-white"
                  onClick={handleToggleFavorite}
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
