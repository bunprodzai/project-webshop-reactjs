import { Card, Table, Tag, Form, Row, Col, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { getCookie } from "../../../helpers/cookie";
import DeleteItem from '../../../components/DeleteItem';
import { changeStatusCategory, listCategory } from '../../../services/admin/categoryServies';
import CategoriesEdit from '../CategoriesEdit';
import NoRole from '../../../components/NoRole';

function CategoriesList() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [data, setData] = useState([]);
  const token = getCookie("token");
  // sort 
  const [sortKey, setSortKey] = useState();
  const [sortType, setSortType] = useState();


  const fetchApi = async () => {
    const key = sortKey || ""; // Nếu sortKey là undefined, gán giá trị rỗng
    const type = sortType || ""; // Nếu sortType là undefined, gán giá trị rỗng
    const response = await listCategory(token, key, type);
    if (response.code === 200) {
      setData(response.productsCategory);
    } else {
      setData([]);
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, sortType])

  const handleReload = () => {
    fetchApi();
  }

  // Data đổ vào table
  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (_, record) => {
        return (
          <>
            <img
              src={record.thumbnail}
              alt="Uploaded"
              style={{ width: "70px", display: "block", marginTop: "10px" }}
            />
          </>
        )
      }
    },
    {
      title: 'Danh mục cha',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (_, record) => {
        const parent = data.find(item => item._id === record.parent_id);
        return (
          <>
            {parent ? (
              <p>
                {parent.title}
              </p>
            ) : (
              <p></p>
            )}
          </>
        );
      }
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          <>

            {record.status === "inactive" ? (
              <Tag color={"#cd201f"} key={`inactive-${record._id}`} data-id={`active-${record._id}`} onClick={handleCLickStatus} style={{ cursor: "pointer" }} >
                Ngừng hoạt động
              </Tag>
            ) : (
              <Tag color={"#55acee"} key={`active-${record._id}`} data-id={`inactive-${record._id}`} onClick={handleCLickStatus} style={{ cursor: "pointer" }} >
                Hoạt động
              </Tag>
            )}
          </>
        )
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => {
        return (
          <>
            <div>
              {permissions.includes("products_category_edit") && (
                <CategoriesEdit record={record} key={`edit-${record._id}`} onReload={handleReload} />
              )}
              {permissions.includes("products_category_del") && (
                <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="product-category" onReload={handleReload} />
              )}
            </div>
          </>
        )
      }
    }
  ];

  const handleCLickStatus = (e) => {
    const id = e.target.attributes[0].value.split("-")[1];
    const statusChange = e.target.attributes[0].value.split("-")[0];

    const fetchApiChangeStatus = async () => {
      const response = await changeStatusCategory(token, statusChange, id);

      if (response.code === 200) {
        message.success("Thay đổi trạng thái thành công");
        handleReload();
      } else {
        message.error("Thay đổi trạng thái không thành công!")
      }
    }
    fetchApiChangeStatus();
  }

  const onFinish = (e) => {

  }

  const handleChangePosition = (e) => {
    setSortType(e);
    setSortKey("position");
  }

  return (
    <>
      {permissions.includes("products_category_view") ?
        <Card title="Danh mục sản phẩm">
          <Form onFinish={onFinish} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col span={4}>
                <Form.Item label="Sắp xếp theo vị trí" name="sortPrice" initialValue="">
                  <Select
                    onChange={handleChangePosition}
                    options={[
                      {
                        label: "Mặc định",
                        value: ""
                      },
                      {
                        label: "Tăng",
                        value: "asc"
                      },
                      {
                        label: "Giảm",
                        value: "desc"
                      }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Table
              dataSource={data}
              columns={columns}
              className='table-list'
              rowKey="_id" // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
              pagination={{
                pageSize: 5, // Số mục trên mỗi trang
                total: data.length, // Tổng số mục (dựa trên data)
                showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                style: { display: 'flex', justifyContent: 'center' }, // Căn giữa phân trang
              }}
            />
          </Card>
        </Card>
        :
        <NoRole />
      }
    </>
  )
}

export default CategoriesList;