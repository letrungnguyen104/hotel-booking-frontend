import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutDefault from "../layout/LayoutDefault";
import ListRoomSearch from "../pages/ListRoomSearch/ListRoomSearch";
import HotelDetail from "../pages/HotelDetails/HotelDetail";
import Homepage from "../pages/Homepage/Homepage";
import Contactpage from "../pages/ContactUS/Contactpage";
import DDpage from "../pages/Discount&Offers/D&Dpage";
import HotelAdminDashboard from "@/pages/HotelAdminDashboard/HotelAdminDashboard";
import Dashboard from "@/pages/HotelAdmin/Dashboard/Dashboard";
import HotelManagement from "@/pages/HotelAdmin/HotelManagement/HotelManagement";
import BookingManagement from "@/pages/HotelAdmin/BookingManagement/BookingManagement";
import RoomTypeManagement from "@/pages/HotelAdmin/RoomTypeManagement/RoomTypeManagement";

// Cấu hình routes cho ứng dụng
export const route = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "search",
        element: <ListRoomSearch />,
      },
      {
        path: "hotel/:id",
        element: <HotelDetail />,
      },
      {
        path: "contact",
        element: <Contactpage />,
      },
      {
        path: "offers",
        element: <DDpage />,
      },
      {
        path: "hotel-admin-dashboard",
        element: <HotelAdminDashboard />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "hotel-management",
            element: <HotelManagement />,
          },
          {
            path: "booking-management",
            element: <BookingManagement />,
          },
          {
            path: "room-type-management",
            element: <RoomTypeManagement />,
          },
        ]
      },
    ],
  },
];

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {route.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
            children={route.children}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRouter;
