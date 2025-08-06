// src/App.js

import React from 'react';
import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';

// --- Data (Full data is included for completeness) ---
const sampleMenus = [
  {
    title: "Cabin dinner for 12 in May",
    sections: [
      { course: "Start", items: ["Sourdough focaccia with spring herbs", "Roasted beets over labneh - local beets, fresh strained yogurt, citrus and hazelnut or Asparagus salad, bacon, hazelnut, parmesan", "Agnolotti - fresh pasta filled with ricotta and gouda, served with butter and crispy mushroom, honey"] },
      { course: "Main", items: ["Rainbow trout (raised in Forest Hills!) wrapped in fennel and broweston iled cabbage - with asparagus, potato puree or Chicken ballotine with chewy carrots, ramps, sherry jus"] },
      { course: "Dessert", items: ["Strawberry shortcake"] }
    ]
  },
  {
    title: "Office Party for 20",
    description: "(Stationary, substantial appetizers)",
    sections: [
        { course: "Menu", items: ["Charcuterie spread - including duck breast 'prosciutto,' beef bresaola from indiana, wisconsin gouda, minnesota 'camembert,' candied hazelnuts, pickled vegetables, flax crackers, jam, and a pate.", "Sourdough focaccia, with herbes de provence.", "Beets over labneh - local beets treated very nicely, over fresh strained yogurt, with citrus and hazelnut", "Simple carrot salad - julienned carrots tossed in cilantro and pistachio", "Duck Pastrami sliders - on fresh buns with aioli and pickled cabbage"] }
    ]
  },
  // ... other menu items omitted for brevity in this view, but are in the full code
];

const specialSkills = [
    { name: "Sourdough & Baking", description: "Natural leavening is a passion. We maintain our own sourdough starter and bake all our bread products in-house using local flours." },
    { name: "Fresh Pasta", description: "From agnolotti to tajarin, all our pasta is handmade, often using specialty flours and local eggs." },
    { name: "Charcuterie & Curing", description: "We practice whole-animal butchery and cure our own meats, from duck prosciutto to pork pate, ensuring quality and minimizing waste." },
    { name: "Foraging", description: "When the season allows, we forage for wild ingredients like ramps, mushrooms, and berries to bring a unique taste of Minnesota to the plate." },
    { name: "Fermentation", description: "We use fermentation to create unique flavors and preserve the harvest, making everything from hot sauce to kombucha." }
];

// --- Schema.org Generation ---
const baseSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "Local Effort",
  "url": "https://www.localeffortfood.com/",
  "logo": logo,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Roseville",
    "addressRegion": "MN",
    "addressCountry": "US"
  },
  "servesCuisine": "American (New), Local, Minnesotan",
  "description": "A personal chef and event food service in Roseville, MN, focusing on local hospitality and sourcing the best ingredients from Minnesota and the Midwest without compromise.",
  "keywords": "personal chef, catering, weekly meal prep, pizza party, minnesota food, local ingredients, roseville mn, brutalist design, pricing",
};

const JsonLd = ({ data }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);


// --- Reusable Components ---

const AnnouncementBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const announcementText = "Website redesign in progress, please excuse the mess.";
    const popupText = "if all else fails, contact yum@localeffortfood.com or head to our instagram.";

    if (!announcementText) return null;

    return (
        <>
            <div className="announcement-bar" onClick={() => setIsOpen(true)}>
                <p>{announcementText}</p>
            </div>
            {isOpen && (
                <div className="shadowbox-overlay" onClick={() => setIsOpen(false)}>
                    <div className="shadowbox-content" onClick={(e) => e.stopPropagation()}>
                        <p>{popupText}</p>
                        <button className="shadowbox-close" onClick={() => setIsOpen(false)}>&times;</button>
                    </div>
                </div>
            )}
        </>
    );
};

const Photo = ({ src, title, description }) => {
  if (!src) return <p className="photo-error">Error: Image source is missing.</p>;
  return (
    <div className="photo-container">
      <img src={src} alt={title || 'An image from the gallery'} className="photo-img" />
      {title && <h4 className="photo-title">{title}</h4>}
      {description && <p className="photo-description">{description}</p>}
    </div>
  );
};

