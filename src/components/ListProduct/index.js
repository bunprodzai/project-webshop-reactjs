import "./SlideProducts.scss";
import { Typography, Row, Col, Select } from "antd"
import ProductCard from "../Product-card"
import { Option } from "antd/es/mentions";

const { Title } = Typography

function ListProduct(props) {
  const { products, title, onFilterChange, filter } = props;

  const handleChange = (value, key) => {
    onFilterChange({ [key]: value });
  };

  return (
    <>
      <section>
        <div style={{ maxWidth: "1200px", padding: "10px 16px" }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Title level={1}>{title}</Title>
          </div>
          {/* filter  */}
          {filter && (
            <div class="filter_product">
              <Row gutter={16} align="middle" wrap={false}>
                <Col>
                  <Select
                    placeholder="Giá tiền"
                    style={{ width: 150 }}
                    onChange={(value) => handleChange(value, 'priceRange')}
                  >
                    <Option value="0-50">Dưới 50$</Option>
                    <Option value="50-100">50$ - 100$</Option>
                    <Option value="100-">Trên 100$</Option>
                    <Option value="0-0">Mặc định</Option>
                  </Select>
                </Col>

                <Col>
                  <Select
                    placeholder="Sắp xếp theo"
                    style={{ width: 150 }}
                    onChange={(value) => handleChange(value, 'sort')}
                  >
                    <Option value="asc-price">Giá tăng dần</Option>
                    <Option value="desc-price">Giá giảm dần</Option>
                    <Option value="asc-default">Mặc định</Option>
                    {/* <Option value="newest">Mới nhất</Option> */}
                  </Select>
                </Col>

                <Col>
                  <Select
                    placeholder="Thương hiệu"
                    style={{ width: 150 }}
                    onChange={(value) => handleChange(value, 'brand')}
                  >
                    <Option value="nike">Nike</Option>
                    <Option value="adidas">Adidas</Option>
                    <Option value="puma">Puma</Option>
                  </Select>
                </Col>

                <Col>
                  <Select
                    placeholder="Giới tính"
                    style={{ width: 150 }}
                    onChange={(value) => handleChange(value, 'gender')}
                  >
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="unisex">Unisex</Option>
                  </Select>
                </Col>
              </Row>
            </div>
          )}

          {products.length > 0 ?
            <Row gutter={[24, 24]}>
              {products.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6}>
                  <ProductCard
                    product={product}
                  />
                </Col>
              ))}
            </Row>
            :
            <>
              <h3 style={{ textAlign: "center", margin: "20px 0" }}>Không tìm thấy sản phẩm</h3>
            </>
          }
        </div>
      </section>
    </>
  )
}

export default ListProduct;