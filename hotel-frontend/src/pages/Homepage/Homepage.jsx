// src/pages/Homepage/Homepage.jsx
import React, { useState, useEffect } from "react";
import "./Homepage.scss";
import { Col, Row, Form, DatePicker, Button, Tabs, Select, AutoComplete, Card, FloatButton } from "antd";
import {
  SearchOutlined,
  TagOutlined,
  HomeOutlined,
  ApartmentOutlined,
  StarOutlined,
  LikeOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  MessageOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import RoomListHome from '../RoomListHome/RoomListHome';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { toast } from "sonner";
import { getProvinces } from "@/service/locationService";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchParams } from "@/action/search";
import { useInView } from 'react-intersection-observer';
import { getFeaturedPromotions } from "@/service/promotionService";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Meta } = Card;

const FadeIn = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className={`fade-in-section ${inView ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
};

const locations = [
  { name: "Ha Noi", img: "https://pix6.agoda.net/geo/city/2758/065f4f2c9fa263611ab65239ecbeaff7.jpg?ce=0&s=375x&ar=1x1", quantity: "15.000 rooms" },
  { name: "Ho Chi Minh", img: "https://pix6.agoda.net/geo/city/13170/1_13170_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 rooms" },
  { name: "Da Nang", img: "https://pix6.agoda.net/geo/city/16440/1_16440_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 rooms" },
  { name: "Vung Tau", img: "https://pix6.agoda.net/geo/city/17190/1_17190_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 accommodations" },
  { name: "Ha Long", img: "https://pix6.agoda.net/geo/city/17182/1_17182_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 rooms" },
  { name: "Hue", img: "https://pix6.agoda.net/geo/city/3738/1_3738_02.jpg?ca=6&ce=1&s=375x&ar=1x1", quantity: "15.000 rooms" },
];

const itemsTab = [
  { key: "1", label: "Ha Noi", children: <RoomListHome city="Thành phố Hà Nội" /> },
  { key: "2", label: "Da Nang", children: <RoomListHome city="Thành phố Đà Nẵng" /> },
  { key: "3", label: "Ho Chi Minh", children: <RoomListHome city="Thành phố Hồ Chí Minh" /> },
];

const propertyTypes = [
  { name: "Hotels", icon: <HomeOutlined />, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
  { name: "Apartments", icon: <ApartmentOutlined />, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
  { name: "Resorts", icon: <StarOutlined />, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" },
  { name: "Villas", icon: <HomeOutlined />, img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" },
];

const Homepage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [provinces, setProvinces] = useState([]);
  const [options, setOptions] = useState([]);

  const [featuredOffers, setFeaturedOffers] = useState([]);
  const userDetails = useSelector(state => state.userReducer);

  useEffect(() => {
    getProvinces().then(data => {
      if (data) {
        setProvinces(data);
      }
    });
    getFeaturedPromotions().then(data => {
      if (data) {
        console.log(data);
        setFeaturedOffers(data);
      }
    }).catch(err => {
      console.error("Failed to fetch featured promotions:", err);
    });
  }, []);

  const handleChatWithAdmin = () => {
    if (!userDetails) {
      toast.error("You must be logged in to chat with support.");
      return;
    }

    const ADMIN_ID = 2;
    const ADMIN_USERNAME = "admin";

    dispatch({
      type: 'START_CHAT_WITH',
      payload: {
        recipientId: ADMIN_ID,
        recipientName: ADMIN_USERNAME,
        hotelId: null
      }
    });
    navigate('/chat');
  };

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
    const { city, dates, guests } = values;
    if (!city || !dates || !guests) {
      toast.error("Please fill in all search fields!");
      return;
    }
    dispatch(setSearchParams({ city, dates, guests }));
    navigate('/search');
  };

  const handleViewAllHotels = () => {
    const defaultParams = {
      city: "",
      dates: [dayjs(), dayjs().add(1, 'day')],
      guests: 2
    };
    dispatch(setSearchParams(defaultParams));
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
              <Form.Item name="city" rules={[{ required: false, message: 'Please input destination!' }]}>
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

      <section className="container homepage-content">
        <FadeIn>
          <div className="special-offers">
            <h2 className="home__title">Deals and Special Offers</h2>
            <Row gutter={[24, 24]}>
              {featuredOffers.map((offer, index) => (
                <Col xs={24} md={12} key={index}>
                  <div className="offer-card">
                    <div className="offer-card__image">
                      <img src={offer.imageUrl || 'https://via.placeholder.com/400x300'} alt={offer.title} />
                    </div>
                    <div className="offer-card__content">
                      <h3><TagOutlined /> {offer.title}</h3>
                      <p>{offer.description}</p>
                      <Button type="primary" ghost onClick={() => navigate('/offers')}>
                        View All Deals
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="popular-destinations">
            <h2 className="home__title">Popular Destinations</h2>
            <Row gutter={[20, 20]}>
              {locations.map((loc, index) => (
                <Col xs={12} sm={8} md={4} key={index}>
                  <div className="destination-card">
                    <img src={loc.img} alt={loc.name} />
                    <div className="destination-card__name">{loc.name}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="property-types">
            <h2 className="home__title">Find Your Perfect Stay</h2>
            <Row gutter={[20, 20]}>
              {propertyTypes.map((type, index) => (
                <Col xs={12} sm={6} key={index}>
                  <Card
                    hoverable
                    className="property-type-card"
                    cover={<img alt={type.name} src={type.img} />}
                  >
                    <Meta
                      avatar={type.icon}
                      title={type.name}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="why-book-us">
            <h2 className="home__title">Why Book With Us?</h2>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card className="why-card">
                  <SafetyCertificateOutlined />
                  <h3>Secure Payments</h3>
                  <p>We use certified payment gateways to protect your transactions.</p>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="why-card">
                  <CustomerServiceOutlined />
                  <h3>24/7 Support</h3>
                  <p>Our team is always available to help you with any questions.</p>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="why-card">
                  <LikeOutlined />
                  <h3>Best Price Guarantee</h3>
                  <p>Found a lower price? We'll match it. No questions asked.</p>
                </Card>
              </Col>
            </Row>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="featured-hotels">
            <div className="home__title-wrapper">
              <h2 className="home__title">Featured accommodations</h2>
              <Button type="link" className="view-all-btn" onClick={handleViewAllHotels}>
                View All Hotels <ArrowRightOutlined />
              </Button>
            </div>
            <div className="home__tab">
              <Tabs defaultActiveKey="1" items={itemsTab} />
            </div>
          </div>
        </FadeIn>
      </section>

      {userDetails && (
        <FloatButton
          icon={<MessageOutlined />}
          type="primary"
          tooltip="Chat with Support"
          onClick={handleChatWithAdmin}
          style={{ right: 24, bottom: 24 }}
        />
      )}
    </div>
  );
};

export default Homepage;