import { Button, Col, Form, Input, message, Modal, Radio, Row, Select, Upload } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getCookie } from "../../../helpers/cookie";
import { editCategory, listCategory } from "../../../services/admin/categoryServies";

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
  const [fileList, setFileList] = useState([]);
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

    console.log(record._id, e);
    
    const response = await editCategory(record._id, e, token);
    if (response.code === 200) {
      message.success("Cập nhật thành công");
      onReload();
      handleCancel();
    } else {
      message.error(response.message);
    }
  };

  // upload ảnh
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
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
        setImageUrl(data.secure_url); // Cập nhật link ảnh
        setFileList([
          {
            uid: data.asset_id, // Đảm bảo UID là duy nhất
            name: data.original_filename,
            status: "done",
            url: data.secure_url,
          },
        ]);
        onSuccess(data);
      }
    } catch (error) {
      message.error("Lỗi khi upload ảnh:", error);
      onError(error);
    }
  };
  // upload ảnh


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

  const handleRemove = () => {
    setImageUrl(""); // Xóa link ảnh
    setFileList([]); // Xóa danh sách file
  }
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
              <Form.Item label="Tiêu đề" name="title">
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
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={{ showPreviewIcon: false }}
                  maxCount={1} // Giới hạn chỉ được chọn 1 ảnh
                  customRequest={handleCustomRequest}
                  onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                  onRemove={handleRemove}
                  defaultFileList={[
                    ...(fileList.length
                      ? fileList
                      : [
                        {
                          uid: "-1", // UID duy nhất cho ảnh đã có
                          name: "existing-image", // Tên ảnh có sẵn
                          status: "done",
                          url: imageUrl, // Hiển thị ảnh hiện tại trong preview
                        },
                      ]),
                  ]}
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
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={6} />
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
