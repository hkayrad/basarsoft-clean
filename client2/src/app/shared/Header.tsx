import { NavLink } from "react-router";

import logo from "../../assets/hkd-pixel.svg";
import "./styles/header/header.css";
import { List, Map } from "lucide-react";

export default function Header() {
    return (
        <div className="header">
            <NavLink to="/" className="logo">
                <img src={logo} alt="Logo" />
            </NavLink>
            <div className="nav-links">
                <NavLink
                    to="/map"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    <Map size={20} /> Map
                </NavLink>
                <NavLink
                    to="/list"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    <List size={20} /> List
                </NavLink>
            </div>
        </div>
    );
}