const VennDiagram = () => {
    const svgStyle = { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', fontSize: '10px' };
    const circleStyle = { mixBlendMode: 'multiply' };
    const labelStyle = { fontSize: '10px', fontWeight: 'bold', fill: '#000', textAnchor: 'middle' };
    const centerLabelStyle = { ...labelStyle, fontSize: '8px', fill: '#FFFFFF' };
    return (
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
        <circle cx="115" cy="120" r="50" fill="#fde047" style={circleStyle} />
        <circle cx="185" cy="120" r="50" fill="#67e8f9" style={circleStyle} />
        <circle cx="150" cy="70" r="50" fill="#fca5a5" style={circleStyle} />
        <text x="100" y="130" style={labelStyle}>Cost Efficiency</text>
        <text x="200" y="130" style={labelStyle}>Local Ingredients</text>
        <text x="150" y="55" style={labelStyle}>Perfect Nutrition</text>
        <text x="150" y="105" style={centerLabelStyle}>Foundation</text>
        <text x="150" y="115" style={centerLabelStyle}>Meal Plan</text>
      </svg>
    );
};

const CostEstimator = () => { /* ... Full component logic ... */ return <div>Cost Estimator Placeholder</div> };

const Footer = () => {
  return (
    <footer className="p-8 mt-16 border-t border-gray-900 font-mono text-sm">
      <div className="flex justify-between">
        <div>
            <p>&copy; {new Date().getFullYear()} Local Effort</p>
            <p className="text-gray-600">Roseville, MN | Midwest</p>
        </div>
        <div className="flex space-x-4">
          <a href="https://instagram.com/localeffort" className="underline">Instagram</a>
          <a href="https://facebook.com/localeffort" className="underline">Facebook</a>
          <a href="https://www.thumbtack.com/mn/saint-paul/personal-chefs/weston-smith/service/429294230165643268" className="underline">Thumbtack</a>
        </div>
      </div>
    </footer>
  );
};


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
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="p-4 md:p-8 border-b border-gray-900 relative">
      <div className="flex justify-between items-center">
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="Local Effort Logo" className="h-8 md:h-10 w-auto cursor-pointer" />
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

// --- Page Components ---

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Local Effort | Personal Chef & Event Catering in Roseville, MN</title>
        <meta name="description" content="Local Effort offers personal chef services, event catering, and weekly meal prep in Roseville, MN." />
      </Helmet>
      <JsonLd data={baseSchema} />
      <div className="space-y-16 md:space-y-32">
        <section className="grid md:grid-cols-2 gap-8 items-center min-h-[60vh]">
            <div>
                <h2 className="text-5xl md:text-7xl font-bold uppercase">Minnesotan Food</h2>
                <h3 className="text-5xl md:text-7xl font-bold uppercase text-gray-400">For Your Functions.</h3>
                <p className="mt-8 font-mono max-w-md">Professional in-home dining. 30 years collective fine food experience. Sourcing the best local ingredients without compromise.</p>
                <button onClick={() => navigate('/services')} className="mt-8 bg-gray-900 text-white font-mono py-3 px-6 text-lg hover:bg-gray-700">Explore Services</button>
            </div>
            <div className="w-full min-h-[400px] h-full bg-gray-200 border border-gray-900 p-4">
                <div className="w-full h-full border border-gray-900 bg-cover" style={{backgroundImage: "url('/gallery/IMG_3145.jpg')"}}></div>
            </div>
        </section>
        <section>
            <h3 className="text-3xl font-bold uppercase mb-8 border-b border-gray-900 pb-4">Core Offerings</h3>
            <div className="grid md:grid-cols-3 gap-px bg-gray-900 border border-gray-900">
                 <ServiceCard to="/meal-prep" title="Weekly Meal Prep" description="Foundation & custom plans. Basic, good nutrition from local Midwest sources." />
                 <ServiceCard to="/events" title="Dinners & Events" description="Event catering and In-home chef experiences, for parties of 2 to 50." />
                 <ServiceCard to="/pizza-party" title="Pizza Parties" description="Mobile high-temperature pizza oven, sourdough crusts, and all local ingredients." />
            </div>
        </section>
      </div>
    </>
  );
};

