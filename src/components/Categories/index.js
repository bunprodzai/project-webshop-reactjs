import { useState, useEffect } from "react"
import { Typography, Card, Tabs, Breadcrumb } from "antd"
import { NavLink, useSearchParams } from "react-router-dom"
import ListProduct from "../ListProduct";
import useProducts from "../../hooks/client/useProducts";

const { Title, Text } = Typography
const { TabPane } = Tabs

function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slugParam = searchParams.get('danhmuc');

  // sort 
  const [sortKey, setSortKey] = useState("");
  const [sortType, setSortType] = useState("asc");
  const [priceRange, setPriceRange] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(1);

  const { productsQuery, categoriesQuery } = useProducts({ slug: slugParam, sortKey, sortType, priceRange });
  console.log(slugParam);
  
  // Filter products based on selected category and subcategories
  useEffect(() => {
    if (!categoriesQuery.data || !slugParam) return;

    const categoryCurrent = categoriesQuery.data.find(
      (cat) => cat.slug === slugParam
    );

    if (categoryCurrent) {
      if (selectedCategory !== categoryCurrent._id.toString()) {
        setSelectedCategory(categoryCurrent._id.toString());
      }
    } else {
      console.warn("Không tìm thấy category với slug:", slugParam);
    }

  }, [categoriesQuery.data, slugParam, selectedCategory]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    const category = categoriesQuery.data.find((cat) => cat._id.toString() === categoryId);
    if (category) {
      setSortKey("");
      setSortType("asc");
      setPriceRange("");
      setSearchParams({ danhmuc: category.slug });
    }
    setSelectedCategory(categoryId);
  }

  const handleFilterChange = (changedFilter) => {
    if (changedFilter.sort) {
      const [type, key] = changedFilter.sort.split('-').map(String);
      setSortKey(key);
      setSortType(type);
    } else if (changedFilter.priceRange) {
      setPriceRange(changedFilter.priceRange);
    }
  };

  return (
    <>
      {/* <ListProduct products={products} title={`Danh mục: ${title}`}/> */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Categories</Breadcrumb.Item>
          {categoriesQuery.data > 0 && (
            <Breadcrumb.Item>{categoriesQuery.data.find((c) => c._id === selectedCategory)?.title}</Breadcrumb.Item>
          )}
        </Breadcrumb>

        {/* Page Title */}
        <Title level={2} style={{ marginBottom: "24px" }}>
          Shop by Category
        </Title>

        {/* Categories Box */}
        <Card style={{ marginBottom: "24px" }}>
          <Tabs
            activeKey={selectedCategory.toString()}
            onChange={(key) => handleCategoryChange(key)}
            tabPosition="top"
          >
            <Text strong>Subcategories:</Text>

            {Array.isArray(categoriesQuery.data) &&
              categoriesQuery.data.map((category) => (
                <TabPane
                  tab={<span>{category.title}</span>}
                  key={category._id.toString()}
                >
                  <div style={{ padding: "0" }} className="products_category">
                    <ListProduct
                      products={productsQuery.data || []}
                      filter={true}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </TabPane>
              ))}

          </Tabs>
        </Card>

      </div>
    </>
  )
}

export default Categories;