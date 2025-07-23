import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { Card, message, Table, Tag } from "antd";
import DeleteItem from "../../../components/DeleteItem";
import { listArticleGet } from "../../../services/admin/articleServies";
import ArticleEdit from "../ArticleEdit";
import NoRole from "../../../components/NoRole";

function ArticleList() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [articles, setArticles] = useState([]);
  const token = getCookie("token");

  const fetchApi = async () => {
    try {
      const response = await listArticleGet(token);

      if (response.code === 200) {
        setArticles(response.articles);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu vai trò!');
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReload = () => {
    fetchApi();
  }

  const handleCLickStatus = (e) => {
    // const id = e.target.attributes[0].value.split("-")[1];
    // const statusChange = e.target.attributes[0].value.split("-")[0];

    // const fetchApiChangeStatus = async () => {
    //   const response = await changeStatusProduct(token, statusChange, id);

    //   if (response.code === 200) {
    //     message.success("Thay đổi trạng thái thành công");
    //     handleReload();
    //   } else {
    //     message.error("Thay đổi trạng thái không thành công!")
    //   }
    // }
    // fetchApiChangeStatus();
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Data đổ vào table
  const columns = [
    {
      title: 'Tiều đề',
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
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Nổi bật?',
      dataIndex: 'featured',
      key: 'featured',
      render: (_, record) => {
        return (
          <>
            {record.featured === "1" ? (
              <Tag color={"#7FC25D"} key={`inactive-${record._id}`}
                style={{
                  cursor: "pointer",
                  userSelect: "none"
                }} >
                Nổi bật
              </Tag>
            ) : (
              <Tag color={"#cd201f"} key={`active-${record._id}`}
                style={{
                  cursor: "pointer",
                  userSelect: "none"
                }}>
                Không nổi bật
              </Tag>
            )}
          </>
        )
      }
    }, {
      title: 'Người tạo',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, record) => {
        return (
          <>
            <p>{record.fullName || 'N/A'}</p>
            <b>{record.createdAt ? formatDate(record.updatedAt) : 'N/A'}</b>
          </>
        );
      }
    },
    {
      title: 'Cập nhật bởi',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      render: (_, record) => {
        const latestUpdate = record.updatedBy?.[record.updatedBy.length - 1];
        return (
          <>
            <p>{latestUpdate?.fullName || 'N/A'}</p>
            <b>{latestUpdate ? formatDate(latestUpdate.updatedAt) : 'N/A'}</b>
          </>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          <>
            {record.status === "inactive" ? (
              <Tag color={"#cd201f"} key={`inactive-${record._id}`}
                data-id={`active-${record._id}`}
                onClick={handleCLickStatus}
                style={{
                  cursor: "pointer",
                  userSelect: "none"
                }} >
                Ngừng hoạt động
              </Tag>
            ) : (
              <Tag color={"#55acee"} key={`active-${record._id}`}
                data-id={`inactive-${record._id}`}
                onClick={handleCLickStatus}
                style={{
                  cursor: "pointer",
                  userSelect: "none"
                }} >
                Hoạt động
              </Tag >
            )
            }
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
              {permissions.includes("articles_edit") && (
                <ArticleEdit record={record} key={`edit-${record._id}`} onReload={handleReload} />
              )}
              {permissions.includes("articles_del") && (
                <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="article" onReload={handleReload} />
              )}
            </div>
          </>
        )
      }
    }
  ];

  return (
    <>
      {permissions.includes("articles_view") ?
        <Card title="Danh sách sản phẩm" style={{ height: "100vh" }}>
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Table
              dataSource={articles}
              columns={columns}
              className='table-list'
              rowKey="_id" // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
              pagination={{
                pageSize: 5, // Số mục trên mỗi trang
                total: articles.length, // Tổng số mục (dựa trên data)
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

export default ArticleList;