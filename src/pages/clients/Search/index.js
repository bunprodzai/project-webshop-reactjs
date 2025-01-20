import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SlideProducts from "../../../components/SlideProducts";
import { productsSearchGet } from "../../../services/client/productServies";


function Search() {

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await productsSearchGet(keyword);
        setProducts(response.records);
      } catch (error) {
        
      }
    }

    fetchApi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  return (
    <>
      <SlideProducts products={products} title={`Kết quả tìm kiếm: ${keyword}`}/>
    </>
  )

}

export default Search;
