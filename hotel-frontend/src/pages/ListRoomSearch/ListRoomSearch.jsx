// src/pages/ListRoomSearch/ListRoomSearch.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Rate, Slider, Tag, Spin, Result, Pagination, Collapse, Checkbox, Space, Row, Col } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { searchHotels } from '@/service/hotelService';
import Search from '@/components/Search/Search';
import "./ListRoomSearch.scss";
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { Panel } = Collapse;

const ListRoomSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchState = useSelector(state => state.searchReducer);

  const [originalHotels, setOriginalHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    priceRange: [0, 10000000],
    starRating: [],
    amenities: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const { address, guests, dates } = searchState;
    if (address && guests && dates && dates[0] && dates[1]) {
      const params = {
        address,
        guests,
        checkIn: dayjs(dates[0]).format('YYYY-MM-DD'),
        checkOut: dayjs(dates[1]).format('YYYY-MM-DD'),
      };
      setLoading(true);
      searchHotels(params)
        .then(data => setOriginalHotels(data || []))
        .catch(err => {
          console.error("Failed to search hotels:", err);
          setOriginalHotels([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [searchState]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredHotels = useMemo(() => {
    return originalHotels.filter(hotel => {
      const priceCondition = hotel.newPrice >= filters.priceRange[0] && hotel.newPrice <= filters.priceRange[1];
      const starCondition = filters.starRating.length === 0 || filters.starRating.includes(Math.round(hotel.stars));
      const amenitiesCondition = filters.amenities.length === 0 || filters.amenities.every(amenity => hotel.amenities?.includes(amenity));
      return priceCondition && starCondition && amenitiesCondition;
    });
  }, [originalHotels, filters]);

  const paginatedHotels = filteredHotels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleHotelClick = (hotel) => {
    navigate(`/hotel/${hotel.id}`);
  };

  console.log(originalHotels);

  const renderHotelList = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
    }
    if (filteredHotels.length === 0) {
      return <Result status="info" title="No Hotels Found" subTitle="Try adjusting your filters or search criteria." />;
    }
    return (
      <div className="hotel-list">
        {paginatedHotels.map((hotel) => (
          <Card key={hotel.id} className="hotel-card" hoverable onClick={() => handleHotelClick(hotel)}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={8}>
                <div className="hotel-card__left">
                  <img src={hotel.image || "https://via.placeholder.com/375x250?text=No+Image"} alt={hotel.name} />
                  {hotel.stars > 0 && <span className="hotel-card__score">{hotel.stars?.toFixed(1)}</span>}
                </div>
              </Col>

              <Col xs={24} md={10}>
                <div className="hotel-card__middle">
                  <div className="hotel-card__header">
                    <h3 className="hotel-card__title">{hotel.name}</h3>
                    {hotel.stars > 0 && (
                      <div className="hotel-card__rating">
                        <Rate disabled allowHalf value={hotel.stars} />
                      </div>
                    )}
                  </div>
                  <div className="hotel-card__location">
                    <EnvironmentOutlined /> {hotel.address}
                  </div>
                  <div className="hotel-card__offers">
                    {hotel.amenities?.split(',').slice(0, 3).map((amenity, idx) => (
                      <Tag key={idx} color="blue">{amenity.trim()}</Tag>
                    ))}
                  </div>
                </div>
              </Col>

              <Col xs={24} md={6}>
                <div className="hotel-card__right">
                  <div className="hotel-card__review">
                    <span>{hotel.reviewCount} reviews</span>
                  </div>
                  <div className="hotel-card__price">
                    {hotel.oldPrice && hotel.oldPrice > hotel.newPrice && (
                      <span className="old-price">{hotel.oldPrice.toLocaleString()} ₫</span>
                    )}
                    <span className="new-price">{hotel.newPrice.toLocaleString()} ₫</span>
                  </div>
                </div>
              </Col>
            </Row>

          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="search-bar"><Search /></div>
      <div className="main-content">
        <aside className="sidebar">
          <h3 className="sidebar-title">Filter by</h3>
          <Collapse defaultActiveKey={['1', '2', '3']} ghost>
            <Panel header="Price per night" key="1">
              <Slider
                range
                value={filters.priceRange}
                min={0}
                max={10000000}
                step={100000}
                onChange={(value) => handleFilterChange('priceRange', value)}
                tooltip={{ formatter: (value) => `${value.toLocaleString()} ₫` }}
              />
              <div className="price-display">
                {filters.priceRange[0].toLocaleString()} ₫ - {filters.priceRange[1].toLocaleString()} ₫
              </div>
            </Panel>
            <Panel header="Star rating" key="2">
              <Checkbox.Group
                style={{ width: '100%' }}
                value={filters.starRating}
                onChange={(value) => handleFilterChange('starRating', value)}
              >
                <Space direction="vertical">
                  <Checkbox value={5}><Rate disabled defaultValue={5} /></Checkbox>
                  <Checkbox value={4}><Rate disabled defaultValue={4} /></Checkbox>
                  <Checkbox value={3}><Rate disabled defaultValue={3} /></Checkbox>
                  <Checkbox value={2}><Rate disabled defaultValue={2} /></Checkbox>
                  <Checkbox value={1}><Rate disabled defaultValue={1} /></Checkbox>
                </Space>
              </Checkbox.Group>
            </Panel>
            <Panel header="Amenities" key="3">
              <Checkbox.Group
                style={{ width: '100%' }}
                options={['WiFi', 'Pool', 'Restaurant', 'Parking', 'Spa', 'Fitness Center']}
                value={filters.amenities}
                onChange={(value) => handleFilterChange('amenities', value)}
              />
            </Panel>
          </Collapse>
        </aside>
        <section className="hotel-list-section">
          <div className="list-header">
            <h2>{filteredHotels.length} properties found</h2>
          </div>
          {renderHotelList()}
          {filteredHotels.length > pageSize && (
            <div className="pagination">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredHotels.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ListRoomSearch;