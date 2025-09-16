import { useQuery } from "@tanstack/react-query";

import { detailProductGet, productsCategoryGet } from "../../services/client/productServies";
import { listCategoriesGet } from "../../services/client/categoriesServies";

function useProducts({ slug, sortKey, sortType, priceRange, slugProduct } = {}) {

  // GET products
  const productsQuery = useQuery({
    queryKey: ["products", slug, sortKey, sortType, priceRange],
    queryFn: () =>
      productsCategoryGet(slug, sortKey, sortType, priceRange).then(res => res.products),
    enabled: !!slug, // chỉ chạy khi slug có giá trị
    keepPreviousData: true
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategoriesGet().then(res => res.data),
  });

  const productQuery = useQuery({
    queryKey: ["product", slugProduct],
    queryFn: () => detailProductGet(slugProduct).then(res => res.data),
    enabled: !!slugProduct, // chỉ chạy query khi có slugProduct
  });

  return { productsQuery, categoriesQuery, productQuery };
}

export default useProducts;