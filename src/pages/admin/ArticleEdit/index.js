import { Button, Col, Form, Input, message, Modal, Radio, Row, Upload } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getCookie } from "../../../helpers/cookie";
import { editArticlePatch } from "../../../services/admin/articleServies";

function ArticleEdit(props) {
  const { record, onReload } = props;
  const token = getCookie("token");
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  // radio
  const [valueRadio, setValueRadio] = useState(record.status === "active" ? "active" : "inactive");

  const [valueRadioFeatured, setValueRadioFeatured] = useState(record.featured === "1" ? "1" : "0");

  const onChange = (e) => {
    setValueRadio(e.target.value);
  };

  const onChangeFeatured = (e) => {
    setValueRadioFeatured(e.target.value);
  }

  // upload img
  const [imageUrl, setImageUrl] = useState(record.thumbnail);
  const [fileList, setFileList] = useState([]);
  // upload img


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
    e.position = !e.position ? "" : Number(e.position);
    e.description = !e.description ? "" : e.description;
    e.featured = valueRadioFeatured;

    console.log(e);
    console.log(record);
    
    const response = await editArticlePatch(record._id, e, token);
    if (response.code === 200) {
      message.success("Cập nhật thành công");
      onReload();
      handleCancel();
    } else {
      message.error(response.message);
    }
  };

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
              <Form.Item label="Vị trí" name="position" >
                <Input
                  allowClear
                  type="number"
                  placeholder="Tự tăng"
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Nổi bật?" name="featured" style={{marginLeft: "10px"}}>
                <Radio.Group onChange={onChangeFeatured} value={valueRadioFeatured}>
                  <Radio value="1">Bật</Radio>
                  <Radio value="0">Tắt</Radio>
                </Radio.Group>
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
