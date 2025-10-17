import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutDefault from "../layout/LayoutDefault";
import HotelDetail from "../pages/HotelDetails/HotelDetail";
import Homepage from "../pages/Homepage/Homepage";
import Contactpage from "../pages/ContactUS/Contactpage";
import DDpage from "../pages/Discount&Offers/D&Dpage";
import HotelAdminDashboard from "@/pages/HotelAdminDashboard/HotelAdminDashboard";
import Dashboard from "@/pages/HotelAdmin/Dashboard/Dashboard";
import HotelManagement from "@/pages/HotelAdmin/HotelManagement/HotelManagement";
import BookingManagement from "@/pages/HotelAdmin/BookingManagement/BookingManagement";
import RoomTypeManagement from "@/pages/HotelAdmin/RoomTypeManagement/RoomTypeManagement";
import AdminHotelDetail from "../pages/HotelDetailManagement/AdminHotelDetail/AdminHotelDetail";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import ListRoomSearch from "../pages/ListRoomSearch/ListRoomSearch"

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
        path: "profile",
        element: <ProfilePage />,
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
          {
            path: "hotel/:id",
            element: <AdminHotelDetail />,
          },
        ]
      },
    ],
  },
];

