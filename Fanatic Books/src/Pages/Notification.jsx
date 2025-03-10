import React, { useState } from "react";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your book order has been shipped!", time: "2 hours ago" },
    { id: 2, message: "New arrivals are now available in the shop.", time: "1 day ago" },
    { id: 3, message: "Your wishlist book is now on sale!", time: "3 days ago" },
  ]);

  return (
    <div className="bg-gradient-to-b from-black via-purple-900 to-white min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Notifications</h1>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
              >
                <span className="text-gray-800">{notification.message}</span>
                <span className="text-sm text-gray-500">{notification.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
