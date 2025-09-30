import { Menu } from "antd";
import {
  ProductOutlined, EllipsisOutlined, OrderedListOutlined, BarChartOutlined, OneToOneOutlined,
  SettingOutlined, UserSwitchOutlined, UserAddOutlined, UserOutlined,
  UnorderedListOutlined, PlusOutlined, ReadOutlined, ShoppingCartOutlined, MutedOutlined, DollarOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";

const filterItemsByPermissions = (items, permissions) => {
  return items
    .map(item => {
      // Kiểm tra nếu item có children, lọc children trước
      if (item.children) {
        const filteredChildren = filterItemsByPermissions(item.children, permissions);
        // Chỉ giữ lại mục cha nếu có children hợp lệ
        return filteredChildren.length > 0
          ? { ...item, children: filteredChildren }
          : null;
      }
      // Kiểm tra quyền (nếu có `permission`), hoặc giữ lại nếu không có điều kiện
      return item.permission ? (permissions.includes(item.permission) ? item : null) : item;
    })
    .filter(Boolean); // Loại bỏ các mục null
};

function MenuSider() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  // items menu
  const items = [
    {
      key: '1',
      icon: <Link to="/admin/dashboard"><BarChartOutlined /></Link>,
      label: 'Tổng quan'
    },
    {
      key: '2',
      icon: <ProductOutlined />,
      label: 'Sản phẩm',
      children: [
        {
          key: 'product-list',
          icon: <Link to="admin/products"><UnorderedListOutlined /></Link>,
          label: 'Danh sách',
          permission: "products_view",
        },
        {
          key: 'product-create',
          icon: <Link to="admin/products/create"><PlusOutlined /></Link>,
          label: 'Thêm sản phẩm',
          permission: "products_create",
        }
      ]
    },
    {
      key: '3',
      icon: <OrderedListOutlined />,
      label: 'Danh mục',
      children: [
        {
          key: 'category-list',
          icon: <Link to="admin/product-category"><UnorderedListOutlined /></Link>,
          label: 'Danh sách',
          permission: "products_category_view",
        },
        {
          key: 'category-create',
          icon: <Link to="admin/product-category/create"><PlusOutlined /></Link>,
          label: 'Thêm danh mục',
          permission: "products_category_create",
        }
      ]
    },
    {
      key: '4',
      icon: <OneToOneOutlined />,
      label: 'Nhóm quyền',
      children: [
        {
          key: 'role-list',
          icon: <Link to="admin/roles"><UnorderedListOutlined /></Link>,
          label: 'Danh sách',
          permission: "roles_view",
        },
        {
          key: 'role-permissions',
          icon: <Link to="admin/roles/permissions"><EllipsisOutlined /></Link>,
          label: 'Phân quyền',
          permission: "roles_permissions",
        },
        {
          key: 'role-create',
          icon: <Link to="admin/roles/create"><PlusOutlined /></Link>,
          label: 'Thêm quyền',
          permission: "roles_create",
        }
      ]
    },
    {
      key: '5',
      icon: <UserSwitchOutlined />,
      label: 'Quản lý tài khoản',
      children: [
        {
          key: 'account-list',
          icon: <Link to="admin/accounts"><UnorderedListOutlined /></Link>,
          label: 'Danh sách',
          permission: "accounts_view",
        },
        {
          key: 'account-create',
          icon: <Link to="admin/accounts/create"><UserAddOutlined /></Link>,
          label: 'Thêm tài khoản',
          permission: "accounts_create",
        }
      ]
    },
    {
      key: '6',
      icon: <Link to="/admin/settings/general"><SettingOutlined /></Link>,
      label: 'Cài đặt chung',
      permission: "settings_general",
    },
    {
      key: '7',
      icon: <Link to="/admin/users"><UserOutlined /></Link>,
      label: 'Quản lý khách hàng',
      permission: "users_view",
    },
    {
      key: '8',
      icon: <Link to="/admin/orders"><ShoppingCartOutlined /></Link>,
      label: 'Đơn hàng',
      permission: "orders_view",
    },
    {
      key: '9',
      icon: <ReadOutlined />,
      label: 'Quản lý bài viết',
      children: [
        {
          key: 'article-list',
          icon: <Link to="admin/articles"><UnorderedListOutlined /></Link>,
          label: 'Danh sách',
          permission: "articles_view",
        },
        {
          key: 'article-create',
          icon: <Link to="admin/articles/create"><PlusOutlined /></Link>,
          label: 'Thêm bài viết',
          permission: "articles_create",
        }
      ]
    },
    {
      key: '10',
      icon: <MutedOutlined />,
      label: 'Quản lý quảng cáo',
      children: [
        {
          key: 'banner-list',
          icon: <Link to="admin/banners"><UnorderedListOutlined /></Link>,
          label: 'Danh sách',
          permission: "banners_view",
        },
        {
          key: 'banner-create',
          icon: <Link to="admin/banners/create"><PlusOutlined /></Link>,
          label: 'Thêm quảng cáo',
          permission: "banners_create",
        }
      ]
    },
    {
      key: '11',
      icon: <DollarOutlined />,
      label: 'Quản lý Voucher',
      children: [
        {
          key: 'voucher-list',
          icon: <Link to="admin/vouchers"><UnorderedListOutlined /></Link>,
          label: 'Danh sách',
          permission: "vouchers_view",
        },
        {
          key: 'voucher-create',
          icon: <Link to="admin/vouchers/create"><PlusOutlined /></Link>,
          label: 'Thêm bài Voucher',
          permission: "vouchers_create",
        }
      ]
    },
    {
      key: '12',
      icon: <DeleteOutlined />,
      label: 'Thùng rác',
      children: [
        {
          key: 'product-trash',
          icon: <Link to="admin/trashs/products"><ProductOutlined /></Link>,
          label: 'Sản phẩm',
          permission: "trashs_view",
        },
        {
          key: 'category-trash',
          icon: <Link to="admin/trashs/categories"><OrderedListOutlined /></Link>,
          label: 'Danh mục',
          permission: "trashs_view",
        },
        {
          key: 'account-trash',
          icon: <Link to="admin/trashs/accounts"><UserSwitchOutlined /></Link>,
          label: 'Tài khoản',
          permission: "trashs_view",
        },
        {
          key: 'article-trash',
          icon: <Link to="admin/trashs/articles"><ReadOutlined /></Link>,
          label: 'Bài viết',
          permission: "trashs_view",
        },
        {
          key: 'banner-trash',
          icon: <Link to="admin/trashs/banners"><MutedOutlined /></Link>,
          label: 'Quảng cáo',
          permission: "trashs_view",
        },
        {
          key: 'voucher-trash',
          icon: <Link to="admin/trashs/vouchers"><DollarOutlined /></Link>,
          label: 'Voucher',
          permission: "trashs_view",
        },
        {
          key: 'user-trash',
          icon: <Link to="admin/trashs/users"><UserOutlined /></Link>,
          label: 'Khách hàng',
          permission: "trashs_view",
        }
      ]
    }
  ];

  const filteredItems = filterItemsByPermissions(items, permissions);

  return (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={['/']}
        items={filteredItems}
      />
    </>
  )
}

export default MenuSider;