import '../styles/Navbar.css';
import PlaceholderLogo from '../assets/react.svg';

const Navbar = () => {
  return (
    <header className="header">
        <a href='/' className='logo'>Viziou
            <img src={PlaceholderLogo} alt="Intersection of Union" className="logo-image" />
        </a>

        <nav className='navbar'>
            <a href='/2D-Environment'>2D Environment</a>
            <a href='/3D-Environment'>3D Environment</a>
            <a href='/about'>About</a>
        </nav>
    </header>
  );
};

export default Navbar;