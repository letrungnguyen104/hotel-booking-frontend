import React, { useState, useEffect } from 'react';
import { List, Avatar, Rate, Spin, Empty, Tooltip } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getReviewsByHotelId } from '@/service/bookingService';
import './HotelReviews.scss';

dayjs.extend(relativeTime);

const DEFAULT_AVATAR = "https://www.svgrepo.com/show/335455/profile-default.svg";

const HotelReviews = ({ hotelId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hotelId) return;
    setLoading(true);
    getReviewsByHotelId(hotelId)
      .then(data => {
        setReviews(data || []);
      })
      .catch(err => {
        console.error("Failed to load reviews:", err);
      })
      .finally(() => setLoading(false));
  }, [hotelId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin /></div>;
  }

  if (reviews.length === 0) {
    return <Empty description="No reviews yet for this hotel." />;
  }

  return (
    <div className="hotel-reviews-list">
      <List
        dataSource={reviews}
        itemLayout="horizontal"
        renderItem={review => {
          const displayName = review.user?.fullName || review.user?.username || 'Anonymous';
          const avatarSrc = review.user?.avatarUrl || DEFAULT_AVATAR;

          return (
            <List.Item className="review-item">
              <div className="review-item-container">
                <div className="review-avatar">
                  <Avatar src={avatarSrc} alt={displayName} />
                </div>
                <div className="review-content">
                  <div className="review-header">
                    <strong className="review-author">{displayName}</strong>
                    <Tooltip title={dayjs(review.createdAt).format('YYYY-MM-DD HH:mm')}>
                      <span className="review-time">{dayjs(review.createdAt).fromNow()}</span>
                    </Tooltip>
                  </div>
                  <div className="review-rating">
                    <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default HotelReviews;