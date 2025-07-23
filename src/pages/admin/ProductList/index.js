import { Button, Card, Input, Table, Tag, Form, Row, Col, Select, message } from 'antd';
import "./ListProduct.scss";
import { useEffect, useState } from 'react';
import { changeStatusProduct, listProducts } from '../../../services/admin/productServies';
import { getCookie } from "../../../helpers/cookie";
import DeleteItem from '../../../components/DeleteItem';
import ProductEdit from '../ProductEdit';
import NoRole from '../../../components/NoRole';

function ProductList() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const [data, setData] = useState([]);
  const token = getCookie("token");
  // tổng số trang để phân trang
  const [totalPage, setTotalPage] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(10);

  // page hiện tại đang đứng
  const [currentPage, setCurrentPage] = useState(1);

  // keyword tìm kiếm
  const [keyword, setKeyword] = useState("");
  // sort 
  const [sortKey, setSortKey] = useState("");
  const [sortType, setSortType] = useState("asc");

  
  const fetchApi = async () => {
    const response = await listProducts(token, currentPage, limit, keyword, sortKey, sortType);

    if (response.code === 200) {
      console.log(response);
      
      setData(response.products);
      setTotalPage(response.totalPage);
    } else {
      setData([]);
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, keyword, sortKey, sortType])

  const handleReload = () => {
    fetchApi();
  }

  // Data đổ vào table
  const columns = [
    {
      title: 'Tên sản phẩm',
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Số lượng',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
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
              {permissions.includes("products_edit") && (
                <ProductEdit record={record} key={`edit-${record._id}`} onReload={handleReload} />
              )}
              {permissions.includes("products_del") && (
                <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="product" onReload={handleReload} />
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
      const response = await changeStatusProduct(token, statusChange, id);

      if (response.code === 200) {
        message.success("Thay đổi trạng thái thành công");
        handleReload();
      } else {
        message.error("Thay đổi trạng thái không thành công!")
      }
    }
    if (permissions.includes("products_edit")) {
      fetchApiChangeStatus();
    } else {
      message.error("Bạn không có quyền chỉnh sửa sản phẩm!")
    }
  }

  const onFinish = (e) => {
    setKeyword(e.keyword);
  }

  const handleChangePrice = (e) => {
    setSortType(e);
    setSortKey("price");
  }
  const handleChangePosition = (e) => {
    setSortType(e);
    setSortKey("stock");
  }

  return (
    <>
      {permissions.includes("products_view") ?
        <Card title="Danh sách sản phẩm">
          <Form onFinish={onFinish} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col span={22}>
                <Form.Item name="keyword" >
                  <Input
                    allowClear
                    type="text"
                    placeholder='Tìm kiếm'
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name='btnSearch'>
                  <Button type="primary" htmlType="submit" >Tìm kiếm</Button>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Giá" name="sortPrice" initialValue="">
                  <Select
                    onChange={handleChangePrice}
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
              <Col span={4}>
                <Form.Item label="Số lượng" name="sortStock" initialValue="">
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
                pageSize: limit, // Số mục trên mỗi trang
                total: limit * totalPage, // Tổng số mục (dựa trên data)
                showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                style: { display: 'flex', justifyContent: 'center' }, // Căn giữa phân trang
              }}
              onChange={(page, pageSize) => {
                setCurrentPage(page.current); // Cập nhật trang hiện tại
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

export default ProductList;