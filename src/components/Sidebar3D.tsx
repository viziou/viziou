import { NavLink } from 'react-router-dom';
import { SidebarProps3D } from '../utils/types';
import logo from '../assets/favicon.png';
import '../styles/Sidebar3D.css';

const Sidebar3D = (props: SidebarProps3D) => {
  const { polyhedrons, addRandomPolyhedron, clearPolyhedrons, savePolyhedrons, loadPolyhedrons, showIoUs } = props;

  return (
      <aside className="sidebar-3d">
          <NavLink to="/" className="logo-link-3d">
              <div className="logo-container-3d">
                  <img src={logo} alt="Logo" className="logo-image-2d" />
                  <div className="logo-text-3d">Viziou</div>
              </div>
          </NavLink>

          <div className="nav-3d">
              <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link-3d active-link-3d" : "nav-link-3d"}>
                  About
              </NavLink>
              <div className="env-buttons-3d">
                  <NavLink to="/2D-Environment" className={({ isActive }) => isActive ? "nav-link-3d active-link-3d" : "nav-link-3d"}>
                      2D Environment
                  </NavLink>
                  <NavLink to="/3D-Environment" className={({ isActive }) => isActive ? "nav-link-3d active-link-3d" : "nav-link-3d"}>
                      3D Environment
                  </NavLink>
              </div>
          </div>

          <div className="section-3d">
              <h2>Settings</h2>
              <div className="settings-3d">
                  <label className="checkbox-label-3d">
                      Disable save warnings
                      <input type="checkbox" id="save-warnings-3d" />
                  </label>
                  <label htmlFor="decimal-places-3d">
                      Decimal places:
                      <input type="number" id="decimal-places-3d" min="0" max="5" value="2" />
                  </label>
              </div>
          </div>

          <div className="section-3d">
              <h2>Canvas</h2>
              <div className="canvas-buttons-3d">
                  <button className="threed-button-3d" onClick={addRandomPolyhedron}>Add Polyhedron</button>
                  <button className="threed-button-3d" onClick={clearPolyhedrons}>Clear Canvas</button>
              </div>
            <div className="canvas-buttons-3d">
              <button className="twod-button-2d" onClick={showIoUs}>Show IoU</button>
              <button className="threed-button-3d">Clear IoU</button>
            </div>
          </div>

        <div className="polyhedron-list-3d scrollable">
              {polyhedrons.map((_, index) => (
                  <div key={index} className="polyhedron-item-3d">
                      <p>{`Polyhedron ${index + 1}`}</p>
                  </div>
              ))}
          </div>

          <div className="footer-3d">
              <div className="footer-buttons-3d">
                  <button className="threed-button-3d" onClick={savePolyhedrons}>Export Scene</button>
                  <button className="threed-button-3d" onClick={loadPolyhedrons}>Import Scene</button>
              </div>
          </div>

        {/* <div className="section-3d">
          <h2>Object Detection</h2>
          <div className="object-detection-3d">
              <label htmlFor="onnx-path-3d">ONNX Model Filepath:</label>
              <input type="text" id="onnx-path-3d" value="C:\\model.onnx" />
              <label htmlFor="yaml-path-3d">Dataset YAML:</label>
              <input type="text" id="yaml-path-3d" value="C:\\dataset.yml" />
              <label htmlFor="sample-id-3d">Sample ID:</label>
              <input type="number" id="sample-id-3d" value="504" />
          </div>
        </div> */}
      </aside>
  );
};

export default Sidebar3D;
