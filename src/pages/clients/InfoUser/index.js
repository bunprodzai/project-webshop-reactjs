import { useEffect, useState } from "react";
import { editInfoPatch, infoGet, resetPassowrdPatch } from "../../../services/client/userServies";
import {  getCookie, setCookie } from "../../../helpers/cookie";
import { Avatar, Button, Card, Col, Form, Input, message, Row, Tabs } from "antd";
import { UserOutlined } from "@ant-design/icons"
import "./InfoUser.scss";
import { useNavigate } from "react-router-dom";

function InfoUser() {
  const tokenUser = getCookie("tokenUser");
  const [infoUser, setInfoUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await infoGet(tokenUser);
        form.setFieldsValue(response.user);
        setInfoUser(response.user);
      } catch (error) {

      }
    }

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeInfo = async (e) => {
    e.tokenUser = tokenUser;
    console.log(e);
    try {
      const resChangeInfo = await editInfoPatch(e, tokenUser);
      if (resChangeInfo.code === 200) {
        setCookie("fullName", e.fullName, 24);
        setCookie("email", e.email, 24);
        message.success(resChangeInfo.message);
      } else {
        message.error(resChangeInfo.message);
      }
    } catch (error) {
      message.error(error);
    }
  }

  const handleChangePassword = async (e) => {
    e.tokenUser = tokenUser;
    try {
      const resChangePassword = await resetPassowrdPatch(e, tokenUser);
      if (resChangePassword.code === 200) {
        navigate("/logout");
        message.success(resChangePassword.message);
      } else {
        message.error(resChangePassword.message);
      }
    } catch (error) {

    }
  }

  const handleEdit = () => {
    setIsEdit(!isEdit);
  }

  const items = [
    {
      key: 'cod',
      label: <>Thông tin cá nhân</>,
      children:
        <div className="card-info__info">
          <Card title="Thông tin cá nhân"
            extra={
              isEdit ? <Button onClick={handleEdit}>Hủy</Button> : <Button onClick={handleEdit}>Chỉnh sửa</Button>
            }>
            <Form onFinish={handleChangeInfo} layout="horizontal" form={form}
              labelCol={{
                span: 4,
              }}
              style={{
                maxWidth: 600,
              }}
              disabled={!isEdit}
            >
              <Row>
                <Col span={24}>
                  <Form.Item label="Họ tên" name="fullName" >
                    <Input style={{ width: "400px" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input style={{ width: "400px" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Email" name="email">
                    <Input style={{ width: "400px" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input style={{ width: "400px" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    {isEdit ? (<Button type="primary" htmlType="submit" name="btn">
                      Cập nhập
                    </Button>) : (<></>)}

                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>,
    },
    {
      key: 'bank',
      label: <>Thay đổi mật khẩu?</>,
      children: <>
        <div className="card-info__info">
          <Card title="Thay đổi mật khẩu">
            <Form onFinish={handleChangePassword} layout="horizontal" form={form}
              labelCol={{
                span: 6
              }}
            >
              <Row>
                <Col span={24}>
                  <Form.Item label="Mật khẩu cũ"
                    name="passwordOld"
                    rules={[
                      {
                        required: true,
                        message: 'Nhập mật khẩu cũ!',
                      },
                    ]}>
                    <Input.Password type="" style={{ width: "300px" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mật khẩu mới"
                    name="passwordNew"
                    rules={[
                      {
                        required: true,
                        message: 'Nhập mật khẩu mới!',
                      },
                    ]}>
                    <Input.Password style={{ width: "300px" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Xác nhận mật khẩu mới"
                    name="passwordNewComfirm"
                    rules={[
                      {
                        required: true,
                        message: 'Nhập lại mật khẩu!',
                      },
                    ]}>
                    <Input.Password style={{ width: "300px" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" name="btn">
                      Thay đổi
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </>,
    }
  ];

  return (
    <>
      <Row gutter={[24, 24]}>
        {infoUser && (
          <>
            <Col span={24}>
              <div className="card-info__menu">
                <Card title={<><Avatar size={50} src={infoUser.avatar} icon={<UserOutlined />} /> {infoUser.fullName}</>}>
                  <Tabs defaultActiveKey="cod" tabPosition={"left"} items={items} type="card" onChange={onchange} />
                </Card>
              </div>
            </Col>
          </>
        )}
      </Row >
    </>
  )
}

export default InfoUser;
