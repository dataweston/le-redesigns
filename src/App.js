// src/App.js

import React from 'react';
import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';

// --- Data & Schema (Keep these as they are) ---
const sampleMenus = [/* ...omitted for brevity... */];
const specialSkills = [/* ...omitted for brevity... */];
const baseSchema = {/* ...omitted for brevity... */};

// --- Helper Components (Keep these as they are) ---
const JsonLd = ({ data }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

const AnnouncementBar = () => { /* ...omitted for brevity... */ };
const Photo = ({ src, title, description }) => { /* ...omitted for brevity... */ };
const VennDiagram = () => { /* ...omitted for brevity... */ };
const CostEstimator = () => { /* ...omitted for brevity... */ };
const Footer = () => { /* ...omitted for brevity... */ };


// --- Main App Structure ---
function App() {
  return (
    <HelmetProvider>
      <div className="bg-[#F5F5F5] text-gray-900 font-sans antialiased">
        <AnnouncementBar />
        <Header />
        <main className="p-4 md:p-8 lg:p-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/meal-prep" element={<MealPrepPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/pizza-party" element={<PizzaPartyPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

// --- Header (Refactored for Routing) ---
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This function closes the mobile menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="p-4 md:p-8 border-b border-gray-900 relative">
      <div className="flex justify-between items-center">
        <Link to="/" onClick={closeMenu}>
          <img
            src={logo}
            alt="Local Effort Logo"
            className="h-8 md:h-10 w-auto cursor-pointer"
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-4 font-mono text-sm">
          <Link to="/services" className="hover:bg-gray-900 hover:text-white p-2">Services</Link>
          <Link to="/pricing" className="hover:bg-gray-900 hover:text-white p-2">Pricing</Link>
          <Link to="/menu" className="hover:bg-gray-900 hover:text-white p-2">Menus</Link>
          <Link to="/about" className="hover:bg-gray-900 hover:text-white p-2">About</Link>
        </nav>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-[#F5F5F5] border-b border-l border-r border-gray-900 font-mono text-center">
          <Link to="/services" onClick={closeMenu} className="block p-4 border-t border-gray-300">Services</Link>
          <Link to="/pricing" onClick={closeMenu} className="block p-4 border-t border-gray-300">Pricing</Link>
          <Link to="/menu" onClick={closeMenu} className="block p-4 border-t border-gray-300">Menus</Link>
          <Link to="/about" onClick={closeMenu} className="block p-4 border-t border-gray-300">About</Link>
        </nav>
      )}
    </header>
  );
};


// --- ServiceCard (Refactored for Routing) ---
const ServiceCard = ({ to, title, description }) => (
    <Link to={to} className="block bg-[#F5F5F5] p-8 space-y-4 hover:bg-gray-200 cursor-pointer">
        <h4 className="text-2xl font-bold uppercase">{title}</h4>
        <p className="font-mono text-gray-600 h-24">{description}</p>
        <span className="font-mono text-sm underline">Learn More &rarr;</span>
    </Link>
);
export default App;
