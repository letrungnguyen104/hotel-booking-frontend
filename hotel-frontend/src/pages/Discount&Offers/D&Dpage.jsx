import React from "react";
import "./DDpage.css";

const dealsData = [
  {
    id: 1,
    title: "Up to ₫1000,000 off hotel",
    description: "Expires in 3 days | Minimum spend ₫1,000,000 ",
    code: "AGODADEAL8",
    imgUrl: "https://cdn0.agoda.net/images/emailmarketing/contentcard/upto5_mspa.png",
  },
  {
    id: 2,
    title: "Up to ₫1500,000 off hotel",
    description: "Minimum spend ₫2,783,000 | Expires in 3 days.",
    code: "AGODADEAL10",
    imgUrl: "https://cdn0.agoda.net/images/emailmarketing/contentcard/upto8_mspa.png",
  },
  {
    id: 3,
    title: "Limited time sale up to 15% off",
    description: "Special discount on last minute bookings.",
    code:"AGODADEAL15",
    imgUrl: "https://cdn0.agoda.net/images/emailmarketing/contentcard/internationalDeals.png",
  },
  {
    id: 4,
    title: "International discount sale up to 30% off",
    description: "Enjoy special rates at international hotels and resorts..",
    code: "AGODA30",
    imgUrl: "https://cdn0.agoda.net/images/emailmarketing/contentcard/internationalDeals.png",
  },
];

function DDpage() {
  return (
    <div className="dd-page">
      {/* Hero / banner */}
      <div className="dd-banner">
        <div className="dd-banner__overlay">
          <h1>Deals & Promotions</h1>
          <p>Explore today's best offers, vouchers & flash sales</p>
        </div>
      </div>

      {/* Main content */}
      <div className="dd-main container">
        <h2>Today's Deals</h2>
        <div className="deals-grid">
          {dealsData.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="deal-card__img">
                <img src={deal.imgUrl} alt={deal.title} />
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
                <a
                  href="https://www.agoda.com/vi-vn/deals?cid=1844104&ds=S6JR0Wprp3DV0iYW"
                  className="deal-card__btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Deals
                </a>
              </div>
            </div>
          ))}
        </div>
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
