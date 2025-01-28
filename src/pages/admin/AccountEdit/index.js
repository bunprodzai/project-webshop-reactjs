import { Button, Col, Form, Input, message, Modal, Radio, Row, Select, Upload } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { listRoleGet } from "../../../services/admin/rolesServies";
import { editAccountPatch } from "../../../services/admin/accountServies";

function AccountEdit(props) {

  const { record, onReload } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Danh sách quyền
  const [roles, setRoles] = useState([]);

  const [form] = Form.useForm();

  // radio
  const [valueRadio, setValueRadio] = useState(record.status === "active" ? "active" : "inactive");

  const onChange = (e) => {
    setValueRadio(e.target.value);
  };
  
  // upload img
  const [imageUrl, setImageUrl] = useState(record.avatar);
  const [fileList, setFileList] = useState([]);
  // upload img

  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }

      try {
        const response = await listRoleGet(token);

        if (response) {
          setRoles(response.roles);
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách quyền:", error.message);
      }
    };

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tạo options cho Select 
  const options = roles.map((category) => ({
    label: category.title, // Hiển thị title trong Select
    value: category._id,   // Giá trị _id khi submit
  }));

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // xử lý edit
  const onFinish = async (e) => {
    e.avatar = imageUrl ? imageUrl : "";
    e.role_id = !e.role_id ? "" : e.role_id;

    if (!e.fullName) {
      message.error("Vui lòng nhập tên!");
      return;
    }

    if (!e.email) {
      message.error("Vui lòng nhập email!");
      return;
    }

    if (e.password === undefined) {
      delete e.password;
    }

    // Kiểm tra số điện thoại
    if (!e.phone) {
      e.phone = "";
    } else {
      // Kiểm tra xem số điện thoại có phải là một chuỗi gồm toàn số và có độ dài 10 không
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(e.phone)) {
        message.error("Số điện thoại phải là 10 chữ số và không chứa ký tự!");
        return;
      }
    }

    const response = await editAccountPatch(record._id, e, token);
    if (response.code === 200) {
      message.success("Cập nhật thành công")
      onReload();
      handleCancel();
    } else {
      message.error(response.message);
    }
  };


  // upload img
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
      console.error("Lỗi khi upload ảnh:", error);
      onError(error);
    }
  };
  const handleRemove = () => {
    setImageUrl(""); // Xóa link ảnh
    setFileList([]); // Xóa danh sách file
  }
  // upload img
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
              <Form.Item label="Họ tên" name="fullName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Phân quyền" name="role_id">
                <Select options={options} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Password" name="password">
                <Input type="password" placeholder="Nhập mật khẩu mới nếu muốn thay đổi" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ảnh nhỏ" name="avatar">
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

export default AccountEdit;