import "./SlideProducts.scss"
import { Typography, Row, Col, Select, Button, Slider, Checkbox, Radio, Divider, Card } from "antd"
import ProductCard from "./../../components/Product-card"
import { Option } from "antd/es/mentions"
import { useMemo, useState } from "react"
import { FilterOutlined, ClearOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

function ListProduct(props) {
  const { products = [], title, onFilterChange, filter } = props
  const [visibleCount, setVisibleCount] = useState(8)
  const [isLoading, setIsLoading] = useState(false)

  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortBy, setSortBy] = useState("asc-default")

  const handleChange = (value, key) => {
    if (onFilterChange) {
      onFilterChange({ [key]: value })
    }
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8)
      setIsLoading(false)
    }, 500)
  }

  const handlePriceChange = (value) => {
    setPriceRange(value)
    handleChange(value, "priceRange")
  }

  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues)
    handleChange(checkedValues, "brands")
  }

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value)
    handleChange(e.target.value, "gender")
  }

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues)
    handleChange(checkedValues, "categories")
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    handleChange(value, "sort")
  }

  const clearAllFilters = () => {
    setPriceRange([0, 5000000])
    setSelectedBrands([])
    setSelectedGender("")
    setSelectedCategories([])
    setSortBy("asc-default")
    if (onFilterChange) {
      onFilterChange({})
    }
  }

  const visibleProducts = useMemo(() => {
    return Array.isArray(products) ? products.slice(0, visibleCount) : []
  }, [products, visibleCount])

  const hasMoreProducts = visibleCount < products.length

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-2">
            {title}
          </Title>
          <Text className="text-lg text-gray-600">Khám phá bộ sưu tập sản phẩm chất lượng cao</Text>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          {filter && (
            <div className=" flex-shrink-0">
              <Card className="sticky top-4 shadow-lg border-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FilterOutlined className="text-blue-600" />
                    <Title level={4} className="mb-0 text-gray-800">
                      Bộ lọc
                    </Title>
                  </div>
                  <Button
                    type="text"
                    icon={<ClearOutlined />}
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-red-500"
                  >
                    Xóa tất cả
                  </Button>
                </div>

                {/* Price Range Slider */}
                <div className="mb-6">
                  <Text className="block mb-3 font-semibold text-gray-700">Khoảng giá</Text>
                  <Slider
                    range
                    min={0}
                    max={5000000}
                    step={100000}
                    value={priceRange}
                    onChange={handlePriceChange}
                    tooltip={{
                      formatter: (value) => `${value?.toLocaleString()}₫`,
                    }}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{priceRange[0]?.toLocaleString()}₫</span>
                    <span>{priceRange[1]?.toLocaleString()}₫</span>
                  </div>
                </div>

                <Divider />

                {/* Sort By */}
                <div className="mb-6">
                  <Text className="block mb-3 font-semibold text-gray-700">Sắp xếp theo</Text>
                  <Select
                    placeholder="Chọn cách sắp xếp"
                    className="w-full"
                    size="large"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <Option value="asc-default">Mặc định</Option>
                    <Option value="asc-price">Giá tăng dần</Option>
                    <Option value="desc-price">Giá giảm dần</Option>
                    {/* <Option value="newest">Mới nhất</Option>
                    <Option value="popular">Phổ biến nhất</Option> */}
                  </Select>
                </div>

                <Divider />

                {/* Gender Filter */}
                <div className="mb-6">
                  <Text className="block mb-3 font-semibold text-gray-700">Giới tính</Text>
                  <Radio.Group value={selectedGender} onChange={handleGenderChange} className="w-full">
                    <div className="space-y-2">
                      <Radio value="">Tất cả</Radio>
                      <Radio value="male">Nam</Radio>
                      <Radio value="female">Nữ</Radio>
                      <Radio value="unisex">Unisex</Radio>
                    </div>
                  </Radio.Group>
                </div>

                <Divider />

                {/* Brand Filter */}
                <div className="mb-6">
                  <Text className="block mb-3 font-semibold text-gray-700">Thương hiệu</Text>
                  <Checkbox.Group value={selectedBrands} onChange={handleBrandChange} className="w-full">
                    <div className="space-y-2">
                      <Checkbox value="nike">Nike</Checkbox>
                      <Checkbox value="adidas">Adidas</Checkbox>
                      <Checkbox value="puma">Puma</Checkbox>
                      <Checkbox value="converse">Converse</Checkbox>
                      <Checkbox value="vans">Vans</Checkbox>
                      <Checkbox value="newbalance">New Balance</Checkbox>
                    </div>
                  </Checkbox.Group>
                </div>

                <Divider />

                {/* Category Filter */}
                <div className="mb-6">
                  <Text className="block mb-3 font-semibold text-gray-700">Danh mục</Text>
                  <Checkbox.Group value={selectedCategories} onChange={handleCategoryChange} className="w-full">
                    <div className="space-y-2">
                      <Checkbox value="sneakers">Giày thể thao</Checkbox>
                      <Checkbox value="running">Giày chạy bộ</Checkbox>
                      <Checkbox value="casual">Giày thường</Checkbox>
                      <Checkbox value="formal">Giày công sở</Checkbox>
                      <Checkbox value="boots">Boots</Checkbox>
                      <Checkbox value="sandals">Dép/Sandal</Checkbox>
                    </div>
                  </Checkbox.Group>
                </div>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Grid */}
            {visibleProducts.length > 0 ? (
              <>
                <Row gutter={[16, 16]} className="mb-8">
                  {filter ? (
                    <>
                      {visibleProducts.map((product, index) => (
                        <Col key={product._id || index} xs={24} sm={12} lg={8} xl={8}>
                          <ProductCard product={product} />
                        </Col>
                      ))}
                    </>
                  ) : (
                    <>
                      {visibleProducts.map((product, index) => (
                        <Col key={product._id || index} xs={24} sm={12} lg={8} xl={6}>
                          <ProductCard product={product} />
                        </Col>
                      ))}
                    </>
                  )}
                </Row>

                {/* Load More Button */}
                {hasMoreProducts && (
                  <div className="text-center mb-8">
                    <Button
                      type="primary"
                      size="small"
                      loading={isLoading}
                      onClick={handleLoadMore}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 px-8 py-2 h-auto text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoading ? "Đang tải..." : `Xem thêm`}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm mb-8">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.208-2.18C3.926 11.46 3 9.81 3 8c0-3.866 3.582-7 8-7s8 3.134 8 7c0 1.81-.926 3.46-2.792 4.82A7.962 7.962 0 0112 15z"
                    />
                  </svg>
                </div>
                <Title level={3} className="text-gray-400 mb-4">
                  Không tìm thấy sản phẩm
                </Title>
              </div>
            )}
          </div>
        </div>
      </div>

      <style >{`
        .ant-slider-rail {
          background-color: #f1f5f9;
        }
        
        .ant-slider-track {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
        
        .ant-slider-handle {
          border-color: #3b82f6;
        }
        
        .ant-slider-handle:hover {
          border-color: #2563eb;
        }
        
        .ant-checkbox-wrapper {
          display: flex;
          align-items: center;
          padding: 4px 0;
        }
        
        .ant-radio-wrapper {
          display: flex;
          align-items: center;
          padding: 4px 0;
        }
        
        .ant-card {
          border-radius: 12px;
        }
        
        .ant-divider {
          margin: 16px 0;
        }
        
        .product-card:hover {
          transform: translateY(-4px);
          transition: all 0.3s ease;
        }

        @media (max-width: 1024px) {
          .sticky {
            position: relative !important;
            top: auto !important;
          }
        }
      `}</style>
    </section>
  )
}

export default ListProduct
