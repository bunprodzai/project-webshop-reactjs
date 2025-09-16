import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListProduct from "../../../components/ListProduct";
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
        setProducts(response.data);
      } catch (error) {
        
      }
    }

    fetchApi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[keyword]);
  
  return (
    <>
      <ListProduct products={products} title={`Kết quả tìm kiếm: ${keyword}`}/>
    </>
  )

}

export default Search;
