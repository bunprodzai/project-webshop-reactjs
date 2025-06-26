import { productsCategoryGet } from "../../services/client/productServies";
import { useState, useEffect } from "react"
import { Typography, Card, Tabs, Breadcrumb } from "antd"
import { NavLink, useSearchParams } from "react-router-dom"
import { listCategoriesGet } from "../../services/client/categoriesServies";
import ListProduct from "../ListProduct";

const { Title, Text } = Typography
const { TabPane } = Tabs

function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // sort 
  const [sortKey, setSortKey] = useState("");
  const [sortType, setSortType] = useState("asc");

  const [priceRange, setPriceRange] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(1);

  const slugParam = searchParams.get('danhmuc');

  const fetchApiProducts = async (slug, sortKey, sortType, priceRange) => {
    try {
      const response = await productsCategoryGet(slug, sortKey, sortType, priceRange);
      setProducts(response.products);
    } catch (error) {

    }
  }

  // Filter products based on selected category and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await listCategoriesGet();
        // setCategories(response.productsCategory);
        // console.log(response);
        const list = Array.isArray(response?.productsCategory)
          ? response.productsCategory
          : [];

        setCategories(list);

        if (!slugParam || response.productsCategory.length === 0) return;

        const category = response.productsCategory.find(cat => cat.slug === slugParam);

        if (category) {
          fetchApiProducts(slugParam, sortKey, sortType, priceRange);
          // setSelectedCategory(category._id.toString());
          if (selectedCategory !== category._id.toString()) {
            setSelectedCategory(category._id.toString());
          }
        } else {
          console.warn('Không tìm thấy category với slug:', slugParam);
        }

      } catch (error) {

      }
    }

    fetchCategories();

  }, [sortKey, sortType, priceRange, searchParams, slugParam, selectedCategory])


  // Handle category change
  const handleCategoryChange = (categoryId) => {
    const category = categories.find((cat) => cat._id.toString() === categoryId);
    if (category) {
      setSortKey("");
      setSortType("asc"); 
      setPriceRange("");
      
      fetchApiProducts(category.slug, sortKey, sortType, priceRange);
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
          {categories.length > 0 && (
            <Breadcrumb.Item>{categories.find((c) => c._id === selectedCategory)?.title}</Breadcrumb.Item>
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
            {/* {categories?.map((category) => (
              <TabPane
                tab={
                  <span>
                    {category.title}
                  </span>
                }
                // key = categoryId
                key={category._id.toString()}
              >
                {products.length > 0 && (
                  <div style={{ padding: "0" }} className="products_category">
                    <ListProduct products={products} filter={true} onFilterChange={handleFilterChange} />
                  </div>
                )}
              </TabPane>
            ))} */}

            {Array.isArray(categories) &&
              categories.map((category) => (
                <TabPane
                  tab={<span>{category.title}</span>}
                  key={category._id.toString()}
                >
                  <div style={{ padding: "0" }} className="products_category">
                    <ListProduct
                      products={products}
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