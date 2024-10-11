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
import { IOUPolygonProvider } from './contexts/IOUPolygonContext.tsx'
import { IOUPolyhedronProvider } from './contexts/IOUPolyhedronContext.tsx';

function App() {

  return (
      <BrowserRouter>
          <div>
              <Routes>
                    <Route
                            path="/"
                            element={
                            <>
                                <Navbar />
                                <Hero />
                            </>
                            }
                    />

                  <Route path="/2D-Environment" element={
                      <PolygonProvider>
                        <IOUPolygonProvider>
                          <TwoD />
                        </IOUPolygonProvider>
                      </PolygonProvider>
                      }
                  />

                  <Route path="/3D-Environment" element={
                      <PolyhedronProvider>
                        <IOUPolyhedronProvider>
                          <ThreeD />
                        </IOUPolyhedronProvider>
                      </PolyhedronProvider>
                      }
                  />

                  <Route
                            path="/about"
                            element={
                            <>
                                <Navbar />
                                <About />
                            </>
                            }
                    />

                  <Route path="*" element={<PageNotFound />} />

              </Routes>
          </div>
      </BrowserRouter>
  )
}

export default App
