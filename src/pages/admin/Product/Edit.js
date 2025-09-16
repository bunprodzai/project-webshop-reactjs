import { Button, Card, Col, Form, Input, message, Modal, Radio, Row, Select } from "antd";
import { EditOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getCookie } from "../../../helpers/cookie";
import { listCategory } from "../../../services/admin/categoryServies";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import UploadFiles from "../../../components/UploadFiles";
import useProducts from "../../../hooks/admin/useProducts";

const convertSizeStock = (rawList) => {
  return rawList.map(item => {
    const [size, quantity] = item.split("-");
    return {
      size: size.trim(),
      quantity: parseInt(quantity.trim(), 10)
    };
  });
};

function ProductEdit(props) {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const { record, onReload } = props;

  const token = getCookie("token");

  const { updateProduct } = useProducts({ token: token });

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
      // form.setFieldsValue({
      //   ...record,
      //   sizeStock: convertSizeStock(record.sizeStock || [])
      // });
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
    delete e.stock;
    e.thumbnail = thumbnailUrl ? thumbnailUrl : "";
    e.images = imageUrls ? imageUrls : [];
    e.position = !e.position ? "" : Number(e.position);
    e.product_category_id = !e.product_category_id ? "" : e.product_category_id;
    e.description = !e.description ? "" : e.description;
    e.featured = valueRadioFeatured;
    e.price = Number(e.price);
    e.discountPercentage = Number(e.discountPercentage);

    /* --- chuyển sizeStock trước khi gửi server --- */
    const sizeStockArr = (e.sizeStock || [])
      .filter(v => v.size && v.quantity > 0)
      .map(v => `${v.size}-${v.quantity}`);
    e.sizeStock = sizeStockArr;

    updateProduct.mutate({ id: record._id, data: e }, {
      onSuccess: () => {
        onReload();
        handleCancel();
      }
    });
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
            <Form onFinish={onFinish} layout="vertical" form={form}
              initialValues={{
                ...record,
                sizeStock: convertSizeStock(record.sizeStock || [])
              }}>
              <Row gutter={[16, 16]}>
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
                    <Input type="number" allowClear />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Tổng số lượng" name="stock">
                    <Input allowClear disabled />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Phần trăm giảm giá" name="discountPercentage">
                    <Input allowClear type="number" min={0} max={100} />
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
