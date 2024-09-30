import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarProps2D } from '../utils/types';
import logo from '../assets/favicon.png';
import '../styles/Sidebar2D.css';
import { PolygonContext } from '../contexts/PolygonContext';

const Sidebar2D = (props: SidebarProps2D) => {

  const { polygons, addPolygon: addPolygon, clearPolygons, showIoUs, clearIoUs, savePolygons, loadPolygons } = props;

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside className={`sidebar-2d ${isCollapsed ? "collapsed" : ""}`}>
            <NavLink to="/" className="logo-link">
                <div className="logo-container-2d">
                <img src={logo} alt="Logo" className="logo-image-2d" />
                {!isCollapsed && <div className="logo-text-2d">Viziou</div>}
                </div>
            </NavLink>

            {!isCollapsed && (
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
            )}

            {!isCollapsed && (
                <div className="section-2d">
                <h2>Settings</h2>
                <div className="settings-2d">
                    <label className="checkbox-label-2d">
                    Disable save warnings
                    <input type="checkbox" id="save-warnings-2d" />
                    </label>
                    <label htmlFor="decimal-places-2d">
                    Decimal places:
                    <input 
                        type="number" 
                        id="decimal-places-2d" 
                        min="0" 
                        max="5" 
                        value={currentDecimalPlaces} 
                        onChange={(event) => dispatch!({ type: "SET_DECIMAL_PRECISION", precision: parseInt(event.target.value) })} 
                    />
                    </label>
                </div>
                </div>
            )}

            <div className="section-2d">
                {!isCollapsed && <h2>Canvas</h2>}
                <div className="canvas-buttons-2d">
                    <button className="twod-button-2d" onClick={addPolygon}>Add Shape</button>
                    <button className="twod-button-2d" onClick={clearPolygons}>Clear Canvas</button>
                </div>
                <div className="canvas-buttons-2d">
                    <button className="twod-button-2d" onClick={showIoUs}>Show IoU</button>
                    <button className="twod-button-2d" onClick={clearIoUs}>Clear IoU</button>
                </div>
            </div>

            {!isCollapsed && (
                <div className="polygon-list-2d scrollable">
                {polygons.map((_, index) => (
                    <div key={index} className="polygon-item-2d small-polygon">
                    <p>{`Polygon ${index + 1}`}</p>
                    </div>
                ))}
                </div>
            )}

            {!isCollapsed && (
                <div className="footer-2d">
                <div className="footer-buttons-2d">
                    <button className="twod-button-2d" onClick={savePolygons}>Export Scene</button>
                    <button className="twod-button-2d" onClick={loadPolygons}>Import Scene</button>
                </div>
                </div>
            )}

            <button className="collapse-button-2d" onClick={handleCollapseToggle}>
                {isCollapsed ? ">" : "<"}
            </button>
        </aside>
    );
};

export default Sidebar2D;
