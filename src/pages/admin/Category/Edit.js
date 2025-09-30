import { Button, Col, Form, Input, message, Modal, Radio, Row, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getCookie } from "../../../helpers/cookie";
import { editCategory, listCategory } from "../../../services/admin/categoryServies";
import UploadFile from "../../../components/UploadFile";
import MyEditor from "../../../components/MyEditor";

function CategoriesEdit(props) {
  const { record, onReload } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const [form] = Form.useForm();

  // radio status
  const [valueRadio, setValueRadio] = useState(record.status === "active" ? "active" : "inactive");
  const onChange = (e) => {
    setValueRadio(e.target.value);
  };
  // radio status


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
        const response = await listCategory(token, "", "");

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

  // Tạo options cho Select 


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
    e.status = e.status ? "active" : "inactive";
    e.parent_id = !e.parent_id ? "" : e.parent_id;
    e.description = !e.description ? "" : e.description;
    e.position = !e.position ? "" : Number(e.position);
    e.thumbnail = imageUrl ? imageUrl : "";

    try {
      const response = await editCategory(record._id, e, token);
      if (response.code === 200) {
        message.success("Cập nhật thành công");
        onReload();
        handleCancel();
      } else {
        if (Array.isArray(response.message)) {
          const allErrors = response.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error("Lỗi " + error.message);
    }

  };

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

  // loại bỏ danh mục hiện tại và con của nó
  const newCategories = categories.filter((item) =>
    item._id !== record._id && item.parent_id !== record._id
  );

  // Gọi hàm để tạo danh sách Select
  const options = buildSelectOptions(newCategories);
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
              <Form.Item label="Tiêu đề" name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Danh mục cha" name="parent_id">
                <Select options={options} allowClear placeholder="Chọn danh mục cha" />
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
                <UploadFile onImageUrlsChange={setImageUrl} initialImageUrls={imageUrl} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
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
              <Form.Item name="btn">
                <Button type="primary" htmlType="submit">
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

export default CategoriesEdit;
