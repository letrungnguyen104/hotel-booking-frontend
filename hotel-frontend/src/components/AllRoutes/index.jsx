import { useRoutes } from "react-router-dom";
import { route } from "@/router";

function AllRoutes() {
  const element = useRoutes(route);
  return (
    <>
      {element}
    </>
  )
}

export default AllRoutes