import "./LayoutDefault.scss";
import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import FooterClient from "./FooterClient";
import HeaderClient from "./HeaderClient";
import { Outlet } from "react-router-dom";
import { CartProvider } from "../../components/CartProvider";
// import ChatBotAi from "../../components/chatBotAi";

function LayoutDefault() {

  return (
    <>
      <CartProvider>
        <Layout style={{ minHeight: '100vh', backgroundColor: "#ffffff" }}>
          <HeaderClient />
          <Content className="container" style={{
            flex: 1,
            padding: "20px", // Khoảng cách với các cạnh
            boxSizing: "border-box", // Đảm bảo padding không ảnh hưởng chiều rộng
          }}>
            <Outlet />
          </Content>
          <FooterClient />
        </Layout>
      </CartProvider>
      // <ChatBotAi />
    </>
  )
}

export default LayoutDefault;
