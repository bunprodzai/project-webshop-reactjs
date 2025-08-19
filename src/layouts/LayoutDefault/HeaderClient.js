import { Link, useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import { useDispatch, useSelector } from "react-redux";
import LoginUser from "../../pages/clients/LoginUser";
import { useEffect, useRef, useState } from "react";
import { settingGeneralGet } from "../../services/client/settingServies";
import { findCartGet } from "../../services/client/cartServies";
import { updateCartLength } from "../../actions/cart";
import Register from "../../pages/clients/Register";

import { ShoppingCartOutlined, SearchOutlined, HeartOutlined, UserOutlined, LogoutOutlined, CloseOutlined, MenuOutlined } from "@ant-design/icons"
import { Layout, Button, Input, Badge, Space, Form, Row, Col, Drawer, Divider, Menu, Dropdown, Avatar } from "antd"

const { Header } = Layout

function HeaderClient() {

  // Khi islogin thay đổi thì sẽ render lại component này
  // eslint-disable-next-line no-unused-vars
  const isLogin = useSelector(state => state.loginUserReducers);

  const tokenUser = getCookie("tokenUser");
  // const avatar = getCookie("avatar");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const componentRef = useRef(null);

  // Xử lý hiển thị số lượng sản phẩm trong giỏ hàng.
  const dispatch = useDispatch();
  const lengthCart = useSelector((state) => state.cartReducer.lengthCart);
  const [form] = Form.useForm()
  // Phần hiển thị thông tin trang web
  const [setting, setSetting] = useState([]);

  // Get user data from cookies
  const fullName = getCookie("fullName")
  const avatar = getCookie("avatar")

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

    // Gắn sự kiện click trên document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Hủy gắn sự kiện khi component bị unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Xử lý click ngoài để ẩn menu
  const handleClickOutside = (event) => {
    setTimeout(() => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }, 100); // đủ để Dropdown xử lý
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

  // Navigation items
  const navItems = [
    { key: "home", href: "/", label: "Home" },
    { key: "products", href: "/products", label: "Products" },
    { key: "categories", href: "/danh-muc", label: "Categories" },
    { key: "deals", href: "/deals", label: "Deals" },
    { key: "about", href: "/about", label: "About" },
  ]

  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case "profile":
        navigate(`/info-user`);
        break;
      case "orders":
        navigate(`/order/history`);
        break;
      case "logout":
        navigate(`/logout`);
        break;
      default:
        break;
    }

    setIsMenuOpen(false); // Đóng menu sau khi chọn
  };


  // User dropdown menu
  const userMenu = (
    <Menu
      onClick={handleUserMenuClick}
      items={[
        {
          key: "profile",
          label: `Xin chào!, ${fullName || ""}`,
        },
        {
          key: "orders",
          label: "Đơn hàng của bạn",
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: (
            <>
              <LogoutOutlined /> Logout
            </>
          ),
        },
      ]}
    />
  );

  // Mobile menu items
  const mobileMenuItems = navItems.map((item) => ({
    key: item.key,
    label: <Link style={{ fontSize: "14px", fontWeight: 500, color: "#000" }} to={item.href}>{item.label}</Link>,
  }));


  return (
    <>
      <>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            width: "100%",
            background: "white",
            padding: "0 16px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
          }}
        >
          <Row justify="space-between" align="middle"  style={{ height: "100%", padding: "0px 10px 0px 0px" }}>
            {/* Left side - Logo and Navigation */}
            <Col xs={12} sm={8} md={12} lg={8}>
              <Row align="middle" gutter={24}>
                {/* Mobile menu button */}
                <Col xs={4} sm={0} md={0} lg={0}>
                  <Button
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={() => setIsMobileMenuOpen(true)}
                    style={{ padding: "4px 8px" }}
                  />
                </Col>

                {/* Logo */}
                <Col xs={20} sm={24} md={24} lg={24}>
                  <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {setting.logo && (
                      <img
                        src={setting.logo || "/placeholder.svg"}
                        alt={setting.websiteName}
                        style={{ maxHeight: "40px", width: "auto" }}
                      />
                    )}
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#000" }}>{setting.websiteName}</span>
                  </Link>
                </Col>
              </Row>
            </Col>

            {/* Center - Desktop Navigation */}
            <Col xs={0} sm={0} md={0} lg={8}>
              <Space size={24} style={{ width: "100%", justifyContent: "center" }}>
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    style={{ fontSize: "16px", fontWeight: 500, color: "#000", ":hover": { color: "#1890ff" } }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Space>
            </Col>

            {/* Right side - Search and Actions */}
            <Col xs={12} sm={16} md={12} lg={8}>
              <Row justify="end" align="middle" gutter={[8, 8]}>
                {/* Desktop Search */}
                <Col xs={0} sm={0} md={12} lg={14}>
                  <Form form={form} onFinish={onFinish} layout="inline" style={{ width: "100%" }}>
                    <Row gutter={[8, 8]} style={{ width: "100%" }}>
                      <Col flex="auto">
                        <Form.Item name="keyword" style={{ margin: 0 }}>
                          <Input
                            allowClear
                            placeholder="Search products..."
                            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item style={{ margin: 0 }}>
                          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>

                {/* Actions */}
                <Col xs={24} sm={12} md={12} lg={10}>
                  <Space size={8} style={{ width: "100%", justifyContent: "flex-end" }}>
                    {/* Mobile Search Button */}
                    <Button
                      type="text"
                      icon={<SearchOutlined />}
                      onClick={() => setIsSearchVisible(true)}
                      className="mobile-search-btn"
                      style={{ display: "none" }}
                    />

                    {/* Cart */}
                    <Badge count={lengthCart} size="small">
                      <Link to="/order/cart">
                        <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: "20px" }} />} />
                      </Link>
                    </Badge>

                    {/* Wishlist */}
                    <Button type="text" icon={<HeartOutlined style={{ fontSize: "20px" }} />} />

                    {/* User Account */}
                    {tokenUser ? (
                      <div ref={componentRef}>
                        <Dropdown
                          overlay={userMenu} // 👈 dùng overlay thay vì menu
                          trigger={["click"]}
                          open={isMenuOpen}
                          onOpenChange={setIsMenuOpen}
                        >
                          <Button type="text" onClick={toggleMenu}>
                            {avatar ? (
                              <Avatar src={avatar} size="small" />
                            ) : (
                              <UserOutlined style={{ fontSize: "20px" }} />
                            )}
                          </Button>
                        </Dropdown>

                      </div>
                    ) : (
                      <Space size={8} className="auth-buttons">
                        <LoginUser onReload={handleReload} onMenuOpen={() => setIsMenuOpen(false)} />
                        <Register onReload={handleReload} page="header" onMenuOpen={() => setIsMenuOpen(false)} />
                      </Space>
                    )}
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>

        {/* Mobile Menu Drawer */}
        <Drawer
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {setting.logo && (
                <img
                  src={setting.logo || "/placeholder.svg"}
                  alt={setting.websiteName}
                  style={{ maxHeight: "32px", width: "auto" }}
                />
              )}
              <span>{setting.websiteName}</span>
            </div>
          }
          placement="left"
          onClose={() => setIsMobileMenuOpen(false)}
          open={isMobileMenuOpen}
          width={280}
          closeIcon={<CloseOutlined />}
        >
          <div style={{ marginBottom: "24px" }}>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item name="keyword" style={{ marginBottom: "16px" }}>
                <Input
                  allowClear
                  placeholder="Search products..."
                  prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                />
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <Button type="primary" htmlType="submit" block icon={<SearchOutlined />}>
                  Tìm kiếm
                </Button>
              </Form.Item>
            </Form>
          </div>

          <Divider />

          <Menu
            mode="vertical"
            items={mobileMenuItems}
            style={{ border: "none" }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {!tokenUser && (
            <>
              <Divider />
              <Space direction="vertical" style={{ width: "100%" }}>
                <LoginUser onReload={handleReload} onMenuOpen={() => setIsMobileMenuOpen(false)} />
                <Register onReload={handleReload} page="header" onMenuOpen={() => setIsMobileMenuOpen(false)} />
              </Space>
            </>
          )}
        </Drawer>

        {/* Mobile Search Modal */}
        <Drawer
          title="Tìm kiếm sản phẩm"
          placement="top"
          onClose={() => setIsSearchVisible(false)}
          open={isSearchVisible}
          height={200}
          closeIcon={<CloseOutlined />}
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item name="keyword">
              <Input
                allowClear
                placeholder="Search products..."
                prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                autoFocus
              />
            </Form.Item>
            <Form.Item style={{ margin: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  Tìm kiếm
                </Button>
                <Button onClick={() => setIsSearchVisible(false)}>Hủy</Button>
              </Space>
            </Form.Item>
          </Form>
        </Drawer>

        <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-search-btn {
            display: inline-flex !important;
          }
          .auth-buttons {
            display: none !important;
          }
        }

        @media (max-width: 576px) {
          .ant-layout-header {
            padding: 0 8px !important;
          }
        }

        .ant-drawer-body {
          padding: 16px;
        }

        .ant-menu-vertical .ant-menu-item {
          margin: 4px 0;
          border-radius: 6px;
        }

        .ant-menu-vertical .ant-menu-item:hover {
          background-color: #f0f0f0;
        }
      `}</style>
      </>
    </>
  )
}

export default HeaderClient;