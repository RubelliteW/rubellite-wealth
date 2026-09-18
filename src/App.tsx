import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import RealEstateDebtOptimization from './pages/RealEstateDebtOptimization';
import Team from './pages/Team';
import Faq from './pages/Faq';
import Contact from './pages/Contact';

/**
 * Routing pattern: Layout uses the CHILDREN slot pattern — it wraps
 * <Routes> and renders {children} into its padded <main>. Never mix
 * this with an <Outlet/>-based Layout.
 */
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/real-estate-debt-optimization" element={<RealEstateDebtOptimization />} />
        <Route path="/team" element={<Team />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
}
