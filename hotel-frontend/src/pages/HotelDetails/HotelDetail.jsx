import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Spin,
  Tag,
  Rate,
  Image,
  Button,
  Row,
  Col,
  Empty,
  Checkbox,
  Space,
} from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { getHotelById } from "@/service/hotelService";
import {
  getAvailableRoomTypes,
  getRoomTypesByHotel,
} from "@/service/roomTypeService";
import { getServicesByHotel } from "@/service/serviceService";
import Search from "@/components/Search/Search";
import "./HotelDetails.scss";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import HotelReviews from "@/components/HotelReview/HotelReviews";
import ReportModal from "@/components/ReportModal/ReportModal";

// --- COMPONENT CON: RoomSelectionPanel ---
const RoomSelectionPanel = ({ roomType, hotelId, onAddToCart }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServicesByHotel(hotelId)
      .then((data) => setServices(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [hotelId]);

  const handleAddToCartClick = () => {
    const selectedServiceDetails = services.filter((s) =>
      selectedServices.includes(s.id)
    );
    onAddToCart(roomType, selectedServiceDetails);
  };

  if (loading)
    return (
      <div className="panel-loading">
        <Spin />
      </div>
    );

  return (
    <div className="room-selection-panel">
      <h4>Add Services for: {roomType.name}</h4>
      {services.length > 0 ? (
        <Checkbox.Group
          onChange={setSelectedServices}
          className="services-checkbox-group"
        >
          <Space direction="vertical">
            {services.map((s) => (
              <Checkbox key={s.id} value={s.id}>
                {s.name} -{" "}
                <span className="service-price">
                  {s.price.toLocaleString()} VND
                </span>
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      ) : (
        <p>No additional services available for this hotel.</p>
      )}
      <Button
        type="primary"
        onClick={handleAddToCartClick}
        style={{ marginTop: "16px" }}
      >
        Add to Booking
      </Button>
    </div>
  );
};

// --- COMPONENT CON: BookingSummary ---
const BookingSummary = ({ cart, onRemoveItem, onCheckout }) => {
  if (cart.length === 0) return null;

  const checkoutData = useSelector((state) => state.checkoutReducer);
  const isLogin = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const { checkIn, checkOut } = checkoutData;
  const totalNights = dayjs(checkOut).diff(dayjs(checkIn), "day") || 1;

  const total = cart.reduce((acc, item) => {
    const roomTotal = (item.price || 0) * totalNights;
    const servicesTotal = item.selectedServices.reduce(
      (sAcc, s) => sAcc + s.price,
      0
    );
    return acc + roomTotal + servicesTotal;
  }, 0);

  const handleCheckoutClick = () => {
    if (isLogin) {
      onCheckout();
    } else {
      toast.error("Please log in to continue your booking.");
      dispatch({ type: "OPEN_LOGIN_MODAL" });
    }
  };

  return (
    <div className="booking-summary-bar">
      <div className="summary-details">
        <h4>Your Selection</h4>
        <ul>
          {cart.map((item, index) => (
            <li key={item.cartItemId}>
              <div>
                <span>1 x {item.roomType.name}</span>
                <Button
                  type="link"
                  danger
                  onClick={() => onRemoveItem(index)}
                >
                  Remove
                </Button>
                {item.selectedServices.length > 0 && (
                  <div className="summary-services">
                    Services:{" "}
                    {item.selectedServices.map((s) => s.name).join(", ")}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="summary-action">
        <span className="total-price">
          Total: {total.toLocaleString()} VND
        </span>
        <Button type="primary" size="large" onClick={handleCheckoutClick}>
          Go to checkout
        </Button>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH: HotelDetail ---
const HotelDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchState = useSelector((state) => state.searchReducer);
  const checkoutData = useSelector((state) => state.checkoutReducer);
  const userDetails = useSelector((state) => state.userReducer);
  const { cart: bookingCart, hotel: hotelInCart } = checkoutData;

  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRoomTypeId, setOpenRoomTypeId] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const checkIn = searchState.dates?.[0]
    ? dayjs(searchState.dates[0]).format("YYYY-MM-DD")
    : null;
  const checkOut = searchState.dates?.[1]
    ? dayjs(searchState.dates[1]).format("YYYY-MM-DD")
    : null;

  useEffect(() => {
    const hotelId = parseInt(id);
    if (!hotelId) return;

    if (hotelInCart && hotelInCart.id !== hotelId) {
      dispatch({ type: "CLEAR_CHECKOUT_DATA" });
      toast.info(
        "Your cart has been cleared as you are viewing a different hotel."
      );
    }

    const fetchHotelData = async () => {
      setLoading(true);
      try {
        const hotelData = await getHotelById(hotelId);
        setHotel(hotelData);

        let roomTypeData;
        if (checkIn && checkOut) {
          roomTypeData = await getAvailableRoomTypes(hotelId, checkIn, checkOut);
        } else {
          roomTypeData = await getRoomTypesByHotel(hotelId);
        }
        setRoomTypes(roomTypeData || []);
      } catch (err) {
        setError("Failed to load hotel details.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [id, checkIn, checkOut, dispatch, hotelInCart]);

  if (loading)
    return (
      <div className="hotel-detail-loading">
        <Spin size="large" />
      </div>
    );
  if (error || !hotel)
    return (
      <div className="hotel-detail-error">
        <h1>Hotel not found</h1>
        <p>{error}</p>
      </div>
    );

  const handleToggleSelect = (roomTypeId) => {
    setOpenRoomTypeId((prev) => (prev === roomTypeId ? null : roomTypeId));
  };

  const handleAddToCart = (roomType, selectedServices) => {
    if (!checkIn || !checkOut) {
      toast.error(
        "Please select your check-in and check-out dates in the search bar above before adding a room."
      );
      return;
    }

    const newItem = {
      cartItemId: `${roomType.id}-${Date.now()}`,
      roomType,
      selectedServices,
      price: roomType.newPrice || roomType.pricePerNight,
    };

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        item: newItem,
        hotel: hotel,
        checkIn: checkIn,
        checkOut: checkOut,
      },
    });

    setOpenRoomTypeId(null);
    toast.success(`${roomType.name} added to booking.`);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { index: indexToRemove },
    });
    toast.info("Item removed from booking.");
  };

  const handleGoToCheckout = () => {
    navigate("/checkout");
  };

  const handleStartChat = () => {
    if (!userDetails) {
      toast.error("You must be logged in to chat.");
      dispatch({ type: "OPEN_LOGIN_MODAL" });
      return;
    }
    dispatch({
      type: "START_CHAT_WITH",
      payload: {
        recipientId: hotel.owner.id,
        recipientName: hotel.owner.username,
        hotelId: hotel.id,
      },
    });
    navigate("/chat");
  };

  const handleOpenReportModal = () => {
    if (!userDetails) {
      toast.error("You must be logged in to report.");
      dispatch({ type: "OPEN_LOGIN_MODAL" });
      return;
    }
    setReportTarget({ type: "HOTEL", id: hotel.id, name: hotel.name });
    setIsReportModalOpen(true);
  };

  const isOwner = userDetails && userDetails.id === hotel.owner.id;

  return (
    <>
      <div className="hotel-detail">
        <div className="hotel-detail__search-bar">
          <Search />
        </div>

        <h1>{hotel.name}</h1>
        <div className="hotel-rating-header">
          <Rate disabled allowHalf value={hotel.rating || 0} />
          <span className="review-summary">
            {hotel.rating?.toFixed(1)} Excellent
          </span>
          <span>({hotel.reviewCount} reviews)</span>
          <Tag
            color={hotel.status === "ACTIVE" ? "green" : "orange"}
            style={{ marginLeft: 16 }}
          >
            {hotel.status}
          </Tag>
        </div>

        <div className="hotel-location-chat-wrapper">
          <p className="hotel-location">
            <EnvironmentOutlined /> {hotel.address}
          </p>
          <Space>
            {!isOwner && (
              <Button
                className="report-hotel-btn"
                icon={<FlagOutlined />}
                onClick={handleOpenReportModal}
                danger
                type="text"
              >
                Report this property
              </Button>
            )}
            {!isOwner && (
              <Button
                className="chat-with-hotel-btn"
                icon={<MessageOutlined />}
                onClick={handleStartChat}
              >
                Chat with hotel
              </Button>
            )}
          </Space>
        </div>

        <div className="gallery-section">
          <Image.PreviewGroup>
            <Row gutter={[8, 8]} className="gallery-row">
              <Col xs={24} md={12}>
                <div className="main-image-wrapper">
                  <Image
                    src={
                      hotel.images?.[0] ||
                      "https://via.placeholder.com/800x600?text=No+Image"
                    }
                    alt="Hotel gallery 1"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <Row gutter={[8, 8]} className="sub-images-row">
                  {hotel.images
                    ?.slice(1, 5)
                    .map((img, index) => (
                      <Col xs={12} key={index}>
                        <div className="thumb-image-wrapper">
                          <Image src={img} alt={`Hotel gallery ${index + 2}`} />
                        </div>
                      </Col>
                    ))}
                  {hotel.images?.slice(1, 5).length < 4 &&
                    Array.from({
                      length: 4 - hotel.images?.slice(1, 5).length,
                    }).map((_, index) => (
                      <Col xs={12} key={`placeholder-${index}`}>
                        <div className="thumb-image-wrapper placeholder-image">
                          <Image
                            src="https://via.placeholder.com/400x300?text=No+Image"
                            alt="Placeholder"
                          />
                        </div>
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
          </Image.PreviewGroup>
        </div>

        <div className="description-section">
          <h3>About this property</h3>
          <p>{hotel.description}</p>
        </div>

        <div className="rooms-section">
          <h3>
            Available Room Types{" "}
            {checkIn &&
              `from ${dayjs(checkIn).format("DD/MM/YYYY")} to ${dayjs(
                checkOut
              ).format("DD/MM/YYYY")}`}
          </h3>

          {roomTypes.length > 0 ? (
            roomTypes.map((rt) => {
              const roomsOfThisTypeInCart = bookingCart.filter(
                (item) => item.roomType.id === rt.id
              ).length;
              const hasAvailabilityInfo =
                rt.availableRoomsCount !== undefined;
              const actualRoomsLeft = hasAvailabilityInfo
                ? rt.availableRoomsCount - roomsOfThisTypeInCart
                : 999;

              const isAvailable =
                rt.status === "ACTIVE" &&
                (hasAvailabilityInfo ? actualRoomsLeft > 0 : true);
              const hasDiscount =
                rt.newPrice && rt.oldPrice && rt.newPrice < rt.oldPrice;

              return (
                <React.Fragment key={rt.id}>
                  <Card
                    className={`room-card-customer ${!isAvailable ? "disabled" : ""
                      }`}
                  >
                    <Row gutter={[24, 24]} align="middle">
                      <Col xs={24} md={8}>
                        <Image
                          src={
                            rt.images?.[0] ||
                            "https://via.placeholder.com/400x300?text=No+Image"
                          }
                          alt={rt.name}
                          className="room-image"
                        />
                      </Col>
                      <Col xs={24} md={10}>
                        <h4>{rt.name}</h4>
                        <p>{rt.description}</p>
                        <div className="amenities-list">
                          {rt.amenities?.slice(0, 4).map((amenity) => (
                            <span
                              key={amenity.id}
                              className="amenity-tag"
                            >
                              <CheckCircleOutlined /> {amenity.name}
                            </span>
                          ))}
                        </div>
                      </Col>
                      <Col xs={24} md={6} className="booking-details">
                        <div className="price-info">
                          {hasDiscount && (
                            <span className="old-price">
                              {rt.oldPrice?.toLocaleString()} VND
                            </span>
                          )}
                          <span className="price-value">
                            {(rt.newPrice || rt.pricePerNight)?.toLocaleString()}{" "}
                            VND
                          </span>
                          <span className="price-suffix">/ night</span>
                        </div>

                        {hasAvailabilityInfo && isAvailable && (
                          <Tag color={actualRoomsLeft > 5 ? "green" : "orange"}>
                            Only {actualRoomsLeft} rooms left!
                          </Tag>
                        )}
                        {!isAvailable && <Tag color="red">Sold Out</Tag>}
                        {!hasAvailabilityInfo && isAvailable && (
                          <Tag color="blue">
                            Press Search to check availability
                          </Tag>
                        )}

                        <Button
                          type="primary"
                          className="booking-button"
                          disabled={!isAvailable}
                          onClick={() => handleToggleSelect(rt.id)}
                        >
                          {openRoomTypeId === rt.id
                            ? "Close"
                            : "Select Room"}
                        </Button>
                      </Col>
                    </Row>
                  </Card>

                  {openRoomTypeId === rt.id && (
                    <RoomSelectionPanel
                      roomType={rt}
                      hotelId={id}
                      onAddToCart={handleAddToCart}
                    />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <Empty
              description={
                checkIn
                  ? "No available room types found for the selected dates."
                  : "This hotel has not listed any rooms yet."
              }
            />
          )}
        </div>

        <div className="reviews-section">
          <h3>Guest Reviews</h3>
          <HotelReviews hotelId={id} />
        </div>

        {hotelInCart && hotelInCart.id === parseInt(id) && (
          <BookingSummary
            cart={bookingCart}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleGoToCheckout}
          />
        )}

        <ReportModal
          open={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          target={reportTarget}
        />
      </div>
    </>
  );
};

export default HotelDetail;
