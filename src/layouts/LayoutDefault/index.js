import "./LayoutDefault.scss";
import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import FooterClient from "./FooterClient";
import HeaderClient from "./HeaderClient";
import { Outlet } from "react-router-dom";
import { CartProvider } from "../../components/CartProvider";

function LayoutDefault() {

  return (
    <>
      <CartProvider>
        <Layout>
          <HeaderClient />
          <Layout>
            <Content className="container" style={{
              height: "100vh",
              padding: "20px", // Khoảng cách với các cạnh
              boxSizing: "border-box", // Đảm bảo padding không ảnh hưởng chiều rộng
            }}>
              <Outlet />
            </Content>
          </Layout>
          <FooterClient />
        </Layout>
      </CartProvider>
    </>
  )
}

export default LayoutDefault;