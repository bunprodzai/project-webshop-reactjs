import { Button, Card, Col, Form, Input, Row, Switch, Radio, Upload, message, Select, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { addArticlePost } from "../../../services/admin/articleServies";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import { listCategory } from "../../../services/admin/categoryServies";

const options = [
  {
    value: 'china',
    desc: 'China (中国)',
  },
  {
    value: 'usa',
    desc: 'USA (美国)',
  },
  {
    value: 'japan',
    desc: 'Japan (日本)',
  },
  {
    value: 'korea',
    desc: 'Korea (韩国)',
  },
];

function ArticleCreate() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = getCookie("token"); // Lấy token từ cookie

  const [categories, setCategories] = useState([]);

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
  }, []);

  // xử lý submit
  const onFinish = async (e) => {
    e.thumbnail = imageUrl ? imageUrl : "";
    e.status = e.status ? "active" : "inactive";

    if (!e.title) {
      message.error("Vui lòng nhập tiêu đề");
      return;
    }

    e.featured = e.featured === 0 ? "0" : "1";
    e.position = !e.position ? "" : Number(e.position);
    e.description = !e.description ? "" : e.description;

    console.log(e);

    // try {
    //   const response = await addArticlePost(e, token); // Truyền token vào hàm
    //   console.log(response);
    //   if (response.code === 200) {
    //     message.success("Thêm mới thành công");
    //     navigate(`/admin/articles`);
    //   } else {
    //     message.error(response.message);
    //   }
    // } catch (error) {
    //   message.error("Lỗi: ", error.message);
    // }
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
                  <Form.Item label="Tiêu đề" name="title">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="Danh mục" name="product_category_id">
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
                <Col span={5}>
                  <Form.Item label="Tags" name="tags" >
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="select one country"
                      defaultValue={['china']}
                      options={options}
                      optionRender={option => (
                        <Space>
                          <span>
                            {option.data.desc}
                          </span>
                        </Space>
                      )}
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
                  <Form.Item name="btn">
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

export default ArticleCreate;