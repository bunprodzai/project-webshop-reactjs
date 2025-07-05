import { Button, Card, Avatar, Tag, Typography, Row, Col, Space, Image } from "antd"
import {
  ArrowRightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { useEffect } from "react"
import { listCategoriesGet } from "../../../services/client/categoriesServies"

const { Title, Paragraph, Text } = Typography

const posts = [
  {
    id: 1,
    title: "Hướng dẫn học React từ cơ bản đến nâng cao",
    excerpt:
      "Khám phá cách xây dựng ứng dụng web hiện đại với React. Từ những khái niệm cơ bản đến các kỹ thuật nâng cao.",
    image: "https://scontent.fdad8-2.fna.fbcdn.net/v/t39.30808-6/515258395_1910340139800856_4980892016469184756_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=uqKJLpPsa_gQ7kNvwGpCFYB&_nc_oc=Adnqjo0zvIeZOVxvxx-JpcxP0gOcslvCpJmgro_sGyIgtum6eWFLeCw97S0xoXBYapOMbrIh_stuCipYPr3JX0ZW&_nc_zt=23&_nc_ht=scontent.fdad8-2.fna&_nc_gid=45_mtBox3ir6vTxZKi_K9Q&oh=00_AfOBsn_wqzNJIXJBvPkukweq2Ssh2qIH_5-RymNOQflZuQ&oe=686D2C7D",
    author: "Nguyễn Văn A",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "15 Tháng 12, 2024",
    readTime: "5 phút đọc",
    category: "Lập trình",
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    id: 2,
    title: "Thiết kế UI/UX hiệu quả cho ứng dụng mobile",
    excerpt: "Những nguyên tắc thiết kế quan trọng giúp tạo ra trải nghiệm người dùng tuyệt vời trên thiết bị di động.",
    image: "/placeholder.svg?height=200&width=400",
    author: "Trần Thị B",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "12 Tháng 12, 2024",
    readTime: "7 phút đọc",
    category: "Thiết kế",
    tags: ["UI/UX", "Mobile", "Design"],
  },
  {
    id: 3,
    title: "Tối ưu hóa hiệu suất website với Next.js",
    excerpt:
      "Khám phá các kỹ thuật tối ưu hóa hiệu suất để website của bạn tải nhanh hơn và trải nghiệm người dùng tốt hơn.",
    image: "/placeholder.svg?height=200&width=400",
    author: "Lê Văn C",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "10 Tháng 12, 2024",
    readTime: "6 phút đọc",
    category: "Web Development",
    tags: ["Next.js", "Performance", "SEO"],
  },
  {
    id: 4,
    title: "Xu hướng công nghệ 2025: AI và Machine Learning",
    excerpt: "Tìm hiểu về những xu hướng công nghệ mới nhất và cách chúng sẽ thay đổi cách chúng ta làm việc.",
    image: "/placeholder.svg?height=200&width=400",
    author: "Phạm Thị D",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "8 Tháng 12, 2024",
    readTime: "8 phút đọc",
    category: "Công nghệ",
    tags: ["AI", "Machine Learning", "Trends"],
  },
  {
    id: 5,
    title: "Bảo mật ứng dụng web: Những điều cần biết",
    excerpt: "Hướng dẫn chi tiết về cách bảo vệ ứng dụng web khỏi các mối đe dọa bảo mật phổ biến.",
    image: "/placeholder.svg?height=200&width=400",
    author: "Hoàng Văn E",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "5 Tháng 12, 2024",
    readTime: "10 phút đọc",
    category: "Bảo mật",
    tags: ["Security", "Web", "Backend"],
  },
  {
    id: 6,
    title: "DevOps và CI/CD: Tự động hóa quy trình phát triển",
    excerpt: "Tìm hiểu cách thiết lập quy trình CI/CD hiệu quả để tăng tốc độ phát triển và triển khai ứng dụng.",
    image: "/placeholder.svg?height=200&width=400",
    author: "Vũ Thị F",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "3 Tháng 12, 2024",
    readTime: "9 phút đọc",
    category: "DevOps",
    tags: ["DevOps", "CI/CD", "Automation"],
  },
]

export default function Article() {

  const [categories, setCategories] = useState(["Tất cả"]);
  const [articles, setArticles] = useState([]);

  // {
  //   id: 1,
  //   title: "Hướng dẫn học React từ cơ bản đến nâng cao",
  //   excerpt:
  //     "Khám phá cách xây dựng ứng dụng web hiện đại với React. Từ những khái niệm cơ bản đến các kỹ thuật nâng cao.",
  //   image: "https://scontent.fdad8-2.fna.fbcdn.net/v/t39.30808-6/515258395_1910340139800856_4980892016469184756_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=uqKJLpPsa_gQ7kNvwGpCFYB&_nc_oc=Adnqjo0zvIeZOVxvxx-JpcxP0gOcslvCpJmgro_sGyIgtum6eWFLeCw97S0xoXBYapOMbrIh_stuCipYPr3JX0ZW&_nc_zt=23&_nc_ht=scontent.fdad8-2.fna&_nc_gid=45_mtBox3ir6vTxZKi_K9Q&oh=00_AfOBsn_wqzNJIXJBvPkukweq2Ssh2qIH_5-RymNOQflZuQ&oe=686D2C7D",
  //   author: "Nguyễn Văn A",
  //   authorAvatar: "/placeholder.svg?height=40&width=40",
  //   date: "15 Tháng 12, 2024",
  //   readTime: "5 phút đọc",
  //   category: "Lập trình",
  //   tags: ["React", "JavaScript", "Frontend"],
  // }

  useEffect(() => {

    const fetchApi = async () => {
      const responseCategories = await listCategoriesGet();
      if (responseCategories.code === 200) {
        responseCategories.productsCategory.map((item) => {
          setCategories((prev) => [...prev, item.title]);
        });
      }
    }

    fetchApi();

  }, []);


  return (
    <>
      {/* Featured Post */}
      <div style={{ padding: "80px 24px", backgroundColor: "#f8f9fa" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <Title level={2}>Bài viết nổi bật</Title>
            <Paragraph style={{ color: "#666", fontSize: "1.1rem" }}>
              Những bài viết được quan tâm nhất tuần này
            </Paragraph>
          </div>

          <Card hoverable style={{ overflow: "hidden" }} bodyStyle={{ padding: 0 }}>
            <Row gutter={0}>
              <Col xs={24} md={12}>
                <div style={{ height: 300, position: "relative" }}>
                  <Image
                    src={posts[0].image || "/placeholder.svg"}
                    alt={posts[0].title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ padding: 32 }}>
                  <Space style={{ marginBottom: 16 }}>
                    <Tag color="blue">{posts[0].category}</Tag>
                    <Text type="secondary">
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      {posts[0].date}
                    </Text>
                    <Text type="secondary">
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {posts[0].readTime}
                    </Text>
                  </Space>

                  <Title level={3} style={{ marginBottom: 16 }}>
                    {posts[0].title}
                  </Title>

                  <Paragraph
                    style={{
                      color: "#666",
                      marginBottom: 24,
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {posts[0].excerpt}
                  </Paragraph>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space>
                      <Avatar src={posts[0].authorAvatar} icon={<UserOutlined />} />
                      <Text strong>{posts[0].author}</Text>
                    </Space>

                    <Button type="primary" icon={<ArrowRightOutlined />} iconPosition="end">
                      Đọc tiếp
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      {/* Posts Section */}
      <div style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <Title level={2}>Bài viết mới nhất</Title>
            <Paragraph style={{ color: "#666", fontSize: "1.1rem" }}>
              Cập nhật những kiến thức và xu hướng mới nhất
            </Paragraph>
          </div>

          {/* Categories Filter */}
          <div style={{ marginBottom: 40 }}>
            <Space wrap>
              {categories.map((category) => (
                <Button key={category} type={category === "Tất cả" ? "primary" : "default"} shape="round">
                  {category}
                </Button>
              ))}
            </Space>
          </div>

          {/* Posts Grid */}
          <Row gutter={[24, 24]}>
            {posts.slice(1).map((post) => (
              <Col xs={24} sm={12} lg={8} key={post.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: 200, overflow: "hidden" }}>
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={200}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </div>
                  }
                  actions={[<Button key="read" type="text" icon={<ArrowRightOutlined />} />]}
                >
                  <div style={{ marginBottom: 12 }}>
                    <Space>
                      <Tag color="blue">{post.category}</Tag>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {post.readTime}
                      </Text>
                    </Space>
                  </div>

                  <Title
                    level={4}
                    style={{
                      marginBottom: 12,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.title}
                  </Title>

                  <Paragraph ellipsis={{ rows: 3 }} style={{ color: "#666", marginBottom: 16 }}>
                    {post.excerpt}
                  </Paragraph>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Space>
                      <Avatar size="small" src={post.authorAvatar} icon={<UserOutlined />} />
                      <div>
                        <Text strong style={{ fontSize: "12px" }}>
                          {post.author}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          {post.date}
                        </Text>
                      </div>
                    </Space>
                  </div>

                  <Space wrap>
                    {post.tags.map((tag) => (
                      <Tag key={tag} style={{ fontSize: "11px" }}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Load More Button */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Button size="large" icon={<ArrowRightOutlined />} iconPosition="end">
              Xem thêm bài viết
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}