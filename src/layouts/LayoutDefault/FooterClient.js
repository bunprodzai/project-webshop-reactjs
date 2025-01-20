import { Col, Layout, Row } from "antd";
import { EnvironmentOutlined, FacebookOutlined, PhoneOutlined, } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { settingGeneralGet } from "../../services/client/settingServies";
const { Footer } = Layout;

function FooterClient() {
  const [setting, setSetting] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await settingGeneralGet();
        setSetting(response.settings);
      } catch (error) {
      }
    };

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Footer className="layout-default__footer">
        <div className="container">
          <div className="content">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <ul>
                  <li>LIÊN HỆ</li>
                  <li>
                    <EnvironmentOutlined style={{ marginRight: "5px" }} />
                    {setting.address}
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      <FacebookOutlined style={{ marginRight: "5px" }} />
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href={setting.instagram} target="_blank" rel="noreferrer">
                      <FacebookOutlined style={{ marginRight: "5px" }} />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <PhoneOutlined style={{ marginRight: "5px" }} />
                    {setting.phone}
                  </li>
                </ul>
              </Col>
              <Col span={6}>
                <ul>
                  <li>HỖ TRỢ KHÁCH HÀNG</li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Hướng dẫn mua hàng trực tuyến
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Hướng dẫn thanh toán
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Hướng dẫn mua hàng trả góp
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Check Hoá đơn điện tử
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Liên hệ góp ý
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={6}>
                <ul>
                  <li>VỀ CHÚNG TÔI</li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Giới thiệu về công ty
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Hệ thống cửa hàng
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Tuyển dụng
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={6}>
                <ul>
                  <li>CHĂM SÓC KHÁCH HÀNG</li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Chính sách bảo hành
                    </a>
                  </li>
                  <li>
                    <a href={setting.facebook} target="_blank" rel="noreferrer">
                      Chính sách đổi trả sản phẩm
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
          <div className="copy-right">
            <p>Copyright © 2024 bundepzai.zz. Design by Bunz.vn</p>
          </div>
        </div>
      </Footer>
    </>
  )
}

export default FooterClient;