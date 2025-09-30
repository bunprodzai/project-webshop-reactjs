import { useState } from "react";
import { productsFavorite } from "../../../services/client/productServies";
import { useEffect } from "react";
import { getCookie } from "../../../helpers/cookie";


export default function FavoriteProducts() {

  const [products, setProducts] = useState([]);

  const tokenUser = getCookie("tokenUser");

  const fetchApi = async () => {
    try {
      console.log("Token user:", tokenUser);

      const response = await productsFavorite(tokenUser);
      console.log("API response:", response);
    } catch (error) {
      console.error("Fetch API error:", error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <>
      sadw
    </>
  )
}