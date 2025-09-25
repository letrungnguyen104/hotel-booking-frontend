import LayoutDefault from "@/layout/LayoutDefault";
import Homepage from "@/pages/Homepage/Homepage";
import Logout from "@/pages/Logout";
import DDpage from "@/pages/Discount&Offers/D&Dpage";
import Contactpage from "@/pages/ContactUS/Contactpage";
import { Navigate } from "react-router";

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
        path: "homepage",
        element: <Homepage />
      },
      {
        path: "offers",
        element: <DDpage />
      },
      {
        path: "contact",
        element: <Contactpage />
      }
    ]
  },
  {
    path: "/logout",
    element: <Logout />
  }
]