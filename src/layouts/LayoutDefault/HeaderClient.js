import { NavLink, useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import { useDispatch, useSelector } from "react-redux";
import LoginUser from "../../pages/clients/LoginUser";
import { useEffect, useRef, useState } from "react";
import { settingGeneralGet } from "../../services/client/settingServies";
import { findCartGet } from "../../services/client/cartServies";
import { updateCartLength } from "../../actions/cart";
import Register from "../../pages/clients/Register";

import { ShoppingCartOutlined, SearchOutlined, HeartOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons"
import { Layout, Button, Input, Badge, Space, Form, Row, Col } from "antd"

const { Header } = Layout

function HeaderClient() {
  // Khi islogin thay đổi thì sẽ render lại component này
  // eslint-disable-next-line no-unused-vars
  const isLogin = useSelector(state => state.loginUserReducers);

  const tokenUser = getCookie("tokenUser");
  // const avatar = getCookie("avatar");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const componentRef = useRef(null);

  // Xử lý hiển thị số lượng sản phẩm trong giỏ hàng.
  const dispatch = useDispatch();
  const lengthCart = useSelector((state) => state.cartReducer.lengthCart);


  // Phần hiển thị thông tin trang web
  const [setting, setSetting] = useState([]);

  useEffect(() => {
    const fetchApiSetting = async () => {
      try {
        // Lấy thông tin web
        const response = await settingGeneralGet();
        console.log(response);
        
        setSetting(response.settings);
        // Xử lý giỏ hàng
        const cartId = localStorage.getItem("cartId");
        const resCart = await findCartGet(cartId);
        if (resCart.code === 200) {
          // Update số lượng sp giỏ hàng
          dispatch(updateCartLength(resCart.recordsCart.totalQuantityProduts));
        }
      } catch (error) {
      }
    };

    fetchApiSetting();

    // const fetchApiCategories = async () => {
    //   try {
    //     // Lấy thông tin web
    //     const response = await listCategoriesGet();
    //     const tree = createTree(response.productsCategory);
    //     setMenu([
    //       {
    //         title: "TRANG CHỦ",
    //         url: "/"
    //       },
    //       {
    //         title: "DANH MỤC",
    //         url: "danh-muc",
    //         children: tree,
    //       },
    //       {
    //         title: "GIỚI THIỆU",
    //         url: "#"
    //       },
    //       // {
    //       //   title: "TƯ VẤN CHỌN",
    //       //   url: "#"
    //       // },
    //       // {
    //       //   title: "TẠP CHÍ NƯỚC HOA",
    //       //   url: "https://www.facebook.com/bunsdzpo"
    //       // },
    //       // {
    //       //   title: "LIÊN HỆ",
    //       //   url: "https://www.facebook.com/bunsdzpr"
    //       // }
    //     ]);

    //   } catch (error) {
    //   }
    // };

    // fetchApiCategories();  

    // Gắn sự kiện click trên document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Hủy gắn sự kiện khi component bị unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Xử lý click ngoài để ẩn menu
  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  const handleReload = () => {

  }

  // tim kiem
  const onFinish = (e) => {
    navigate(`/search?keyword=${e.keyword || ""}`);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          background: "white",
          padding: "0 50px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* <Button
              type="text"
              icon={<MenuOutlined />}
              style={{ display: "block", marginRight: "16px" }}
              className="md:hidden"
            /> */}
            <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* <Image src={setting.logo}
                preview={false}
                style={{
                  maxHeight: "50px"
                }} /> */}
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>{setting.websiteName}</span>
            </NavLink>
            <div className="hidden md:flex">
              <Row>
                <Col>
                </Col>
              </Row>
              <Space size={24}>
                <NavLink to="/" style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
                  Home
                </NavLink>
                <NavLink to="#" style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
                  Products
                </NavLink>
                <NavLink to="/danh-muc" style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
                  Categories
                </NavLink>
                <NavLink to="/" style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
                  Deals
                </NavLink>
                <NavLink to="/" style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
                  About
                </NavLink>
              </Space>
            </div>
          </div>

          <div className="layout-default__search hidden md:block" style={{ maxWidth: "350px", width: "100%", marginTop: "12px" }}>
            <Form onFinish={onFinish} layout="vertical">
              <Row gutter={[12, 12]}>
                <Col span={22}>
                  <Form.Item name="keyword" >
                    <Input
                      allowClear
                      type="text"
                      placeholder='Search products...'
                      prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item name='btnSearch'>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} ></Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="layout-default__accounts">
            <Badge count={lengthCart} size="small">
              <a href="/order/cart">
                <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: "20px" }} />} />
              </a>
            </Badge>
            <Button type="text" icon={<HeartOutlined style={{ fontSize: "20px" }} />} />
            {tokenUser ? (
              <>
                <Button type="text" onClick={toggleMenu} className="avatar" icon={<UserOutlined style={{ fontSize: "20px" }} />} />
                {/* <Avatar src={avatar} size="large" className="avatar" icon={<UserOutlined />} onClick={toggleMenu} /> */}
                {isMenuOpen && (
                  <ul className="menu" ref={componentRef}>
                    <NavLink to="/info-user">
                      <li className="fullName">
                        Xin chào!, {getCookie("fullName") ? getCookie("fullName") : ""}
                      </li>
                    </NavLink>
                    <NavLink to="/order/history">
                      <li>
                        Đơn hàng của bạn
                      </li>
                    </NavLink>
                    <NavLink to="/logout">
                      <li>
                        <LogoutOutlined /> Logout
                      </li>
                    </NavLink>

                  </ul>
                )}
              </>
            ) : (
              <>
                <LoginUser onReload={handleReload} onMenuOpen={() => setIsMenuOpen(false)} />
                <Register onReload={handleReload} page="header" onMenuOpen={() => setIsMenuOpen(false)} />
              </>
            )}
          </div>
        </div>
      </Header>
    </>
  )
}

export default HeaderClient;