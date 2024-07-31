import '../styles/Navbar.css';
import PlaceholderLogo from '../assets/react.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="header">
        <a href='/' className='logo'>Viziou
            <img src={PlaceholderLogo} alt="Intersection of Union" className="logo-image" />
        </a>

        <nav className='navbar'>
            <Link to='/2D-Environment'>2D Environment</Link>
            <Link to='/3D-Environment'>3D Environment</Link>
            <Link to='/about'>About</Link>
        </nav>
    </header>
  );
};

export default Navbar;