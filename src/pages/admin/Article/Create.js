import { Button, Card, Col, Form, Input, Row, Switch, Radio, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { addArticlePost } from "../../../services/admin/articleServies";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import { listCategory } from "../../../services/admin/categoryServies";
import MyEditor from "../../../components/MyEditor";
import UploadFile from "../../../components/UploadFile";

const optionsTags = [
  { value: 'ao-so-mi', desc: 'Áo sơ mi' },
  { value: 'vay-dam', desc: 'Váy đầm' },
  { value: 'quan-jean', desc: 'Quần jean' },
  { value: 'ao-khoac', desc: 'Áo khoác' },
  { value: 'thoi-trang-nu', desc: 'Thời trang nữ' },
  { value: 'thoi-trang-nam', desc: 'Thời trang nam' },
  { value: 'basic-style', desc: 'Basic style' },
  { value: 'y2k', desc: 'Y2K' },
  { value: 'thoi-trang-cong-so', desc: 'Thời trang công sở' },
  { value: 'outfit-di-choi', desc: 'Outfit đi chơi' },
  { value: 'outfit-di-lam', desc: 'Outfit đi làm' },
  { value: 'mix-match', desc: 'Mix & Match' },
  { value: 'lookbook', desc: 'Lookbook' },
  { value: 'xuan-he', desc: 'Xuân - Hè' },
  { value: 'thu-dong', desc: 'Thu - Đông' },
  { value: 'vintage', desc: 'Vintage' },
  { value: 'nang-dong', desc: 'Năng động' },
  { value: 'sang-trong', desc: 'Sang trọng' },
  { value: 'hoa-tiet-hoa', desc: 'Họa tiết hoa' },
  { value: 'chat-lieu-cotton', desc: 'Chất liệu cotton' },
];


function ArticleCreate() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const navigate = useNavigate();
  const token = getCookie("token"); // Lấy token từ cookie

  const [categories, setCategories] = useState([]);

  // upload img
  const [imageUrl, setImageUrl] = useState("");

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // xử lý submit
  const onFinish = async (e) => {
    e.thumbnail = imageUrl ? imageUrl : "";
    e.status = e.status ? "active" : "inactive";

    e.featured = e.featured === 0 ? "0" : "1";
    e.position = !e.position ? "" : Number(e.position);

    try {
      const response = await addArticlePost(e, token); // Truyền token vào hàm
      console.log(response);
      if (response.code === 200) {
        message.success("Thêm mới thành công");
        navigate(`/admin/articles`);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Lỗi: ", error.message);
    }
  }
  // end xử lý submit

  // options cho Select
  const optionsCategories = categories.map((category) => ({
    label: category.title, // Hiển thị title trong Select
    value: category._id,   // Giá trị _id khi submit
  }));
  // end options cho Select

  return (
    <>
      {permissions.includes("articles_create") ?
        <Card title="Thêm mới bài viết">
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
                  <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: "Chọn danh mục" }]}>
                    <Select
                      options={optionsCategories}     // Cung cấp danh sách options
                      placeholder="Chọn danh mục"
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
                <Col span={14}>
                  <Form.Item label="Tags" name="tags" rules={[{ required: true, message: "Chọn tags" }]}>
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="select multiple tags"
                      options={optionsTags.map(opt => ({ value: opt.value, label: opt.desc }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Nổi bật?" name="featured" initialValue={1} style={{ marginLeft: "10px" }}>
                    <Radio.Group>
                      <Radio value={1}>Nổi bật</Radio>
                      <Radio value={0}>Không nổi bật</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ảnh nhỏ" name="thumbnail">
                    <UploadFile onImageUrlsChange={setImageUrl} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tác giả" name="author" rules={[{ required: true, message: "Nhập tác giả" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Trích đoạn" name="excerpt" rules={[{ required: true, message: "Nhập trích đoạn" }]}>
                    <TextArea></TextArea>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Nhập nội dung" }]}>
                    <MyEditor />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tắt hoạt động / Hoạt động" name="status">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Button type="primary" htmlType="submit">Thêm</Button>
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

export default ArticleCreate;