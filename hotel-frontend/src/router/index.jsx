// src/router/index.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import LayoutDefault from "../layout/LayoutDefault";
import HotelAdminDashboard from "@/pages/HotelAdminDashboard/HotelAdminDashboard";
import LayoutAdmin from "@/layout/layoutAdmin/LayoutAdmin";

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
import AdminHotelDetail from "../pages/HotelDetailManagement/AdminHotelDetail/AdminHotelDetail";
import AdminDashboard from "@/components/Admin/AdminDashboard/AdminDashboard";
import AdminUserManagement from "@/components/Admin/AdminUserManagement/AdminUserManagement";
import AdminHotelManagement from "@/components/Admin/AdminHotelManagement/AdminHotelManagement";
import AdminReportManagement from "@/components/Admin/AdminReportManagement/AdminReportManagement";
import AdminBusinessRegistrationManagement from "@/components/Admin/AdminBusinessRegistrationManagement/AdminBusinessRegistrationManagement";
import AdminMessage from "@/components/Admin/AdminMessage/AdminMessage";
import Chat from "@/pages/HotelAdmin/Chat/Chat";
import BookingSuccessPage from "@/pages/BookingSuccessPage/BookingSuccessPage";
import BookingFailurePage from "@/pages/BookingFailurePage/BookingFailurePage";
import MyBookingsPage from "@/pages/MyBookingsPage/MyBookingsPage";
import PromotionManagement from "@/components/Admin/PromotionManagement/PromotionManagement";
import Support from "@/components/Admin/Support/Support";
import AmenityManagement from "@/components/Admin/AmenityManagement/AmenityManagement";
import AuditLog from "@/components/Admin/AuditLog/AuditLog";
import MyWallet from "@/pages/HotelAdmin/MyWallet/MyWallet";
import WithdrawalManagement from "@/components/Admin/WithdrawalManagement/WithdrawalManagement";
import PaymentHistory from "@/pages/HotelAdmin/PaymentHistory/PaymentHistory";


export const route = [
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
      { path: "booking-success", element: <BookingSuccessPage /> },
      { path: "booking-failure", element: <BookingFailurePage /> },
      { path: "my-bookings", element: <MyBookingsPage /> },
      { path: "chat", element: <Chat /> },

      {
        path: "hotel-admin-dashboard",
        element: <HotelAdminDashboard />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "hotel-management", element: <HotelManagement /> },
          { path: "booking-management", element: <BookingManagement /> },
          { path: "chat", element: <Chat /> },
          { path: "hotel/:id", element: <AdminHotelDetail /> },
          { path: "wallet", element: <MyWallet /> },
          { path: "payment-history", element: <PaymentHistory /> },
        ]
      },
    ],
  },

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
      { path: "support", element: <Support /> },
      { path: "promotion", element: <PromotionManagement /> },
      { path: "amenity", element: <AmenityManagement /> },
      { path: "auditlog", element: <AuditLog /> },
      { path: "withdrawals", element: <WithdrawalManagement /> },
    ]
  },
];