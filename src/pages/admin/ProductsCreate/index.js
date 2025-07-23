import { Button, Card, Col, Form, Input, Row, Select, Switch, Radio, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { listCategory } from "../../../services/admin/categoryServies";
import { addProduct } from "../../../services/admin/productServies";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFiles from "../../../components/UploadFiles";
import UploadFile from "../../../components/UploadFile";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
function ProductsCreate() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const [categories, setCategories] = useState([]); // Sửa tên biến cho đúng ngữ pháp
  const token = getCookie("token"); // Lấy token từ cookie

  // upload img
  const [imageUrls, setImageUrls] = useState([]);
  const [thumbnail, setThumbnail] = useState("");

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
    e.thumbnail = thumbnail ? thumbnail : "";
    e.images = imageUrls ? imageUrls : [];
    e.status = e.status ? "active" : "inactive";
    e.price = Number(e.price);
    e.discountPercentage = Number(e.discountPercentage);

    if (!e.title) {
      message.error("Vui lòng nhập tiêu đề");
      return;
    }

    e.featured = e.featured === 0 ? "0" : "1";
    e.position = !e.position ? "" : Number(e.position);
    e.product_category_id = !e.product_category_id ? "" : e.product_category_id;
    e.description = !e.description ? "" : e.description;

    /* --- chuyển sizeStock trước khi gửi server --- */
    const sizeStockArr = (e.sizeStock || [])
      .filter(v => v.size && v.quantity > 0)
      .map(v => `${v.size}-${v.quantity}`);
    e.sizeStock = sizeStockArr;     // gán lại đúng định dạng mong muốn
    
    try {
      const response = await addProduct(e, token); // Truyền token vào hàm

      if (response.code === 200) {
        navigate("/admin/products"); // Điều hướng đến trang sản phẩm
        message.success("Thêm mới thành công");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Lỗi: ", error.message);
    }

  }
  // end xử lý submit

  // options cho Select
  const options = categories.map((category) => ({
    label: category.title, // Hiển thị title trong Select
    value: category._id,   // Giá trị _id khi submit
  }));
  // end options cho Select

  return (
    <>
      {permissions.includes("products_create") ?
        <Card title="Thêm mới sản phẩm">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Form onFinish={onFinish} layout="vertical" initialValues={{ discountPercentage: 0 }}>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Danh mục" name="product_category_id" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                    <Select
                      options={options}     // Cung cấp danh sách options
                      placeholder="Chọn danh mục"
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
                    <Input
                      allowClear type="number"
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Phần trăm giảm giá" name="discountPercentage" rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}>
                    <Input
                      allowClear type="number"
                      max={100} min={0}
                      placeholder="0 - 100"
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Vị trí" name="position" >
                    <Input
                      allowClear
                      type="number"
                      placeholder="Tự tăng"
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Giới tính" name="gender" initialValue={1}>
                    <Radio.Group>
                      <Radio value={1}>Nam</Radio>
                      <Radio value={0}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Nổi bật?" name="featured" initialValue={1}>
                    <Radio.Group>
                      <Radio value={1}>Nổi bật</Radio>
                      <Radio value={0}>Không nổi bật</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                {/* size va stock */}
                <Col span={24}>
                  <Card
                    style={{
                      marginTop: 10,
                      width: "100%"
                    }}
                    type="inner"
                  ><Form.Item label="Kích cở & số lượng" required>
                      <Form.List
                        name="sizeStock"
                        // khởi tạo sẵn 1 dòng trống
                        initialValue={[{ size: "", quantity: 0 }]}
                      >
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Row
                                key={key}
                                gutter={12}
                                align="middle"
                                style={{ marginBottom: 12, border: "1px solid #f0f0f0", padding: 12, borderRadius: 6 }}
                              >
                                <Col span={10}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "size"]}
                                    rules={[{ required: true, message: "Nhập kích cỡ!" }]}
                                  >
                                    <Input placeholder="VD: S, M, L, XL hoặc 38, 39, 40" />
                                  </Form.Item>
                                </Col>

                                <Col span={10}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "quantity"]}
                                    rules={[{ required: true, message: "Nhập số lượng!" }]}
                                  >
                                    <Input type="number" min={0} placeholder="0" />
                                  </Form.Item>
                                </Col>

                                <Col span={4} style={{ textAlign: "center" }}>
                                  {fields.length > 1 && (
                                    <MinusCircleOutlined
                                      style={{ fontSize: 20, cursor: "pointer" }}
                                      onClick={() => remove(name)}
                                    />
                                  )}
                                </Col>
                              </Row>
                            ))}

                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Thêm kích cỡ
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </Card>
                </Col>

                <Col span={24}>
                  <Form.Item label="Ảnh nhỏ" name="thumbnail">
                    <UploadFile onImageUrlsChange={setThumbnail} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ảnh mô tả" name="images">
                    <UploadFiles onImageUrlsChange={setImageUrls} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description" >
                    <TextArea rows={6} />
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

export default ProductsCreate;