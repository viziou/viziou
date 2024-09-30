import { NavLink, useNavigate } from 'react-router-dom';
import { SidebarProps2D } from '../utils/types';
import logo from '../assets/favicon.png';
import '../styles/Sidebar2D.css';
import { PolygonContext } from '../contexts/PolygonContext';
import { useContext } from 'react';

const Sidebar2D = (props: SidebarProps2D) => {
  const { polygons, addPolygon: addPolygon, clearPolygons, showIoUs, clearIoUs, savePolygons, loadPolygons } = props;
  const { dispatch, currentDecimalPlaces } = useContext(PolygonContext)!;
  const navigate = useNavigate();

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
              <button 
                className={`nav-link-2d ${window.location.pathname === '/2D-Environment' ? 'active-link-2d' : ''}`} 
                onClick={() => navigate("/2D-Environment")}
                >2D Environment</button>
              <button 
                    className={`nav-link-2d ${window.location.pathname === '/3D-Environment' ? 'active-link-2d' : ''}`} 
                    onClick={() => navigate("/3D-Environment")}
                >3D Environment</button>
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
                  <input type="number" id="decimal-places-2d" min="0" max="5" value={currentDecimalPlaces} onChange={(event) => dispatch!({type: "SET_DECIMAL_PRECISION", precision:parseInt(event.target.value)})} />
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
              <button className="twod-button-2d" onClick={clearIoUs}>Clear IoU</button>
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
