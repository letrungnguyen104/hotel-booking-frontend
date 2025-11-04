import { Card, Col, Rate, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import "./RoomListHome.scss";
import { EnvironmentOutlined } from "@ant-design/icons";
import { topFiveHotel } from "@/service/hotelService";
import { useNavigate } from "react-router-dom";

const RoomListHome = ({ city }) => {
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    const fetchApi = async () => {
      try {
        const hotels = await topFiveHotel(city);
        setRoomList(hotels || []);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setRoomList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [city]);

  const handleHotelClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };


  if (loading) return <div style={{ minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin /></div>;

  return (
    <Row gutter={[20, 20]} className="room-list">
      {roomList.map((room) => (
        <Col span={6} key={room.id}>
          <Card
            hoverable
            className="room-card"
            onClick={() => handleHotelClick(room.id)}
            cover={
              <div className="room-card__image-wrapper">
                <div className="room-card__image">
                  <img
                    src={`${room.image}`}
                    alt={room.name}
                    className="room-card__image"
                  />
                </div>
                {typeof room.rating === "number" && (
                  <span className="room-card__score">{room.rating.toFixed(1)}</span>
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
              allowHalf
              defaultValue={room.rating}
              className="room-card__rating"
            />
            <div className="room-card__price">
              {room.price ? `${room.price.toLocaleString()} VND` : "N/A"}
            </div>
          </Card>
        </Col>
      ))
      }
    </Row>
  );
};

export default RoomListHome;