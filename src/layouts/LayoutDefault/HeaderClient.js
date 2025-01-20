import { NavLink, useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import { Button, Col, Input, Layout, Form, Row, Image, Badge, Avatar } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import LoginUser from "../../pages/clients/LoginUser";
import { LogoutOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { settingGeneralGet } from "../../services/client/settingServies";
import { findCartGet } from "../../services/client/cartServies";
import { updateCartLength } from "../../actions/cart";
import Register from "../../pages/clients/Register";
import { listCategoriesGet } from "../../services/client/productCategoriesServies";

const createTree = (arr, parentId = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      const newItem = { ...item }; // Sao chép để tránh sửa trực tiếp
      const children = createTree(arr, item._id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

const { Header } = Layout;

function HeaderClient() {
  // Khi islogin thay đổi thì sẽ render lại component này
  // eslint-disable-next-line no-unused-vars
  const isLogin = useSelector(state => state.loginUserReducers);

  const tokenUser = getCookie("tokenUser");
  const avatar = getCookie("avatar");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const componentRef = useRef(null);

  // Xử lý hiển thị số lượng sản phẩm trong giỏ hàng.
  const dispatch = useDispatch();
  const lengthCart = useSelector((state) => state.cartReducer.lengthCart);
  // Xử lý hiển thị số lượng sản phẩm trong giỏ hàng.

  // Phần hiển thị thông tin trang web
  const [setting, setSetting] = useState([]);

  // menu
  const [activeLink, setActiveLink] = useState("TRANG CHỦ"); // Link mặc định active
  const [menu, setMenu] = useState([]);

  // end menu

  useEffect(() => {
    const fetchApiSetting = async () => {
      try {
        // Lấy thông tin web
        const response = await settingGeneralGet();
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

    const fetchApiCategories = async () => {
      try {
        // Lấy thông tin web
        const response = await listCategoriesGet();
        const tree = createTree(response.productsCategory);
        setMenu([
          {
            title: "TRANG CHỦ",
            url: "/"
          },
          {
            title: "DANH MỤC",
            url: "danh-muc",
            children: tree,
          },
          {
            title: "GIỚI THIỆU",
            url: "#"
          },
          // {
          //   title: "TƯ VẤN CHỌN",
          //   url: "#"
          // },
          // {
          //   title: "TẠP CHÍ NƯỚC HOA",
          //   url: "https://www.facebook.com/bunsdzpo"
          // },
          // {
          //   title: "LIÊN HỆ",
          //   url: "https://www.facebook.com/bunsdzpr"
          // }
        ]);

      } catch (error) {
      }
    };

    fetchApiCategories();

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

  const handleActive = (link) => {
    setActiveLink(link); // Cập nhật link đang active
  };

  const handleReload = () => {

  }

  const onFinish = (e) => {
    navigate(`/search?keyword=${e.keyword || ""}`);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <>
      <Header style={{ background: "#FFFFFF" }}>
        <div className="layout-default__header container">
          <div className="layout-default__logo">
            <NavLink to="/">
              <Image src={setting.logo}
                preview={false}
                style={{
                  maxWidth: "100%",
                  maxHeight: "50px"
                }} />
            </NavLink>
          </div>
          <div className="layout-default__search">
            <Form onFinish={onFinish} layout="vertical">
              <Row gutter={[12, 12]}>
                <Col span={22}>
                  <Form.Item name="keyword" >
                    <Input
                      allowClear
                      type="text"
                      placeholder='Tìm kiếm'
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
          <div className="layout-default__accounts" >
            <Badge count={lengthCart} style={{ marginRight: "15px" }} color="#22A6F2">
              <a href="/order/cart">
                <Button color="default" variant="link" icon={<ShoppingCartOutlined />} style={{ marginRight: "10px" }} />
              </a>
            </Badge>
            {tokenUser ? (
              <>
                <Avatar src={avatar} size="large" className="avatar" icon={<UserOutlined />} onClick={toggleMenu} />
                {isMenuOpen && (
                  <ul className="menu" ref={componentRef}>
                    <li className="fullName">
                      <NavLink to="/info-user">
                        Xin chào!, {getCookie("fullName") ? getCookie("fullName") : ""}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/orders/detail">
                        Đơn hàng
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/logout">
                        <LogoutOutlined /> Đăng xuất
                      </NavLink>
                    </li>
                  </ul>
                )}
              </>
            ) : (
              <>
                <LoginUser onReload={handleReload} onMenuOpen={() => setIsMenuOpen(false)} />
                <Register onReload={handleReload} onMenuOpen={() => setIsMenuOpen(false)} />
              </>
            )}
          </div>
        </div >
      </Header >
      <div className="layout-default__menu container">
        <ul>
          {menu.map((link) => (
            <li
              key={link.url}
              className={activeLink === link.title ? "active" : ""}
            >
              <a href={link.url} onClick={() => handleActive(link.title)}>
                {link.title}
              </a>
              {/* Kiểm tra nếu có children thì render submenu */}
              {link.children && (
                <ul className="submenu">
                  {link.children.map((child) => (
                    <li key={child.slug}>
                      <a href={`/danh-muc/${child.slug}`} >{child.title}</a>
                      {/* Kiểm tra nếu có children tiếp tục render sub-submenu */}
                      {child.children && (
                        <ul className="sub-submenu">
                          {child.children.map((subChild) => (
                            <li key={subChild.slug}>
                              <a href={`/danh-muc/${subChild.slug}`} >
                                {subChild.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default HeaderClient;