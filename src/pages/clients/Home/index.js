import { useEffect, useState } from "react";
import { listHomeGet } from "../../../services/client/homeServies";
import SlideProducts from "../../../components/SlideProducts";

function Home() {
  const [productFeatured, setProductFeatured] = useState([]);

  const fetchApi = async () => {
    try {
      const response = await listHomeGet();
      if (response.code === 200) {
        setProductFeatured(response.newFeaturedProducts);
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);


  return (
    <>
      <SlideProducts products={productFeatured} title={`Sản phẩm nổi bật`} />
    </>
  );
}

export default Home;
