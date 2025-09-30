import { Button, Card, Col, Form, Input, message, Row, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { listCategory } from "../../../services/admin/categoryServies";
import { addCategory } from "../../../services/admin/categoryServies";
import { getCookie } from "../../../helpers/cookie";
import { useNavigate } from "react-router-dom";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import MyEditor from "../../../components/MyEditor";

function CategoriesCreate() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [categories, setCategories] = useState([]); // Sửa tên biến cho đúng ngữ pháp
  const token = getCookie("token"); // Lấy token từ cookie
  const navigate = useNavigate();
  // upload img
  const [imageUrls, setImageUrls] = useState("");


  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }

      try {
        const response = await listCategory(token); // Truyền token vào hàm
        if (response) {
          setCategories(response.productsCategory);
        }
      } catch (error) {
        message.error("Lỗi khi tải danh mục:", error.message);
      }
    };

    fetchApi();
  }, [token, imageUrls]); // Thêm token vào dependency để đảm bảo cập nhật khi token thay đổi

  // xử lý submit
  const onFinish = async (e) => {
    e.status = e.status ? "active" : "inactive";
    e.parent_id = !e.parent_id ? "" : e.parent_id;
    e.description = !e.description ? "" : e.description;
    e.position = !e.position ? "" : Number(e.position);
    e.thumbnail = imageUrls ? imageUrls : "";

    try {
      const response = await addCategory(e, token); // Truyền token vào hàm

      if (response.code === 200) {
        message.success("Thêm mới thành công");
        navigate(`/admin/product-category`);
      } else {
        if (Array.isArray(response.message)) {
          const allErrors = response.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error("Lỗi: ", error.message);
    }
  }
  // xử lý submit

  // options cho Select
  // Hàm đệ quy để xây dựng danh sách Select
  function buildSelectOptions(data, parentId = "", level = 0) {
    return data
      .filter(item => item.parent_id === parentId) // Lọc các phần tử con
      .map(item => {
        const prefix = "*".repeat(level); // Thêm dấu "*" tương ứng cấp con
        return [
          {
            value: item._id,
            label: `${prefix} ${item.title}` // Tiêu đề với prefix
          },
          ...buildSelectOptions(data, item._id, level + 1) // Gọi đệ quy cho các phần tử con
        ];
      })
      .flat(); // Gộp mảng thành 1 chiều
  }

  // Gọi hàm để tạo danh sách Select
  const options = buildSelectOptions(categories);
  // end options cho Select

  return (
    <>
      {permissions.includes("products_category_create") ?
        <Card title="Thêm mới danh mục">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Form onFinish={onFinish} layout="vertical">
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Form.Item label="Tiêu đề" name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Danh mục cha" name="parent_id">
                    <Select
                      options={options} // Cung cấp danh sách options
                      placeholder="Chọn danh mục cha"
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Vị trí" name="position" >
                    <Input
                      allowClear
                      type="number"
                      placeholder="Tự tăng"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ảnh nhỏ" name="thumbnail">
                    <UploadFile onImageUrlsChange={setImageUrls} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description" >
                    <MyEditor />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tắt hoạt động / Hoạt động " name="status">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">Thêm</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Card>
        :
        <NoRole />
      }
    </>
  )
}

export default CategoriesCreate;