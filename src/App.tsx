import { BrowserRouter, Routes, Route } from 'react-router-dom';

// can make an index file and group all exports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './pages/About';
import TwoD from './pages/TwoDEnv';
import ThreeD from './pages/ThreeDEnv';
import PageNotFound from './pages/PageNotFound';

import { PolygonProvider } from './contexts/PolygonContext';
import { PolyhedronProvider } from './contexts/PolyhedronContext';

function App() {

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route index element={<Hero />} />
          <Route path="/" element={<Hero />} />

          <Route path="/2D-Environment" element={
              <PolygonProvider>
                  <TwoD />
              </PolygonProvider>
              }
          />

          <Route path="/3D-Environment" element={
              <PolyhedronProvider>
                  <ThreeD />
              </PolyhedronProvider>
              } 
          />
          
          <Route path="/about" element={<About />} />

          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
