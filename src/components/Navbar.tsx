import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <header className="header">
        <a href='/' className='logo'>Viziou
            <img src="src/assets/react.svg" alt="Intersection of Union" className="logo-image" />
        </a>

        <nav className='navbar'>
            <a href='/'>2D Environment</a>
            <a href='/'>3D Environment</a>
            <a href='/'>About</a>
        </nav>
    </header>
  );
};

export default Navbar;