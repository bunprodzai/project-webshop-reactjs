import { useState, useEffect } from "react"
import { Card, Rate, Button, Form, Input, message, Avatar, Empty, Modal, Badge } from "antd"
import { UserOutlined, DeleteOutlined, ExclamationCircleFilled, CrownOutlined, TeamOutlined } from "@ant-design/icons"
import { productReplyDelete, productReviewAddReply, productReviewDelete, productReviewPost, productReviewsGet } from "../../../services/client/productServies"
import { getCookie } from "../../../helpers/cookie"
import { addProductReviewReplyByAdmin, delProductReplyByAdmin, delProductReviewByAdmin } from "../../../services/admin/productServies"
import {
  handleDeleteReview,
  handleDeleteReply,
  handleSubmitReplyCustomer,
  handleSubmitReview
} from "./handleCustomer";

import {
  handleDeleteReviewByAdmin,
  handleDeleteReplyByAdmin,
  handleSubmitReplyByAdmin
} from "./handleAdmin";
const { confirm } = Modal;
const { TextArea } = Input



const ReviewProduct = ({ productId }) => {

  const [tokenUser] = useState(getCookie("tokenUser"));
  const [token] = useState(getCookie("token"));
  const currentUserId = getCookie("userId");

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm();

  // State cho reply customer
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyForm] = Form.useForm();

  // State cho reply customer
  const [replyingReviewAdmin, setReplyingReviewAdmin] = useState(null);
  const [replyFormAdmin] = Form.useForm();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await productReviewsGet(productId);
      if (res.code === 200) {
        setReviews(res.data);
      }
    } catch (error) {
      message.error("Không thể tải đánh giá. Vui lòng thử lại!")
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách đánh giá khi component mount
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenUser])

  // Xử lý mở modal khi customer bấm Trả lời, lưu review hiện tại vào replyingReview
  const handleReplyClick = (review) => {
    setReplyingReview(review);
  };

  // --------------------------------------------------------------------//
  //                            ADMIN
  // Xử lý mở modal khi admin bấm Trả lời, lưu review hiện tại vào replyingReview
  const handleReplyClickAdmin = (review) => {
    setReplyingReviewAdmin(review);
  };

  // Lấy badge theo role
  function getRoleBadge(role) {
    const badges = {
      admin: { text: "Admin", color: "red" },
      customer: { text: "Khách hàng", color: "green" },
    };
    return badges[role] || badges.customer;
  }

  const renderReview = (review) => (
    < div key={review._id} className="mb-6" >
      <div className="flex items-start gap-3">
        <Avatar icon={<UserOutlined />} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">{review.user.fullName}     <Badge count={getRoleBadge(review.role || "customer").text}
                color={getRoleBadge(review.role || "customer").color}
                style={{ fontSize: "10px" }}
              />
              </h4>
              <Rate disabled value={review.rating} />
              <span className="ml-2 text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleString()}
              </span>
            </div>
            <div>

              {/* Customer xóa và trả lời review */}
              {tokenUser && (
                <Button type="link" size="small" onClick={() => handleReplyClick(review)}>
                  Trả lời
                </Button>
              )}
              {currentUserId === review.user._id && (
                <Button size="small" icon={<DeleteOutlined />}
                  onClick={() => handleDeleteReview(review._id, tokenUser, setReviews)}
                />
              )}

              {/* Admin xóa và trả lời review */}
              {token && (
                <>
                  <Button className="ml-2" variant="outlined" danger size="small" onClick={() => handleReplyClickAdmin(review)}>
                    Trả lời
                  </Button>
                  <Button className="ml-2" size="small" icon={<DeleteOutlined />} danger
                    onClick={() => handleDeleteReviewByAdmin(review._id, token, setReviews)}
                  />
                </>
              )}
            </div>
          </div>
          <p className="mb-3">{review.content}</p>

          {/* Danh sách reply (chỉ 1 cấp) */}
          {review.replies.length > 0 && (
            <div className="ml-8 border-l pl-4">
              {review.replies.map((reply) => (
                <div key={reply.id} className="flex items-center justify-between mb-2">
                  {reply.user === null ? (
                    <>
                      <div>
                        <h5 className="font-medium">Shop online     <Badge count={getRoleBadge(review.role || "admin").text}
                          color={getRoleBadge(reply.role || "admin").color}
                          style={{ fontSize: "10px" }}
                        /></h5>
                        <p className="text-gray-700">{reply.content}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {/* Admin xóa reply */}
                      {token && (
                        <>
                          <Button className="ml-2" size="small" icon={<DeleteOutlined />} danger
                            onClick={() => handleDeleteReplyByAdmin(review._id, reply._id, token, fetchReviews)}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <h5 className="font-medium">{reply.user.fullName}     <Badge count={getRoleBadge(review.role || "customer").text}
                          color={getRoleBadge(reply.role || "customer").color}
                          style={{ fontSize: "10px" }}
                        /></h5>
                        <p className="text-gray-700">{reply.content}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        {/* Customer xóa reply */}
                        {currentUserId === reply.user._id && (
                          <Button size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteReply(review._id, reply._id)} />
                        )}

                        {/* Admin xóa reply */}
                        {token && (
                          <>
                            <Button className="ml-2" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDeleteReplyByAdmin(review._id, reply._id)} />
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Form reply */}
          {replyingReview?._id === review._id && (
            <Card size="small" className="mt-3">
              <Form form={replyForm} layout="vertical"
                onFinish={(e) => handleSubmitReplyCustomer
                  (replyingReview, e, tokenUser, fetchReviews, replyForm, setReplyingReview, setSubmitting)}
              >
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "Vui lòng nhập nội dung trả lời!" }]}
                >
                  <TextArea rows={3} placeholder="Nhập trả lời của bạn..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="small">
                    Gửi
                  </Button>
                  <Button
                    size="small"
                    className="ml-2"
                    onClick={() => setReplyingReview(null)}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Form reply Admin*/}
          {replyingReviewAdmin?._id === review._id && (
            <Card size="small" className="mt-3">
              <Form form={replyFormAdmin} layout="vertical"
                onFinish={(e) => handleSubmitReplyByAdmin
                  (replyingReviewAdmin, e, token, fetchReviews, replyFormAdmin, setReplyingReviewAdmin)}
              >
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "Vui lòng nhập nội dung trả lời!" }]}
                >
                  <TextArea rows={3} placeholder="Nhập trả lời của bạn..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" danger size="small">
                    Gửi
                  </Button>
                  <Button
                    size="small"
                    className="ml-2"
                    danger
                    onClick={() => setReplyingReviewAdmin(null)}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </div>
      </div>
    </ div>
  );

  // Tính điểm trung bình
  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0

  return (
    <div className="product-reviews">
      {/* Thống kê tổng quan */}
      <Card className="mb-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Đánh giá sản phẩm</h3>
          <div className="flex items-center justify-center gap-4 mb-2">
            <Rate disabled value={Number.parseFloat(averageRating)} allowHalf />
            <span className="text-2xl font-bold text-orange-500">{averageRating}</span>
          </div>
          <p className="text-gray-500">Dựa trên {reviews.length} đánh giá</p>
        </div>
      </Card>

      {/* Form đánh giá mới */}
      {tokenUser && (
        <Card title="Viết đánh giá của bạn" className="mb-6">
          <Form form={form} layout="vertical"
            onFinish={(e) => handleSubmitReview
              (productId, e, setReviews, tokenUser, form, setSubmitting)}
            initialValues={{ rating: 5 }}>
            <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}>
              <Rate />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung đánh giá"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung đánh giá!" },
                { min: 10, message: "Nội dung phải có ít nhất 10 ký tự!" },
              ]}
            >
              <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..." maxLength={500} showCount />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
                Gửi đánh giá
              </Button>
            </Form.Item>
          </Form>
        </Card>)}

      {/* Danh sách đánh giá */}
      <Card title={`Tất cả đánh giá (${reviews.length})`}>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải đánh giá...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Empty description="Chưa có đánh giá nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="space-y-4">
            {reviews.map(renderReview)}
          </div>
        )}
      </Card>
    </div>
  )
}

export default ReviewProduct;
