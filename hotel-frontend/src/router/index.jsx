import LayoutDefault from "@/layout/LayoutDefault";
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import Register from "@/pages/Register";
import { Navigate } from "react-router";

export const route = [
  {
    path: "/",
    element: <LayoutDefault />,
    // children: [
    //   {
    //     index: true, // khi vào / thì chạy cái này
    //     element: <Navigate to="/homepage" replace />
    //   },
    //   {
    //     path: "homepage",
    //     ele
    //   }
    // ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/logout",
    element: <Logout />
  }
]