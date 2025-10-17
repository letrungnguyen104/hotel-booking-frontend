// src/pages/Homepage/Homepage.jsx

import React, { useState, useEffect } from "react";
import "./Homepage.scss";
import { Col, Row, Form, DatePicker, Button, Carousel, Tabs, Select, AutoComplete } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import RoomListHome from '../RoomListHome/RoomListHome';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { toast } from "sonner";
import { getProvinces } from "@/service/locationService";
import { useDispatch } from 'react-redux';
import { setSearchParams } from "@/action/search";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Homepage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [provinces, setProvinces] = useState([]);
  const [options, setOptions] = useState([]);

  const locations = [
    { name: "Ha Noi", img: "https://pix6.agoda.net/geo/city/2758/065f4f2c9fa263611ab65239ecbeaff7.jpg?ce=0&s=375x&ar=1x1", quantity: "15.000 rooms" },
    { name: "Ho Chi Minh", img: "https://pix6.agoda.net/geo/city/13170/1_13170_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 rooms" },
    { name: "Da Nang", img: "https://pix6.agoda.net/geo/city/16440/1_16440_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 rooms" },
    { name: "Hue", img: "https://pix6.agoda.net/geo/city/3738/1_3738_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 rooms" },
    { name: "Vung Tau", img: "https://pix6.agoda.net/geo/city/17190/1_17190_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 accommodations" },
    { name: "Ha Long", img: "https://pix6.agoda.net/geo/city/17182/1_17182_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 rooms" },
  ];

  const itemsTab = [
    { key: "1", label: "Ha Noi", children: <RoomListHome city="Ha Noi" /> },
    { key: "2", label: "Da Nang", children: <RoomListHome city="Da Nang" /> },
    { key: "3", label: "Ho Chi Minh", children: <RoomListHome city="Ho Chi Minh" /> },
  ];

  useEffect(() => {
    getProvinces().then(data => {
      if (data) {
        setProvinces(data);
      }
    });
  }, []);

  const handleSearch = (searchText) => {
    if (!searchText) {
      setOptions([]);
    } else {
      const filteredProvinces = provinces.filter(province =>
        province.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .includes(searchText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      );
      setOptions(filteredProvinces.map(p => ({ value: p.name })));
    }
  };

  const onFinish = (values) => {
    const { address, dates, guests } = values;
    if (!address || !dates || !guests) {
      toast.error("Please fill in all search fields!");
      return;
    }
    dispatch(setSearchParams({ address, dates, guests }));
    navigate('/search');
  };

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="form">
          <h1 className="form__title--main">
            RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN "YÊU THƯƠNG"
          </h1>
          <Form form={form} className="form__main" onFinish={onFinish}>
            <div className="form__title">Search Your Room</div>

            <div className="form__search-wrapper">
              <SearchOutlined className="form__icon" />
              <Form.Item name="address" rules={[{ required: false, message: 'Please input destination!' }]}>
                <AutoComplete
                  options={options}
                  onSearch={handleSearch}
                  placeholder="Search location..."
                  className="form__search"
                />
              </Form.Item>
            </div>

            <Row gutter={[20, 20]}>
              <Col span={12}>
                <Form.Item name="dates" rules={[{ required: true, message: 'Please select dates!' }]}>
                  <RangePicker
                    format="DD-MM-YYYY"
                    className="form__date"
                    disabledDate={(current) => current && current < dayjs().endOf('day')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="guests" initialValue={2} rules={[{ required: true, message: 'Please select number of guests!' }]}>
                  <Select className="form__select">
                    <Option value={1}>1 Adult</Option>
                    <Option value={2}>2 Adults</Option>
                    <Option value={3}>3 Adults</Option>
                    <Option value={4}>4 Adults</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button className="form__button" type="primary" htmlType="submit" icon={<SearchOutlined />}>
                Search
              </Button>
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
                    {locations.map((loc, index) => (
                      <Col span={4} key={index}>
                        <div className="home__item">
                          <div className="home__img"><img src={loc.img} alt={loc.name} /></div>
                          <div className="home__location">{loc.name}</div>
                          <p className="home__quantity">{loc.quantity}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
                <div><h3>Next Page</h3></div>
                <div><h3>Next Page</h3></div>
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