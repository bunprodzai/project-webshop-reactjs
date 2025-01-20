import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { deleteProduct } from "../../services/admin/productServies";
import { getCookie } from "../../helpers/cookie";
import { deleteCategory } from "../../services/admin/categoryServies";
import { deleteRole } from "../../services/admin/rolesServies";
import { deleteAccountDel } from "../../services/admin/accountServies";
import { deleteUserDel } from "../../services/admin/userServies";
import { deleteArticleDel } from "../../services/admin/articleServies";
const { confirm } = Modal;

function DeleteItem(props) {
  const { record, onReload, typeDelete } = props;

  const token = getCookie("token");

  let deleteItem;
  let item;

  switch (typeDelete) {
    case "product-category":
      item = "danh mục";
      deleteItem = async () => {
        const response = await deleteCategory(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "product":
      item = "sản phẩm"
      deleteItem = async () => {
        const response = await deleteProduct(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "role":
      item = "quyền"
      deleteItem = async () => {
        const response = await deleteRole(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "account":
      item = "tài khoản"
      deleteItem = async () => {
        const response = await deleteAccountDel(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "user":
      item = "khách hàng"
      deleteItem = async () => {
        const response = await deleteUserDel(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "article":
      item = "bài viết"
      deleteItem = async () => {
        const response = await deleteArticleDel(record._id, token);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;
    default:
      break;
  }



  const showDeleteConfirm = () => {
    confirm({
      title: `Bạn chắc chắn muốn xóa ${item} này?`,
      icon: <ExclamationCircleFilled />,
      content: 'Xác nhận xóa!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteItem();
      },
      onCancel() {

      },
    });
  };
  return (
    <>
      <Button style={{ marginLeft: 8 }} icon={<DeleteOutlined />} type="primary" ghost danger onClick={showDeleteConfirm} />
    </>
  )
}

export default DeleteItem;