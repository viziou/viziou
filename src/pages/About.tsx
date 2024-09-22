import '../styles/About.css';
import mub from '../assets/mub.png';
import placeholder from '../assets/placeholder_avatar.png';

function About() {
  return (
      <div className="about-container">
          <section className="about-header">
              <h1>About</h1>
                  <div className="about-description">
                      <p>
                      Viziou is an innovative software platform designed to help users explore, visualize, and interact with 2D and 3D shapes while calculating the Intersection over Union (IoU) metric—a crucial measure in computer vision used for evaluating object detection models.
                      </p>

                      <br></br>

                      <p>
                      Our mission is to make complex geometric analysis accessible to all users, providing an interactive space to visualise shape overlaps, compare geometric data, and dive into the world of 2D and 3D space interaction. Whether you're testing models for object detection, learning about IoU, or working on spatial analysis projects, Viziou is the perfect tool to support your work
                      </p>
                  </div>
          </section>

          <section className="developers-section">
              <h2>Meet the Developers</h2>
              <div className="developers-grid">
                  <div className="developer">
                      <img className="developer-photo daniel-photo" src={placeholder} alt="Daniel" />
                      <h3>Daniel</h3>
                      <ul>
                          <li>Who we are</li>
                          <li>What we do</li>
                          <li>What we enjoy</li>
                      </ul>
                  </div>

              <div className="developer">
                  <img className="developer-photo kachun-photo" src={placeholder} alt="KaChun" />
                  <h3>Ka Chun</h3>
                  <ul>
                      <li>Who we are</li>
                      <li>What we do</li>
                      <li>What we enjoy</li>
                  </ul>
              </div>

              <div className="developer">
                  <img className="developer-photo mubasshir-photo" src={mub} alt="Mubasshir" />
                  <h3>Mubasshir</h3>
                  <ul>
                      <li>Who we are</li>
                      <li>What we do</li>
                      <li>What we enjoy</li>
                  </ul>
              </div>

              <div className="developer">
                  <img className="developer-photo satya-photo" src={placeholder} alt="Satya" />
                  <h3>Satya</h3>
                  <ul>
                      <li>Who we are</li>
                      <li>What we do</li>
                      <li>What we enjoy</li>
                  </ul>
              </div>
            </div>
          </section>
      </div>
  );
}

export default About;
