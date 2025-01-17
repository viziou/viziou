import '../styles/About.css';
import mub from '../assets/mub.png';
import kc from '../assets/kachun.png';
import placeholder from '../assets/placeholder_avatar.png';

function About() {
  return (
      <div className="about-container">
          <section className="about-header">
              <h1>About</h1>
                  <div className="about-description">
                      <p>
                      <i><b>viziou</b></i> is an innovative software platform designed to help users explore, visualise, and interact with 2D and 3D convex
                      polytopes. The application allows for visualising and calculating the <b>Intersection over Union</b> (IoU) metric — a crucial
                      measure in modern day computer vision for evaluating object detection models.
                      </p>

                      <br></br>

                      <p>
                      Our mission is to make complex geometric analysis accessible to all users, providing an interactive space to visualise polytope
                      overlaps and dive into the world of 2D and 3D space interaction. Whether you're testing models for object detection, learning
                      about IoU, or working on spatial analysis projects, <b><i>viziou</i></b> is the perfect tool to support your work.
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
                          <li>Hi there! I'm Daniel, currently studying degrees in Physics and Computer Science.</li>
                          <li>I'm planning to work as a full-stack software developer or pursue a Master's in Cybersecurity.</li>
                          <li>I enjoy producing music, videos, my own software solutions, and reverse engineering in my free time.</li>
                      </ul>
                  </div>

              <div className="developer">
                  <img className="developer-photo kachun-photo" src={kc} alt="KaChun" />
                  <h3>Ka Chun</h3>
                  <ul>
                      <li>Hello, I'm Ka Chun! I am currently pursuing a degree in Computer Science at Monash University. </li>
                      <li>I enjoy building software solutions and exploring efficient ways to solve complex problems.</li>
                      <li>Beyond my academic pursuits, I enjoy playing tennis and video games.</li>
                  </ul>
              </div>

              <div className="developer">
                  <img className="developer-photo mubasshir-photo" src={mub} alt="Mubasshir" />
                  <h3>Mubasshir</h3>
                  <ul>
                      <li>Hey, I'm Mub! I study Electrical Engineering and Computer Science at Monash University.</li>
                      <li>I primarily work with deep learning models and teach algorithms at Monash University, planning to pursue a PhD in machine learning.</li>
                      <li>I am very passionate about building elegant software and in my downtime I enjoy playing badminton, chess, and Pokemon.</li>
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
