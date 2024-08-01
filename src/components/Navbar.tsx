import '../styles/Navbar.css';
import Logo from '../assets/favicon.png';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="header">
        <a href="/" className="logo">Viziou
            <img src={Logo} alt="Intersection of Union" className="logo-image" />
        </a>

        <nav className="navbar">
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