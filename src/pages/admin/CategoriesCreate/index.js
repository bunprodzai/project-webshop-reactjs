import { Button, Card, Col, Form, Input, message, Row, Select, Switch, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { listCategory } from "../../../services/admin/categoryServies";
import { addCategory } from "../../../services/admin/categoryServies";
import { getCookie } from "../../../helpers/cookie";
import { useNavigate } from "react-router-dom";
import NoRole from "../../../components/NoRole";

function CategoriesCreate() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [categories, setCategories] = useState([]); // Sửa tên biến cho đúng ngữ pháp
  const token = getCookie("token"); // Lấy token từ cookie
  const navigate = useNavigate();
  // upload img
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);


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
  }, [token]); // Thêm token vào dependency để đảm bảo cập nhật khi token thay đổi

  // xử lý submit
  const onFinish = async (e) => {

    if (!e.title) {
      message.error("Vui lòng nhập tiêu đề");
      return;
    }

    e.status = e.status ? "active" : "inactive";
    e.parent_id = !e.parent_id ? "" : e.parent_id;
    e.description = !e.description ? "" : e.description;
    e.position = !e.position ? "" : Number(e.position);
    e.thumbnail = imageUrl ? imageUrl : "";
    console.log(e);
    try {
      const response = await addCategory(e, token); // Truyền token vào hàm
      console.log(response);
      if (response.code === 200) {
        message.success("Thêm mới thành công");
        navigate(`/admin/product-category`);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Lỗi: ", error.message);
    }
  }
  // xử lý submit
  // console.log(categories);

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
                  <Form.Item label="Tiêu đề" name="title" >
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
                    <div>
                      <Upload
                        name="file"
                        listType="picture-card"
                        showUploadList={{ showPreviewIcon: false }}
                        maxCount={1} // Giới hạn chỉ được chọn 1 ảnh
                        customRequest={async ({ file, onSuccess, onError }) => {
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("upload_preset", "my_preset"); // Thay bằng preset của bạn

                          try {
                            const response = await fetch(
                              `https://api.cloudinary.com/v1_1/djckm3ust/image/upload`,
                              {
                                method: "POST",
                                body: formData,
                              }
                            );
                            const data = await response.json();

                            if (data.secure_url) {
                              setImageUrl(data.secure_url); // Lưu đường dẫn ảnh
                              setFileList([
                                {
                                  uid: data.asset_id,
                                  name: data.original_filename,
                                  status: "done",
                                  url: data.secure_url,
                                },
                              ]);
                              onSuccess(data);
                            }
                          } catch (error) {
                            console.error("Lỗi khi upload ảnh:", error);
                            onError(error);
                          }
                        }}
                        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                        onRemove={() => {
                          setImageUrl(""); // Xóa link ảnh
                          setFileList([]); // Xóa danh sách file
                        }}
                      >
                        {fileList.length >= 1 ? null : (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        )}
                      </Upload>
                      {imageUrl && (
                        <div style={{ marginTop: "10px" }}>
                          <p>Link ảnh:</p>
                          <Input value={imageUrl} readOnly />
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description" >
                    <TextArea rows={6} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Hoạt động / Tắt hoạt động" name="status">
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