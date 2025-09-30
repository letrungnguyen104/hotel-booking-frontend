import { Card, Col, Rate, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import "./RoomListHome.scss";
import { EnvironmentOutlined } from "@ant-design/icons";
import { topFiveHotel } from "@/service/hotelService";

const RoomListHome = ({ city }) => {
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(true);
  const PATH_IMG = `http://localhost:8081`

  console.log(city);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    const fetchApi = async () => {
      try {
        const hotels = await topFiveHotel(city);
        console.log(hotels);
        setRoomList(hotels);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [city]);


  if (loading) return <Spin />;

  return (
    <Row gutter={[20, 20]} className="room-list">
      {loading ? (
        <Col span={24} style={{ textAlign: "center" }}>
          <Spin />
        </Col>
      ) : (
        roomList.map((room) => (
          <Col span={6} key={room.id}>
            <Card
              hoverable
              className="room-card"
              cover={
                <div className="room-card__image-wrapper">
                  <div className="room-card__image">
                    <img
                      src={`${PATH_IMG}${room.image}`}
                      alt={room.name}
                      className="room-card__image"
                    />
                  </div>
                  {typeof room.score === "number" && (
                    <span className="room-card__score">{room.score}</span>
                  )}

                </div>
              }
            >
              <h4 className="room-card__title">{room.name}</h4>
              <div className="room-card__location">
                <EnvironmentOutlined /> {room.city}
              </div>
              <Rate
                disabled
                defaultValue={room.rating}
                className="room-card__rating"
              />
              <div className="room-card__price">
                {room.price ? `$ ${room.price}` : "N/A"}
              </div>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );

};

export default RoomListHome;