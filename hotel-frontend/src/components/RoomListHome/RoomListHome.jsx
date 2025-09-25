import { Card, Col, Rate, Row } from 'antd';
import React from 'react';
import "./RoomListHome.scss";
import { EnvironmentOutlined } from "@ant-design/icons"

const RoomListHome = () => {
  const roomList = [
    {
      id: 1,
      name: "Pynt Hotel 2",
      location: "Go Vap, Ho Chi Minh",
      price: "VND 449.234",
      rating: 4,
      score: 8.8,
      image: "https://pix8.agoda.net/hotelImages/63227000/0/bb9bcb3b36fa90f9c77276bd89f883ae.jpg?ce=0&s=375x",
    },
    {
      id: 2,
      name: "Siris Niko Residence - Self Checkin",
      location: "District 7, Ho Chi Minh",
      price: "VND 307.538",
      rating: 3,
      score: 8.0,
      image: "https://pix8.agoda.net/hotelImages/55495024/-1/9d3e925576608b548fc1762b00ea65ee.jpg?ce=0&s=375x",
    },
    {
      id: 3,
      name: "Cozrum Homes Charming Corner",
      location: "District 3, Ho Chi Minh",
      price: "VND 348.221",
      rating: 3,
      score: 7.4,
      image: "https://pix8.agoda.net/hotelImages/13752940/-1/682945f2f6c3991768e001edc472a217.jpg?ca=13&ce=1&s=375x",
    },
    {
      id: 4,
      name: "LUNA Luxury Residence - Vinhomes Landmark",
      location: "Binh Thanh, Ho Chi Minh",
      price: "VND 1.113.044",
      rating: 4,
      score: 8.2,
      image: "https://pix8.agoda.net/hotelImages/64896973/0/ea760dc311d7749c106a56a6044e9760.jpeg?ce=0&s=375x",
    },
  ];

  return (
    <Row gutter={[20, 20]} className="room-list">
      {roomList.map((room) => (
        <Col span={6} key={room.id}>
          <Card
            hoverable
            className="room-card"
            cover={
              <div className="room-card__image-wrapper">
                <div className="room-card__image">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="room-card__image"
                  />
                </div>
                <span className="room-card__score">{room.score}</span>
              </div>
            }
          >
            <h4 className="room-card__title">{room.name}</h4>
            <div className="room-card__location"><EnvironmentOutlined />{room.location}</div>
            <Rate disabled defaultValue={room.rating} className="room-card__rating" />
            <div className="room-card__price">{room.price}</div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default RoomListHome;