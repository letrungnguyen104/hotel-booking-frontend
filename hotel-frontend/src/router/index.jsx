// src/router/index.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import LayoutDefault from "../layout/LayoutDefault";
import HotelAdminDashboard from "@/pages/HotelAdminDashboard/HotelAdminDashboard";
import LayoutAdmin from "@/layout/layoutAdmin/LayoutAdmin"; // Đảm bảo đường dẫn này đúng

// Pages (Customer)
import Homepage from "../pages/Homepage/Homepage";
import ListRoomSearch from "../pages/ListRoomSearch/ListRoomSearch";
import HotelDetail from "../pages/HotelDetails/HotelDetail";
import Contactpage from "../pages/ContactUS/Contactpage";
import DDpage from "../pages/Discount&Offers/D&Dpage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import CheckoutPage from "@/pages/CheckoutPage/CheckoutPage";

// Pages (Hotel Admin)
import Dashboard from "@/pages/HotelAdmin/Dashboard/Dashboard";
import HotelManagement from "@/pages/HotelAdmin/HotelManagement/HotelManagement";
import BookingManagement from "@/pages/HotelAdmin/BookingManagement/BookingManagement";
import RoomTypeManagement from "@/pages/HotelAdmin/RoomTypeManagement/RoomTypeManagement";
import AdminHotelDetail from "../pages/HotelDetailManagement/AdminHotelDetail/AdminHotelDetail";
import AdminDashboard from "@/components/Admin/AdminDashboard/AdminDashboard";
import AdminUserManagement from "@/components/Admin/AdminUserManagement/AdminUserManagement";
import AdminHotelManagement from "@/components/Admin/AdminHotelManagement/AdminHotelManagement";
import AdminReportManagement from "@/components/Admin/AdminReportManagement/AdminReportManagement";
import AdminBusinessRegistrationManagement from "@/components/Admin/AdminBusinessRegistrationManagement/AdminBusinessRegistrationManagement";
import AdminMessage from "@/components/Admin/AdminMessage/AdminMessage";
import AdminNotification from "@/components/Admin/AdminNotification/AdminNotification";


// Cấu hình routes cho ứng dụng
export const route = [
  // --- Route cho Khách hàng ---
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "search", element: <ListRoomSearch /> },
      { path: "hotel/:id", element: <HotelDetail /> },
      { path: "contact", element: <Contactpage /> },
      { path: "offers", element: <DDpage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "checkout", element: <CheckoutPage /> },

      // --- Route cho Chủ khách sạn (Hotel Admin) ---
      {
        path: "hotel-admin-dashboard",
        element: <HotelAdminDashboard />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "hotel-management", element: <HotelManagement /> },
          { path: "booking-management", element: <BookingManagement /> },
          { path: "room-type-management", element: <RoomTypeManagement /> },
          { path: "hotel/:id", element: <AdminHotelDetail /> },
        ]
      },
    ],
  },

  // --- Route cho Super Admin ---
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "user-management", element: <AdminUserManagement /> },
      { path: "hotel-management", element: <AdminHotelManagement /> },
      { path: "report-management", element: <AdminReportManagement /> },
      { path: "business-registration", element: <AdminBusinessRegistrationManagement /> },
      { path: "message", element: <AdminMessage /> },
      { path: "notification", element: <AdminNotification /> },
    ]
  },
];