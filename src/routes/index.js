// Admin imports (sorted alphabetically)
import AccountCreate from "../pages/admin/Account/Create";
import AccountInfo from "../pages/admin/Account/Info";
import AccountList from "../pages/admin/Account/List";

import ArticleCreate from "../pages/admin/Article/Create";
import ArticleList from "../pages/admin/Article/List";

import BannerCreate from "../pages/admin/Banner/Create";
import BannerList from "../pages/admin/Banner/List";

import CategoriesCreate from "../pages/admin/Category/Create";
import CategoriesList from "../pages/admin/Category/List";

import Dashboard from "../pages/admin/Dashboard";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Login from "../pages/admin/Login/index";
import Logout from "../pages/admin/Logout/index";

import OrderList from "../pages/admin/Order/List";

import PrivateRoutes from "../components/PrivateRoutes";

import ProductList from "../pages/admin/Product/List";
import ProductsCreate from "../pages/admin/Product/Create";

import RoleCreate from "../pages/admin/Role/Create";
import RoleList from "../pages/admin/Role/List";
import RolePermissions from "../pages/admin/Role/Permissions";

import SettingGeneral from "../pages/admin/SettingGeneral";

import UserList from "../pages/admin/User/List";

import VoucherCreate from "../pages/admin/Voucher/Create";
import VoucherList from "../pages/admin/Voucher/List";

// Client imports (sorted alphabetically)
import AboutUs from "../pages/clients/AboutUs";
import BannerDetail from "../pages/clients/BannerDetail";
import Blog from "../pages/clients/Blog";
import Cart from "../pages/clients/Cart";
import Categories from "../components/Categories";
import CheckoutPay from "../pages/clients/CheckoutPay";
import DetailProduct from "../pages/clients/DetailProduct";
import FailCheckOut from "../pages/clients/FailCheckOut";
import Home from "../pages/clients/Home";
import InfoCheckOut from "../pages/clients/InfoCheckOut";
import InfoUser from "../pages/clients/InfoUser";
import LayoutDefault from "../layouts/LayoutDefault";
import LogoutUser from "../pages/clients/LogoutUser";
import Order from "../pages/clients/Order";
import ArticleDetail from "../pages/clients/ArticleDetail";
import Search from "../pages/clients/Search";
import SuccessCheckOut from "../pages/clients/SuccessCheckOut";
import LoginUser from "../pages/clients/LoginUser";
import Register from "../pages/clients/Register";
import ForgotPassword from "../pages/clients/ForgotPassword";

const pathAdmin = "admin";

export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "logout",
        element: <LogoutUser />
      },
      {
        path: "search",
        element: <Search />
      },
      {
        path: "detail/:slug",
        element: <DetailProduct />
      },
      {
        path: "order/cart",
        element: <Cart />
      },
      {
        path: "order/info-checkout",
        element: <InfoCheckOut />
      },
      {
        path: "order/checkout/pay",
        element: <CheckoutPay />
      },
      {
        path: "info-user",
        element: <InfoUser />
      },
      {
        path: `danh-muc`,
        element: <Categories />
      },
      {
        path: `order/history`,
        element: <Order />
      }
      ,
      {
        path: `articles/:slug`,
        element: <ArticleDetail />
      },
      {
        path: `order/checkout/pay/success/:code`,
        element: <SuccessCheckOut />
      },
      {
        path: `order/checkout/pay/fail/:code`,
        element: <FailCheckOut />
      },
      {
        path: `banner/:slug`,
        element: <BannerDetail />
      },
      {
        path: `blog`,
        element: <Blog />
      },
      {
        path: `about-us`,
        element: <AboutUs />
      },
      {
        path: "login",
        element: <LoginUser />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      }
      // {
      //   path: "login",
      //   element: <LoginUser />
      // }
      ,// {
      //   path: "search",
      //   element: <Search />
      // },
      // {
      //   path: "jobdetail/:idcompany",
      //   element: <JobDetail />
      // },
      // {
      //   path: "companydetail/:id",
      //   element: <CompanyDetail />
      // },
      // {
      //   path: "register",
      //   element: <Register />
      // }

    ]
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <LayoutAdmin />,
        children: [
          {
            path: `${pathAdmin}/dashboard`,
            element: <Dashboard />
          },

          {
            path: `${pathAdmin}/products`,
            element: <ProductList />
          },
          {
            path: `${pathAdmin}/products/create`,
            element: <ProductsCreate />
          },

          {
            path: `${pathAdmin}/product-category`,
            element: <CategoriesList />
          },
          {
            path: `${pathAdmin}/product-category/create`,
            element: <CategoriesCreate />
          },

          {
            path: `${pathAdmin}/roles`,
            element: <RoleList />
          },
          {
            path: `${pathAdmin}/roles/permissions`,
            element: <RolePermissions />
          },
          {
            path: `${pathAdmin}/roles/create`,
            element: <RoleCreate />
          },

          {
            path: `${pathAdmin}/accounts`,
            element: <AccountList />
          },
          {
            path: `${pathAdmin}/accounts/create`,
            element: <AccountCreate />
          },

          {
            path: `${pathAdmin}/settings/general`,
            element: <SettingGeneral />
          },

          {
            path: `${pathAdmin}/users`,
            element: <UserList />
          },

          {
            path: `${pathAdmin}/orders`,
            element: <OrderList />
          },

          {
            path: `${pathAdmin}/articles`,
            element: <ArticleList />
          },
          {
            path: `${pathAdmin}/articles/create`,
            element: <ArticleCreate />
          },
          {
            path: `${pathAdmin}/account-info`,
            element: <AccountInfo />
          },
          {
            path: `${pathAdmin}/vouchers`,
            element: <VoucherList />
          },
          {
            path: `${pathAdmin}/vouchers/create`,
            element: <VoucherCreate />
          },
          {
            path: `${pathAdmin}/banners`,
            element: <BannerList />
          },
          {
            path: `${pathAdmin}/banners/create`,
            element: <BannerCreate />
          }
        ]
      }
    ]
  },
  {
    path: "auth/login",
    element: <Login />
  },
  {
    path: "auth/logout",
    element: <Logout />
  }
]