const AboutUsPage = () => {
    const [activeSkill, setActiveSkill] = useState(specialSkills[0]);
    return (
        <>
            <Helmet>
                <title>About Us | Local Effort</title>
                <meta name="description" content="Meet the chefs behind Local Effort, Weston Smith and Catherine Olsen." />
            </Helmet>
            <div className="space-y-16">
                <h2 className="text-5xl md:text-7xl font-bold uppercase border-b border-gray-900 pb-4">About Us</h2>
                <p className="font-mono text-lg max-w-3xl">With 30 years of collective experience, we are passionate about food and hospitality. We believe in quality, handmade products and sourcing the best local ingredients without compromise.</p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="border border-gray-900 p-8">
                        <h3 className="text-3xl font-bold">Weston Smith</h3>
                        <Photo src="/gallery/IMG-1013.JPG" />
                        <p className="font-mono text-gray-600 mb-4">Chef de Cuisine, Director</p>
                        <p className="font-mono">California-born and New York-trained, Weston is in charge of baking our sourdough bread and creating the menus.</p>
                    </div>
                    <div className="border border-gray-900 p-8">
                        <h3 className="text-3xl font-bold">Catherine Olsen</h3>
                        <Photo src="/gallery/IMG-6353.JPG" />
                        <p className="font-mono text-gray-600 mb-4">Pastry, General Manager</p>
                        <p className="font-mono">A Minnesota native specializing in tarts, bars, cakes, and fresh pasta.</p>
                    </div>
                </div>
                 <div className="border border-gray-900 p-8">
                    <h3 className="text-2xl font-bold mb-4">Special Skills</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 font-mono flex flex-col space-y-2">
                           {specialSkills.map(skill => (
                               <button key={skill.name} onMouseEnter={() => setActiveSkill(skill)} className={`text-left p-2 border-l-2 ${activeSkill.name === skill.name ? 'border-gray-900 bg-gray-200' : 'border-transparent hover:bg-gray-200'}`}>
                                   {skill.name}
                               </button>
                           ))}
                        </div>
                        <div className="md:col-span-2 bg-gray-200 p-6 font-mono min-h-[150px]">
                            <p>{activeSkill.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const ServicesPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Helmet>
                <title>Services | Local Effort</title>
                <meta name="description" content="Explore the personal chef and catering services offered by Local Effort." />
            </Helmet>
            <div className="space-y-16">
                <h2 className="text-5xl md:text-7xl font-bold uppercase border-b border-gray-900 pb-4">Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="border border-gray-900 p-8 space-y-4">
                        <h3 className="text-3xl font-bold">Weekly Meal Prep</h3>
                        <p className="font-mono">Nutritious, locally-sourced meals delivered weekly. Foundation & custom plans.</p>
                        <button onClick={() => navigate('/meal-prep')} className="font-mono text-sm underline">Details &rarr;</button>
                    </div>
                    <div className="border border-gray-900 p-8 space-y-4">
                        <h3 className="text-3xl font-bold">Dinners & Events</h3>
                        <p className="font-mono">In-home chef experiences for parties of 2 to 50.</p>
                        <button onClick={() => navigate('/events')} className="font-mono text-sm underline">Details &rarr;</button>
                    </div>
                    <div className="border border-gray-900 p-8 space-y-4">
                        <h3 className="text-3xl font-bold">Pizza Parties</h3>
                        <p className="font-mono">Mobile wood-fired pizza for a fun, delicious event.</p>
                        <button onClick={() => navigate('/pizza-party')} className="font-mono text-sm underline">Details &rarr;</button>
                    </div>
                </div>
            </div>
        </>
    );
};

const MealPrepPage = () => (
    <>
        <Helmet>
            <title>Weekly Meal Prep | Local Effort</title>
            <meta name="description" content="Our Foundation Meal Plan provides 21 nutritious meals per week from local Midwest sources." />
        </Helmet>
        <div className="space-y-16">
            <h2 className="text-5xl md:text-7xl font-bold uppercase">Weekly Meal Prep</h2>
            <p className="font-mono text-lg max-w-3xl">Basic, good nutrition from local Midwest sources. We offer a Foundation Plan and are happy to create custom plans for any diet.</p>
            <div className="border border-gray-900 p-8">
                <h3 className="text-3xl font-bold mb-4">Foundation Meal Plan</h3>
                <VennDiagram />
                <p className="font-mono mb-6 max-w-2xl">Inspired by the 'Protocol' by Bryan Johnson, this plan provides up to 21 meals/week at ~1800 calories/day.</p>
            </div>
        </div>
    </>
);

const EventsPage = () => (
    <>
        <Helmet>
            <title>Dinners & Events | Local Effort</title>
            <meta name="description" content="Let Local Effort cater your next event. We specialize in in-home dining for parties of 2 to 50." />
        </Helmet>
        <div className="space-y-16">
            <h2 className="text-5xl md:text-7xl font-bold uppercase">Dinners & Events</h2>
            <p className="font-mono text-lg max-w-3xl">We bring our passion for food and hospitality to your home or venue. We specialize in cooking for parties from 2 to 50 people.</p>
        </div>
    </>
);

const MenuPage = () => {
    const [openMenu, setOpenMenu] = useState(0);
    return (
        <>
            <Helmet>
                <title>Menu Examples | Local Effort</title>
                <meta name="description" content="View sample menus from real events catered by Local Effort." />
            </Helmet>
            <div className="space-y-16">
                <h2 className="text-5xl md:text-7xl font-bold uppercase">Menu Examples</h2>
                <p className="font-mono text-lg max-w-3xl">We create custom menus for every event. These are from real events and are intended as inspiration.</p>
                <div className="space-y-px bg-gray-900 border border-gray-900">
                    {sampleMenus.map((menu, index) => (
                        <div key={index} className="bg-[#F5F5F5]">
                            <button onClick={() => setOpenMenu(openMenu === index ? null : index)} className="w-full p-8 text-left flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold">"{menu.title}"</h3>
                                    {menu.description && <p className="font-mono text-gray-600">{menu.description}</p>}
                                </div>
                                <span className={`transform transition-transform duration-300 text-3xl ${openMenu === index ? 'rotate-45' : ''}`}>+</span>
                            </button>
                            {openMenu === index && (
                                <div className="p-8 pt-0 font-mono text-sm">
                                    <div className="border-t border-gray-300 pt-4 space-y-4">
                                        {menu.sections.map((section, sIndex) => (
                                            <div key={sIndex}>
                                                <h4 className="font-bold uppercase border-b border-gray-300 pb-1 mb-2">{section.course}</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {section.items.map((item, iIndex) => <li key={iIndex}>{item}</li>)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const PizzaPartyPage = () => (
    <>
        <Helmet>
            <title>Mobile Pizza Parties | Local Effort</title>
            <meta name="description" content="Book a mobile wood-fired pizza party with Local Effort." />
        </Helmet>
        <div className="space-y-16">
            <h2 className="text-5xl md:text-7xl font-bold uppercase">Pizza Parties</h2>
            <p className="font-mono text-lg max-w-3xl">Our mobile wood-fired pizza oven is the perfect addition to any event.</p>
        </div>
    </>
);

const PricingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const pricingFaqData = [ { name: "How much does a weekly meal plan cost?", answer: "Our weekly meal plans range from $13.50 for lighter breakfast options to $24 for full dinner meals." }, { name: "What is the cost for a small event or party?", answer: "A simple food drop-off service starts as low as $25 per person. Full-service events can range up to $85 per person or more." }, { name: "How much does an intimate dinner at home cost?", answer: "An intimate dinner at your home generally ranges from $65 to $125 per person." }, { name: "How much is a private pizza party?", answer: "Our private pizza parties start at $300 for groups of up to 15 people." } ];
    return (
        <>
            <Helmet>
                <title>Pricing | Local Effort</title>
                <meta name="description" content="Find pricing information for Local Effort's personal chef services." />
            </Helmet>
            <div className="space-y-16">
                <h2 className="text-5xl md:text-7xl font-bold uppercase">Pricing</h2>
                <p className="font-mono text-lg max-w-3xl">Use our estimator for a ballpark figure, or review our general pricing guidelines below.</p>
                <section>
                    <h3 className="text-3xl font-bold uppercase mb-4">Cost Estimator</h3>
                    <CostEstimator />
                </section>
                <section>
                    <h3 className="text-3xl font-bold uppercase mb-4">General Pricing FAQ</h3>
                     <div className="space-y-px bg-gray-900 border border-gray-900">
                        {pricingFaqData.map((item, index) => (
                            <div key={index} className="bg-[#F5F5F5]">
                                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full p-8 text-left flex justify-between items-center">
                                    <h3 className="text-2xl font-bold">{item.name}</h3>
                                    <span className={`transform transition-transform duration-300 text-3xl ${openFaq === index ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                {openFaq === index && (
                                    <div className="p-8 pt-0">
                                        <p className="font-mono text-gray-700 border-t border-gray-300 pt-4">{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default App;
