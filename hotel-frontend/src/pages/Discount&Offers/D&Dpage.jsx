// src/pages/Discount&Offers/DDpage.jsx
import React, { useEffect, useState } from "react";
import "./DDpage.scss";
import { useNavigate } from "react-router-dom";
import { Spin, Empty, Button } from "antd";
import { getActivePromotions } from "@/service/promotionService";

function DDpage() {

  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getActivePromotions()
      .then(data => {
        setDeals(data || []);
      })
      .catch(err => {
        console.error("Failed to fetch promotions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="dd-page">
      <div className="dd-banner">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80"
          alt="Deals banner"
          className="dd-banner__image"
        />
        <div className="dd-banner__overlay">
          <h1>Deals & Promotions</h1>
          <p>Explore today's best offers, vouchers & flash sales</p>
        </div>
      </div>

      <div className="dd-main container">
        <h2>Today's Deals</h2>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : deals.length === 0 ? (
          <Empty description="No active deals at the moment. Please check back later!" />
        ) : (
          <div className="deals-grid">
            {deals.map((deal) => (
              <div key={deal.id} className="deal-card">
                <div className="deal-card__img">
                  <img src={deal.imageUrl || 'https://via.placeholder.com/300x200'} alt={deal.title} />
                </div>
                <div className="deal-card__info">
                  <h3>{deal.title}</h3>
                  <p>{deal.description}</p>
                  {deal.code ? (
                    <div className="deal-card__code">
                      <span className="code-label">Code:</span> <strong>{deal.code}</strong>
                    </div>
                  ) : (
                    <div className="deal-card__note">No code needed</div>
                  )}
                  <Button
                    type="primary"
                    className="deal-card__btn"
                    onClick={() => navigate('/search')}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="dd-guide">
          <h2>How to Apply Coupons</h2>
          <div className="guide-img">
            <img
              src="https://cdn0.agoda.net/images/emailmarketing/js_elements/full-img-2x.png"
              alt="steps"
            />
          </div>
          <div className="guide-texts">
            <div className="guide-text">
              <p>
                <strong></strong> Find and collect coupons. If there is a promo code, don't forget to copy it!
              </p>
            </div>
            <div className="guide-text">
              <p>
                <strong></strong> Look for properties labeled “Coupons apply” to use the coupon.
              </p>
            </div>
            <div className="guide-text">
              <p>
                <strong></strong> Make sure to apply coupon/promotion code before completing checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DDpage;