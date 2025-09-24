import { checkLogin } from "@/action/login";
import { removeToken } from "@/service/tokenService";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router"

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    removeToken();
    dispatch(checkLogin(false));
    navigate("/login");
  }, []);
  return (
    <>
    </>
  )
}

export default Logout