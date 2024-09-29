import { NavLink } from 'react-router-dom';
import { SidebarProps2D } from '../utils/types';
import logo from '../assets/favicon.png';
import '../styles/Sidebar2D.css';

const Sidebar2D = (props: SidebarProps2D) => {
  const { polygons, addPolygon: addPolygon, clearPolygons, showIoUs, savePolygons, loadPolygons } = props;

  return (
      <aside className="sidebar-2d">
          <NavLink to="/" className="logo-link">
              <div className="logo-container-2d">
                  <img src={logo} alt="Logo" className="logo-image-2d" />
                  <div className="logo-text-2d">Viziou</div>
              </div>
          </NavLink>

      <div className="nav-2d">
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link-2d active-link-2d" : "nav-link-2d"}>
              About
          </NavLink>

          <div className="env-buttons-2d">
              <NavLink to="/2D-Environment" className={({ isActive }) => isActive ? "nav-link-2d active-link-2d" : "nav-link-2d"}>
                  2D Environment
              </NavLink>
              <NavLink to="/3D-Environment" className={({ isActive }) => isActive ? "nav-link-2d active-link-2d" : "nav-link-2d"}>
                  3D Environment
              </NavLink>
          </div>
      </div>

      <div className="section-2d">
          <h2>Settings</h2>
          <div className="settings-2d">
              <label className="checkbox-label-2d">
                  Disable save warnings
                  <input type="checkbox" id="save-warnings-2d" />
              </label>
              <label htmlFor="decimal-places-2d">
                  Decimal places:
                  <input type="number" id="decimal-places-2d" min="0" max="5" value="2" />
              </label>
          </div>
      </div>

      <div className="section-2d">
          <h2>Canvas</h2>
          <div className="canvas-buttons-2d">
              <button className="twod-button-2d" onClick={addPolygon}>Add Shape</button>
              <button className="twod-button-2d" onClick={clearPolygons}>Clear Canvas</button>
          </div>
          <div className="canvas-buttons-2d">
              <button className="twod-button-2d" onClick={showIoUs}>Show IoU</button>
              <button className="twod-button-2d">Clear IoU</button>
          </div>
      </div>

      <div className="polygon-list-2d scrollable">
          {polygons.map((_, index) => (
              <div key={index} className="polygon-item-2d small-polygon">
                  <p>{`Polygon ${index + 1}`}</p>
              </div>
          ))}
      </div>

      <div className="footer-2d">
          <div className="footer-buttons-2d">
              <button className="twod-button-2d" onClick={savePolygons}>Export Scene</button>
              <button className="twod-button-2d" onClick={loadPolygons}>Import Scene</button>
          </div>
      </div>

      {/* <div className="section-2d">
        <h2>Object Detection</h2>
        <div className="object-detection-2d">
          <label htmlFor="onnx-path-2d">ONNX Model Filepath:</label>
          <input type="text" id="onnx-path-2d" value="C:\\model.onnx" />
          <label htmlFor="yaml-path-2d">Dataset YAML:</label>
          <input type="text" id="yaml-path-2d" value="C:\\dataset.yml" />
          <label htmlFor="sample-id-2d">Sample ID:</label>
          <input type="number" id="sample-id-2d" value="504" />
        </div>
      </div> */}

      </aside>
  );
};

export default Sidebar2D;
