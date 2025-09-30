import LayoutDefault from "@/layout/LayoutDefault";
import Homepage from "@/pages/Homepage/Homepage";
import Logout from "@/pages/Logout";
import DDpage from "@/pages/Discount&Offers/D&Dpage";
import Contactpage from "@/pages/ContactUS/Contactpage";
import { Navigate } from "react-router";
import ListRoomSearch from "@/pages/ListRoomSearch/ListRoomSearch";
import HotelAdminDashboard from "@/pages/HotelAdminDashboard/HotelAdminDashboard";
import Dashboard from "@/pages/HotelAdmin/Dashboard/Dashboard";
import HotelManagement from "@/pages/HotelAdmin/HotelManagement/HotelManagement";
import BookingManagement from "@/pages/HotelAdmin/BookingManagement/BookingManagement";
import AmenityManagement from "@/pages/HotelAdmin/AmenityManagement/AmenityManagement";

export const route = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Navigate to="/homepage" replace />
      },
      {
        path: "/homepage",
        element: <Homepage />
      },
      {
        path: "offers",
        element: <DDpage />
      },
      {
        path: "contact",
        element: <Contactpage />
      },
      {
        path: "search",
        element: <ListRoomSearch />
      },
      {
        path: "hotel-admin-dashboard",
        element: <HotelAdminDashboard />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "hotel-management",
            element: <HotelManagement />
          },
          {
            path: "booking-management",
            element: <BookingManagement />
          },
          {
            path: "amenity-management",
            element: <AmenityManagement />
          }
        ]
      }
    ]
  },
  {
    path: "/logout",
    element: <Logout />
  }
]