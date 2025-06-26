import LayoutAdmin from "../layouts/LayoutAdmin";
import PrivateRoutes from "../components/PrivateRoutes";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login/index";
import Logout from "../pages/admin/Logout/index";
import ProductsCreate from "../pages/admin/ProductsCreate/index";
import LayoutDefault from "../layouts/LayoutDefault";
import Home from "../pages/clients/Home";
import CategoriesList from "../pages/admin/CategoriesList";
import RolePermissions from "../pages/admin/RolePermissions";
import RoleCreate from "../pages/admin/RoleCreate";
import RoleList from "../pages/admin/RoleList";
import AccountList from "../pages/admin/AccountList";
import AccountCreate from "../pages/admin/AcountCreate";
import CategoriesCreate from "../pages/admin/CategoriesCreate";
import ProductList from "../pages/admin/ProductList/index";
import SettingGeneral from "../pages/admin/SettingGeneral";
import UserList from "../pages/admin/UserList";
import OrderList from "../pages/admin/OrderList";
import ArticleList from "../pages/admin/ArticleList";
import ArticleCreate from "../pages/admin/ArticleCreate";
import LogoutUser from "../pages/clients/LogoutUser";
import Search from "../pages/clients/Search";
import DetailProduct from "../pages/clients/DetailProduct";
import Cart from "../pages/clients/Cart";
import InfoCheckOut from "../pages/clients/InfoCheckOut";
import CheckoutPay from "../pages/clients/CheckoutPay";
import InfoUser from "../pages/clients/InfoUser";
import Categories from "../components/Categories";
import AccountInfo from "../pages/admin/AccountInfo";
import Order from "../pages/clients/Order";

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