import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
        <div className="hero-content">
            <h1>
                <span>Interact<br /></span>
                Model, and Create.
            </h1>

            <p>Explore the world of two-dimensional and three-dimensional intersecting polytopes.</p>

            <div className="hero-buttons">

                <Link to="/2D-Environment">
                    <button className="btn btn-explore-2d">Explore 2D</button>
                </Link>

                <Link to="/3D-Environment">
                    <button className="btn btn-explore-3d">Explore 3D</button>
                </Link>
                    
            </div>

            <div className="hero-info">
                <p>Developed for FIT3161/FIT3162</p>
                <p>Computer Science Project</p>
            </div>

        </div>

        <div className="hero-stats">
            <div className="stat">
                <h2>69K+</h2>
                <p>Users</p>
            </div>

            <div className="stat">
                <h2>4</h2>
                <p>Developers</p>
            </div>
            
        </div>

        <div className="hero-shapes">
            <div className="hero-shapes-blur-1"></div>
            <div className="hero-shapes-blur-2"></div>
            <div className="hero-shapes-blur-3"></div>
        </div>

    </section>
  );
};

export default Hero;