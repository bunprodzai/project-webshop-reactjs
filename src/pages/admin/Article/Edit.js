import { Button, Col, Form, Input, message, Modal, Radio, Row, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getCookie } from "../../../helpers/cookie";
import { editArticlePatch } from "../../../services/admin/articleServies";
import MyEditor from "../../../components/MyEditor";
import { listCategory } from "../../../services/admin/categoryServies";
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

function ArticleEdit(props) {
  const { record, onReload } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  // radio
  const [valueRadio, setValueRadio] = useState(record.status === "active" ? "active" : "inactive");

  const [valueRadioFeatured, setValueRadioFeatured] = useState(record.featured === "1" ? "1" : "0");

  const [categories, setCategories] = useState([]);

  const onChange = (e) => {
    setValueRadio(e.target.value);
  };

  const onChangeFeatured = (e) => {
    setValueRadioFeatured(e.target.value);
  }

  // upload img
  const [imageUrl, setImageUrl] = useState(record.thumbnail);
  // upload img

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

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (e) => {
    e.thumbnail = imageUrl ? imageUrl : "";
    e.status = e.status ? "active" : "inactive";

    e.featured = e.featured === 0 ? "0" : "1";
    e.position = !e.position ? "" : Number(e.position);

    const response = await editArticlePatch(record._id, e, token);
    if (response.code === 200) {
      message.success("Cập nhật thành công");
      onReload();
      handleCancel();
    } else {
      message.error(response.message);
    }
  };


  // options cho Select
  const optionsCategories = categories.map((category) => ({
    label: category.title, // Hiển thị title trong Select
    value: category._id,   // Giá trị _id khi submit
  }));
  // end options cho Select

  return (
    <>
      <Button icon={<EditOutlined />} type="primary" ghost onClick={showModal} />
      <Modal
        title="Chỉnh sửa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={"70%"}
      >
        <Form onFinish={onFinish} layout="vertical" form={form} initialValues={record}>
          <Row>
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
              <Form.Item label="Nổi bật?" name="featured" style={{ marginLeft: "10px" }}>
                <Radio.Group onChange={onChangeFeatured} value={valueRadioFeatured}>
                  <Radio value="1">Bật</Radio>
                  <Radio value="0">Tắt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ảnh nhỏ" name="thumbnail">
                <UploadFile onImageUrlsChange={setImageUrl} initialImageUrls={imageUrl} />
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
              <Form.Item label="Trạng thái" name="status">
                <Radio.Group onChange={onChange} value={valueRadio}>
                  <Radio value="active">Bật</Radio>
                  <Radio value="inactive">Tắt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" name="btn">
                  Cập nhập
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default ArticleEdit;
