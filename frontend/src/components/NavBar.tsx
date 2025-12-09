import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DefaultHeaderSignedIn from "./defaultHeader-signedin";
import DefaultHeaderSignedOut from "./defaultHeader-signedout";
import "./NavBar.css"; // stays HERE

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, [location]);

  return (
    <div className="navbar-wrapper">
      {loggedIn ? <DefaultHeaderSignedIn /> : <DefaultHeaderSignedOut />}
    </div>
  );
}
