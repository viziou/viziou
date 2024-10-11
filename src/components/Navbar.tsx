import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import Logo from '../assets/favicon.png';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <header className="header">
            <a href="/" className="logo">
                <b>viziou</b>
                <img src={Logo} alt="Intersection of Union" className="logo-image" />
            </a>

            <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleNavbar}>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
            </div>

            <nav className={`navbar ${isOpen ? "open" : ""}`}>
                <NavLink to="/2D-Environment" className={({ isActive }) => (isActive ? "active" : "")}>
                    2D Environment
                </NavLink>

                <NavLink to="/3D-Environment" className={({ isActive }) => (isActive ? "active" : "")}>
                    3D Environment
                </NavLink>

                <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                    About
                </NavLink>
            </nav>

        </header>
    );
};

export default Navbar;
