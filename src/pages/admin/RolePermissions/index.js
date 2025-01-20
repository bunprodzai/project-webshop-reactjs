import React, { useEffect, useState } from 'react';
import "./RolePermissions.scss";
import { Card, Table, Checkbox, Button, Typography, message } from 'antd';
import { editPermissionsPatch, listRoleGet } from '../../../services/admin/rolesServies';
import { getCookie } from '../../../helpers/cookie';
import NoRole from '../../../components/NoRole';

const { Title } = Typography;

const RolePermissions = () => {
  const permissionsCheck = JSON.parse(localStorage.getItem('permissions'));

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const token = getCookie("token");

  // Lấy dữ liệu roles từ API
  const fetchApi = async () => {
    try {
      const response = await listRoleGet(token);
      if (response.code === 200) {
        setRoles(response.roles);
        initializePermissions(response.roles);
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu vai trò!');
    }
  };

  // Khởi tạo trạng thái checkbox từ roles
  const initializePermissions = (roles) => {
    const initialPermissions = {};
    roles.forEach((role) => {
      role.permissions.forEach((perm) => {
        initialPermissions[`${role._id}-${perm}`] = true;
      });
    });
    setPermissions(initialPermissions);
  };

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Xử lý thay đổi trạng thái checkbox
  const handleCheckboxChange = (roleId, perm) => {
    setPermissions((prev) => ({
      ...prev,
      [`${roleId}-${perm}`]: !prev[`${roleId}-${perm}`],
    }));
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: 'Tên quyền',
      dataIndex: 'feature',
      key: 'feature',
    },
    ...roles.map((role) => ({
      title: role.title,
      key: role._id,
      dataIndex: role._id,
      render: (_, record) =>
        !record.isCategory ? (
          <Checkbox
            checked={permissions[`${role._id}-${record.key}`]}
            onChange={() => handleCheckboxChange(role._id, record.key)}
          />
        ) : null,
    })),
  ];

  // Dữ liệu hiển thị trong bảng
  const dataSource = [
    { key: 'category', feature: 'Danh mục sản phẩm', isCategory: true },
    { key: 'products_category_view', feature: 'Xem', isCategory: false },
    { key: 'products_category_create', feature: 'Thêm mới', isCategory: false },
    { key: 'products_category_edit', feature: 'Chỉnh sửa', isCategory: false },
    { key: 'products_category_del', feature: 'Xóa', isCategory: false },

    { key: 'product', feature: 'Sản phẩm', isCategory: true },
    { key: 'products_view', feature: 'Xem', isCategory: false },
    { key: 'products_create', feature: 'Thêm mới', isCategory: false },
    { key: 'products_edit', feature: 'Chỉnh sửa', isCategory: false },
    { key: 'products_del', feature: 'Xóa', isCategory: false },

    { key: 'roles', feature: 'Quyền', isCategory: true },
    { key: 'roles_view', feature: 'Xem', isCategory: false },
    { key: 'roles_create', feature: 'Thêm mới', isCategory: false },
    { key: 'roles_edit', feature: 'Chỉnh sửa', isCategory: false },
    { key: 'roles_del', feature: 'Xóa', isCategory: false },

    { key: 'permissions', feature: 'Phân quyền', isCategory: true },
    { key: 'roles_permissions', feature: 'Phân quyền', isCategory: false },

    { key: 'accounts', feature: 'Tài khoản', isCategory: true },
    { key: 'accounts_view', feature: 'Xem', isCategory: false },
    { key: 'accounts_create', feature: 'Thêm mới', isCategory: false },
    { key: 'accounts_edit', feature: 'Chỉnh sửa', isCategory: false },
    { key: 'accounts_del', feature: 'Xóa', isCategory: false },

    { key: 'users', feature: 'Tài khoản', isCategory: true },
    { key: 'users_view', feature: 'Xem', isCategory: false },
    { key: 'users_edit', feature: 'Chỉnh sửa', isCategory: false },
    { key: 'users_del', feature: 'Xóa', isCategory: false },

    { key: 'articles', feature: 'Bài viết', isCategory: true },
    { key: 'articles_view', feature: 'Xem', isCategory: false },
    { key: 'articles_edit', feature: 'Thêm mới', isCategory: false },
    { key: 'articles_create', feature: 'Chỉnh sửa', isCategory: false },
    { key: 'articles_del', feature: 'Xóa', isCategory: false },

    { key: 'orders', feature: 'Đơn hàng', isCategory: true },
    { key: 'orders_view', feature: 'Xem', isCategory: false },

    { key: 'settings', feature: 'Phân quyền', isCategory: true },
    { key: 'settings_general', feature: 'Toàn quyền', isCategory: false },

  ];

  // gửi api lên server
  const handleSend = () => {
    const formattedPermissions = roles.map((role) => ({
      id: role._id,
      permissions: Object.keys(permissions)
        .filter((key) => key.startsWith(role._id) && permissions[key])
        .map((key) => key.split('-')[1]),
    }));

    // data gửi lên 
    const permissionsSend = {};
    permissionsSend["permissions"] = formattedPermissions;

    const fetchApiPermissionsPatch = async () => {
      const response = await editPermissionsPatch(permissionsSend, token);
      if (response.code === 200) {
        message.success("Cập nhật thành công");
      } else {
        message.error("Cập nhật thất bại!");
      }
    }
    fetchApiPermissionsPatch();
  };

  // Áp dụng lớp CSS để in đậm các dòng có isCategory: true
  const rowClassName = (record) => (record.isCategory ? 'bold-row' : '');

  return (
    <>
      {permissionsCheck.includes("roles_permissions") ?
        <Card>
          <Title level={4}>{"Phân quyền"}</Title>
          <Button type="primary" style={{ marginTop: 10, marginBottom: 10 }} onClick={handleSend} >
            Cập nhật
          </Button>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowClassName={rowClassName} // Áp dụng lớp CSS cho các dòng cần in đậm
            rowKey="key"
          />
        </Card>
        :
        <NoRole />
      }
    </>
  );
};

export default RolePermissions;
