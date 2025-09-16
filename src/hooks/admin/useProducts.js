import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct, changeStatusProduct, editProduct } from "../../services/admin/productServies";
import { message } from "antd";


function useProducts({ token } = {}) {

  const queryClient = useQueryClient();

  // CREATE
  const createProduct = useMutation({
    mutationFn: async (newProduct) => {
      console.log(newProduct);
      console.log(token);
      return await addProduct(newProduct, token);
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success("Thêm mới thành công");
        queryClient.invalidateQueries(["products"]); // refetch lại danh sách
      } else {
        message.error(response.message || "Thêm mới thất bại");
      }
    },
    onError: (error) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });

  // UPDATE
  const updateProduct = useMutation({
    mutationFn: async ({ id, data }) => {
      return await editProduct(id, data, token);
    },
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Cập nhật thành công");
        // invalidate lại cache products để UI sync
        queryClient.invalidateQueries(["products"]);
      } else {
        message.error(response?.message || "Cập nhật thất bại");
      }
    },
    onError: (error) => {
      console.error("❌ Lỗi khi cập nhật product:", error);
      message.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại");
    },
  });

  // UPDATE status
  const updateStatus = useMutation({
    mutationFn: async ({ statusChange, id }) => {
      return await changeStatusProduct(token, statusChange, id);
    },
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Thay đổi trạng thái thành công");
        // invalidate lại cache products để UI sync
        queryClient.invalidateQueries(["products"]);
      } else {
        message.error(response?.message || "Thay đổi trạng thái không thành công!");
      }
    },
    onError: (error) => {
      console.error("❌ Lỗi khi cập nhật product:", error);
      message.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại");
    },
  });

  return { createProduct, updateProduct, updateStatus };
}

export default useProducts;