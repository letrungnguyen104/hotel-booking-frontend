import React from "react";
import "./Homepage.scss";
import { Col, Input, Row, Form, DatePicker, Dropdown, Space, Button, Carousel, Tabs } from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import RoomListHome from "@/components/RoomListHome/RoomListHome";

const { RangePicker } = DatePicker;

const Homepage = () => {
  const items = [
    { key: "1", label: "1 Adult" },
    { key: "2", label: "2 Adults" },
    { key: "3", label: "3 Adults" },
  ];

  const itemsTab = [
    {
      key: '1',
      label: 'Ha Noi',
      children: <RoomListHome />,
    },
    {
      key: '2',
      label: 'Da Nang',
      children: <RoomListHome />,
    },
    {
      key: '3',
      label: 'Ho Chi Minh',
      children: <RoomListHome />,
    },
  ];

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="form">
          <h1 className="form__title--main">
            RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN "YÊU THƯƠNG"
          </h1>

          <Form className="form__main">
            <Form.Item>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <div className="form__title">Search Your Room</div>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Input
                    className="form__search"
                    prefix={<SearchOutlined className="form__icon" />}
                    placeholder="Search location..."
                  />
                </Col>
              </Row>

              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <RangePicker
                    placeholder={["Check in", "Check out"]}
                    format="DD-MM-YYYY"
                    className="form__date"
                  />
                </Col>
                <Col span={12}>
                  <Dropdown
                    menu={{
                      items,
                      selectable: true,
                      defaultSelectedKeys: ["3"],
                    }}
                    trigger={["click"]}
                  >
                    <div className="form__dropdown">
                      <Space>
                        Number of People
                        <DownOutlined />
                      </Space>
                    </div>
                  </Dropdown>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ "alignItems": "center", "marginTop": "20px" }}>
                  <Button className="form__button" type="primary" icon={<SearchOutlined />}>
                    Search
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </section>
      <section className="container">
        <div className="home">
          <div className="home__locations">
            <div className="home__title">The most attractive destinations in Vietnam</div>
            <div className="home__slider">
              <Carousel arrows infinite={false}>
                <div className="home__items">
                  <Row gutter={[20, 20]}>
                    <Col span={4}>
                      <div className="home__item">
                        <div className="home__img">
                          <img src="https://pix6.agoda.net/geo/city/2758/065f4f2c9fa263611ab65239ecbeaff7.jpg?ce=0&s=375x&ar=1x1" alt="" />
                        </div>
                        <div className="home__location">
                          Ha Noi
                        </div>
                        <p className="home__quantity">
                          15.000 rooms
                        </p>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="home__item">
                        <div className="home__img">
                          <img src="https://pix6.agoda.net/geo/city/13170/1_13170_02.jpg?ca=6&ce=1&s=375x&ar=1x1" alt="" />
                        </div>
                        <div className="home__location">
                          Ho Chi Minh
                        </div>
                        <p className="home__quantity">
                          15.000 rooms
                        </p>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="home__item">
                        <div className="home__img">
                          <img src="https://pix6.agoda.net/geo/city/16440/1_16440_02.jpg?ca=6&ce=1&s=375x&ar=1x1" alt="" />
                        </div>
                        <div className="home__location">
                          Da Nang
                        </div>
                        <p className="home__quantity">
                          15.000 rooms
                        </p>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="home__item">
                        <div className="home__img">
                          <img src="https://pix6.agoda.net/geo/city/3738/1_3738_02.jpg?ca=6&ce=1&s=375x&ar=1x1" alt="" />
                        </div>
                        <div className="home__location">
                          Hue
                        </div>
                        <p className="home__quantity">
                          15.000 rooms
                        </p>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="home__item">
                        <div className="home__img">
                          <img src="https://pix6.agoda.net/geo/city/17190/1_17190_02.jpg?ca=6&ce=1&s=375x&ar=1x1" alt="" />
                        </div>
                        <div className="home__location">
                          Vung Tau
                        </div>
                        <p className="home__quantity">
                          15.000 accommodations
                        </p>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div className="home__item">
                        <div className="home__img">
                          <img src="https://pix6.agoda.net/geo/city/17182/1_17182_02.jpg?ca=6&ce=1&s=375x&ar=1x1" alt="" />
                        </div>
                        <div className="home__location">
                          Ha Long
                        </div>
                        <p className="home__quantity">
                          15.000 rooms
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <h3>Next Page</h3>
                </div>
                <div>
                  <h3>Next Page</h3>
                </div>
                <div>
                  <h3>Next Page</h3>
                </div>
              </Carousel>
            </div>
          </div>
          <div className="home__locations">
            <div className="home__title">Featured accommodations recommended for you</div>
            <div className="home__tab">
              <Tabs defaultActiveKey="1" items={itemsTab} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
