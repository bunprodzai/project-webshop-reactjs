import { useEffect, useState } from "react";
import { editInfoPatch, infoGet, resetPassowrdPatch } from "../../../services/client/userServies";
import { getCookie, setCookie } from "../../../helpers/cookie";
import { Avatar, Button, Card, Col, Form, Input, message, Row, Select, Tabs } from "antd";
import { UserOutlined } from "@ant-design/icons"
import "./InfoUser.scss";
import { useNavigate } from "react-router-dom";
import UploadFile from "../../../components/UploadFile";
const { Option } = Select

function InfoUser() {
  const tokenUser = getCookie("tokenUser");
  const [infoUser, setInfoUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [formInfo] = Form.useForm();
  const [formChangePassword] = Form.useForm();

  // eslint-disable-next-line no-unused-vars
  const [avatar, setAvatar] = useState("");

  const navigate = useNavigate();

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
      return data; // ✅ return để dùng ngay
    } catch (error) {
      console.error("Error fetching provinces:", error);
      message.error("Không thể tải danh sách tỉnh/thành phố");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (provinceCode) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://provinces.open-api.vn/api/p/" + provinceCode + "?depth=2"
      );
      const data = await response.json();
      setDistricts(data.districts || []);
      setWards([]);
      formInfo.setFieldsValue({ district: undefined, ward: undefined });
      return data.districts || []; // ✅ return để dùng ngay
    } catch (error) {
      console.error("Error fetching districts:", error);
      message.error("Không thể tải danh sách quận/huyện");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://provinces.open-api.vn/api/d/" + districtCode + "?depth=2"
      );
      const data = await response.json();
      setWards(data.wards || []);
      formInfo.setFieldsValue({ ward: undefined });
      return data.wards || []; // ✅ return để dùng ngay
    } catch (error) {
      console.error("Error fetching wards:", error);
      message.error("Không thể tải danh sách phường/xã");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // const fetchApi = async () => {
  //   try {
  //     const response = await infoGet(tokenUser);
  //     form.setFieldsValue(response.data);
  //     setAvatar(response.data.avatar);
  //     setInfoUser(response.data);
  //   } catch (error) {
  //     message.error(error.message)
  //   }
  // }
  const fetchApi = async () => {
    try {
      const response = await infoGet(tokenUser);
      const userData = response.data;
      setAvatar(userData.avatar);
      setInfoUser(userData);

      if (userData.address) {
        const parts = userData.address.split(",").map((p) => p.trim());

        // Luôn lấy 3 phần cuối cùng làm tỉnh, quận, phường
        const provinceName = parts[parts.length - 1];
        const districtName = parts[parts.length - 2];
        const wardName = parts[parts.length - 3];

        // Phần còn lại gộp lại thành địa chỉ chi tiết
        const addressDetail = parts.slice(0, parts.length - 3).join(", ");

        const normalize = (str) =>
          str?.toLowerCase().normalize("NFC").trim();

        // ✅ dùng provinces đã fetch ở init
        const allProvinces = provinces.length ? provinces : await fetchProvinces();

        const province = allProvinces.find(
          (p) => normalize(p.name) === normalize(provinceName)
        );

        if (province) {
          const allDistricts = await fetchDistricts(province.code);
          const district = allDistricts.find((d) => normalize(d.name) === normalize(districtName));

          if (district) {
            const allWards = await fetchWards(district.code);
            const ward = allWards.find((w) => normalize(w.name) === normalize(wardName));

            formInfo.setFieldsValue({
              province: province.code,
              district: district?.code,
              ward: ward?.code,
              address: addressDetail,
              fullName: userData.fullName,
              phone: userData.phone,
              email: userData.email,
            });
            return;
          }
        }

        // fallback nếu không match
        formInfo.setFieldsValue(userData);
      } else {
        formInfo.setFieldsValue(userData);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchProvinces();   // load tỉnh trước
      await fetchApi();         // sau đó mới chạy logic parse địa chỉ
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeInfo = async (e) => {
    // Tìm tên tương ứng từ code
    const provinceName = provinces.find((p) => p.code === e.province)
    const districtName = districts.find((d) => d.code === e.district)
    const wardName = wards.find((w) => w.code === e.ward)
    // Ghép lại thành địa chỉ đầy đủ
    const fullAddress =
      e.address +
      ", " +
      (wardName ? wardName.name : "") +
      ", " +
      (districtName ? districtName.name : "") +
      ", " +
      (provinceName ? provinceName.name : "")
    e.tokenUser = tokenUser;
    e.address = fullAddress;

    const info = {
      fullName: e.fullName,
      address: e.address,
      phone: e.phone,
      email: e.email,
      avatar: avatar
    }

    try {
      const resChangeInfo = await editInfoPatch(info, tokenUser);
      if (resChangeInfo.code === 200) {
        setCookie("fullName", e.fullName, 24);
        setCookie("email", e.email, 24);
        fetchApi();
        message.success(resChangeInfo.message);
      } else {
        if (Array.isArray(resChangeInfo.message)) {
          const allErrors = resChangeInfo.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(resChangeInfo.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  const handleChangePassword = async (e) => {
    try {
      const resChangePassword = await resetPassowrdPatch(e, tokenUser);
      if (resChangePassword.code === 200) {
        navigate("/logout");
      } else {
        if (Array.isArray(resChangePassword.message)) {
          const allErrors = resChangePassword.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(resChangePassword.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  const handleEdit = () => {
    setIsEdit(!isEdit);
  }

  const handleProvinceChange = (value) => {
    fetchDistricts(value)
  }

  const handleDistrictChange = (value) => {
    fetchWards(value)
  }

  const filterOption = (input, option) => {
    if (option && option.children) {
      return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    return false
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
            <Form onFinish={handleChangeInfo} layout="horizontal" form={formInfo}
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
                  <Form.Item label="Ảnh đại diện" name="avatar">
                    <UploadFile onImageUrlsChange={setAvatar}
                      initialImageUrls={infoUser.avatar} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Họ tên" name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
                    <Input style={{ width: "400px" }} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Số điện thoại" name="phone"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
                    <Input style={{ width: "400px" }} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Email" name="email"
                    rules={[{ required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" }
                    ]}>
                    <Input style={{ width: "400px" }} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Tỉnh/TP"
                    name="province"
                    rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
                  >
                    <Select
                      placeholder="Chọn tỉnh/thành phố"
                      size="small"
                      loading={loading}
                      onChange={handleProvinceChange}
                      showSearch
                      filterOption={filterOption}
                      style={{ width: "400px" }}
                    >
                      {provinces.map((province) => (
                        <Option key={province.code} value={province.code}>
                          {province.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Quận/Huyện"
                    name="district"
                    rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                  >
                    <Select
                      placeholder="Chọn quận/huyện"
                      size="small"
                      loading={loading}
                      onChange={handleDistrictChange}
                      disabled={districts.length === 0}
                      showSearch
                      filterOption={filterOption}
                      style={{ width: "400px" }}
                    >
                      {districts.map((district) => (
                        <Option key={district.code} value={district.code}>
                          {district.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Phường/Xã"
                    name="ward"
                    rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
                  >
                    <Select
                      placeholder="Chọn phường/xã"
                      size="small"
                      loading={loading}
                      disabled={wards.length === 0}
                      showSearch
                      filterOption={filterOption}
                      style={{ width: "400px" }}
                    >
                      {wards.map((ward) => (
                        <Option key={ward.code} value={ward.code}>
                          {ward.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Địa chỉ cụ thể" name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}>
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
            <Form onFinish={handleChangePassword} layout="horizontal" form={formChangePassword}
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
