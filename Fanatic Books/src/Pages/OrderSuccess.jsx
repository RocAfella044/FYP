import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="order-success-container">
      <h2>Order Placed Successfully!</h2>
      <p>
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <p>You will receive a confirmation email shortly.</p>
      <Link to="/shop" className="continue-shopping-btn">
        Continue Shopping
      </Link>

      <style jsx>{`
        .order-success-container {
          max-width: 600px;
          margin: 4rem auto;
          padding: 2rem;
          text-align: center;
          background: linear-gradient(to bottom, #1a1a1a, #2c003e);
          border-radius: 8px;
          color: white;
        }
        h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #d8b4fe;
        }
        p {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: #e5e7eb;
        }
        .continue-shopping-btn {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: #9333ea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 500;
          transition: background 0.3s;
        }
        .continue-shopping-btn:hover {
          background: #7e22ce;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
