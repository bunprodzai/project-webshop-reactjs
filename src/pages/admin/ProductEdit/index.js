import { Button, Col, Form, Input, message, Modal, Radio, Row, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { editProduct } from "../../../services/admin/productServies";
import { getCookie } from "../../../helpers/cookie";
import { listCategory } from "../../../services/admin/categoryServies";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import UploadFiles from "../../../components/UploadFiles";

function ProductEdit(props) {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const { record, onReload } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [categories, setCategories] = useState([]);

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
  const [thumbnailUrl, setThumbnailUrl] = useState(record.thumbnail);
  const [imageUrls, setImageUrls] = useState(record.images || []);
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
  }, [thumbnailUrl]);

  // Tạo options cho Select 
  const options = categories.map((category) => ({
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

  const onFinish = async (e) => {
    e.thumbnail = thumbnailUrl ? thumbnailUrl : "";
    e.images = imageUrls ? imageUrls : [];
    e.position = !e.position ? "" : Number(e.position);
    e.product_category_id = !e.product_category_id ? "" : e.product_category_id;
    e.description = !e.description ? "" : e.description;
    e.featured = valueRadioFeatured;
    e.price = Number(e.price);
    e.stock = Number(e.stock);
    e.discountPercentage = Number(e.discountPercentage);

    const response = await editProduct(record._id, e, token);
    if (response.code === 200) {
      message.success("Cập nhật thành công");
      onReload();
      handleCancel();
    } else {
      message.error(response.message);
    }
  };

  return (
    <>
      {permissions.includes("products_view") ?
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
                  <Form.Item label="Danh mục" name="product_category_id">
                    <Select options={options} />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Giá" name="price">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Số lượng" name="stock">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Phần trăm giảm giá" name="discountPercentage">
                    <Input allowClear />
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
                  <Form.Item label="Nổi bật?" name="featured">
                    <Radio.Group onChange={onChangeFeatured} value={valueRadioFeatured}>
                      <Radio value="1">Bật</Radio>
                      <Radio value="0">Tắt</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ảnh nhỏ" name="thumbnail">
                    <UploadFile onImageUrlsChange={setThumbnailUrl} initialImageUrls={thumbnailUrl} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ảnh mô tả" name="images">
                    <UploadFiles onImageUrlsChange={setImageUrls} initialImageUrls={imageUrls} />
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
        :
        <NoRole />
      }
    </>
  );
}

export default ProductEdit;
