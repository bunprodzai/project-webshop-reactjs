import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productsCategoryGet } from "../../services/client/productServies";
import SlideProducts from "../SlideProducts";


function ProductsCategory() {
  const params = useParams();

  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await productsCategoryGet(params.slug);
        setTitle(response.category.title);
        setProducts(response.productsCategory);
      } catch (error) {

      }
    }

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(products);
  
  return (
    <>
      <SlideProducts products={products} title={`Danh mục: ${title}`}/>
    </>
  )
}

export default ProductsCategory;