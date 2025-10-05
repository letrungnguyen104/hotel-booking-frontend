import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutDefault from "../layout/LayoutDefault";
import ListRoomSearch from "../pages/ListRoomSearch/ListRoomSearch";
import HotelDetail from "../pages/HotelDetails/HotelDetail";
import Homepage from "../pages/Homepage/Homepage";
import Contactpage from "../pages/ContactUS/Contactpage";
import DDpage from "../pages/Discount&Offers/D&Dpage";

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
