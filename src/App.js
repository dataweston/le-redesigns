import React from 'react';
import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import logo from './logo.png'; // Import the logo

// --- Data (Unchanged) ---
const sampleMenus = [
  {
    title: "Cabin dinner for 12 in May",
    sections: [
      { course: "Start", items: ["Sourdough focaccia with spring herbs", "Roasted beets over labneh - local beets, fresh strained yogurt, citrus and hazelnut or Asparagus salad, bacon, hazelnut, parmesan", "Agnolotti - fresh pasta filled with ricotta and gouda, served with butter and crispy mushroom, honey"] },
      { course: "Main", items: ["Rainbow trout (raised in Forest Hills!) wrapped in fennel and broiled cabbage - with asparagus, potato puree or Chicken ballotine with chewy carrots, ramps, sherry jus"] },
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
  {
    title: "Home Event, University gala, 13 guests",
    sections: [
      { course: "Passed Apps", items: ["Grilled Lamb loin Skewers marinated in onion and mint", "Grilled Vegetable skewers, early season", "Walleye brandade, on house crackers"] },
      { course: "Start", items: ["Pork Belly Porchetta with spaetzle, served with peas and carrots, applesauce", "Sourdough focaccia for the table"] },
      { course: "Main", items: ["Duck leg confit, with red polenta and mushrooms or Alaskan Sockeye wrapped in charred cabbage and fennel, served with crispy russet potatoes or Pheasant ballotine, mushroom, carrot, celery root puree"] },
      { course: "Dessert", items: ["Citrus tart - blood orange, Meyer lemon, kumquat or Torta Caprese - dense chocolate hazelnut cake"] }
    ]
  },
  {
    title: "Bar Brava Industry Night",
    sections: [
        { course: "Menu", items: ["Sloppy Joe, on fresh potato bun with purple slaw and white onion", "Pate en Croute, with lamb and duck, served with watercress and mustard", "Lamb neck, over white beans with leek confit and tomato vinaigrette", "Chef's Big Salad - fresh greens, beets, carrots, potatoes - add trout", "Cheese and crackers, jam", "Duck Prosciutto, pickles", "Sourdough Focaccia"] },
        { course: "Dessert", items: ["Carrot cake", "Hazelnut Butter Cup"] }
    ]
  },
  {
    title: "January Wedding for 60",
    sections: [
      { course: "Stationary", items: ["Charcuterie and Cheese spread - local meat and cheeses, including duck ‘prosciutto’, accoutrement like pickles, nuts, chips, jams, sourdough bread and crackers, dips"] },
      { course: "Passed", items: ["Squash toast - ricotta, roasted Kabocha squash, sage honey, fermented chili flake and olive oil", "Charred Date Cruller Bites - Pork skin, balsalmic"] },
      { course: "Seated and shared - Vegetable dishes", items: ["White wine-Poached Leeks over mustard vinaigrette", "Roasted beets over cultured labneh with citrus and hazelnuts", "Smoky cauliflower in lemon cream with watercress and pistachio dukkuh", "Raw carrots, julienned and dressed in cilantro and pistachio", "Roasted Winter chicories and cabbages, goat cheese, pepitas, citrus", "Purple sweet potato salad, warm/German style, tahini aioli, red onion and hominy"] },
      { course: "Seated and shared - Meat dishes", items: ["Braised bison and spaetzle, carrots and peas", "Cassoulet, duck confit with white bean and lamb sausage", "Chicken Ballontine, rolled and sliced, with mushroom and gravy", "Rainbow Trout over potato galette, gruyere"] },
      { course: "Desserts", items: ["Cookie plates, ex. Cardamom citrus shortbread, hazelnut linzer with plum, cranberry oat bars"] }
    ]
  },
  {
    title: "Late Spring Wedding for 130",
    sections: [
        { course: "Start/Share", items: ["Sourdough Focaccia “breadsticks”", "All-belly Porchetta, braised in cider", "Skewers - lamb and vegetable", "Crackers, Pickles and pickled fish, Walleye Brandade", "Crudite, Bagna Cauda", "Lamb hand pies, carrots potatoes and peas"] },
        { course: "Main", items: ["Duck leg confit, over red polenta and grilled asparagus Or Alaskan Sockeye, wild mushroom risotto with peas"] },
        { course: "Desserts", items: ["Hazelnut linzer with jam", "Millionaire shortbread", "Coconut macaron", "Cornish Fairing"] }
    ]
  },
  {
    title: "Bachelorette Party, Summer, 11 Guests",
    sections: [
      { course: "Start", items: ["Sourdough focaccia - basil and cherry tomato", "Prosciutto and melon", "Snap pea salad, fresh yogurt and strawberry, hazelnut"] },
      { course: "Main", items: ["Sockeye salmon OR Hanger Steak OR chicken breast paillard - grilled sweet corn and summer squash, fregola sarda, heirloom tomato"] },
      { course: "Dessert", items: ["Blueberry tart - vanilla creme"] }
    ]
  },
  {
    title: "Home Event, Christmas Work Party, 50 guests - Sample 1",
    sections: [
        { course: "To start", items: ["Salo (cured pork fat), garlic, sourdough bread, pickles", "stuffed cabbage rolls", "beets with dill", "potatoes filled with mushroom", "fresh watermelon, pickled watermelon", "seasonal greens", "olive salad"] },
        { course: "Main", items: ["kabob/shashlik - just mountains of skewers. including: roasted chicken, steak, lamb, tomatoes, mushrooms, and seasonal vegetables, garlic sauce and other sauces and marinades"] }
    ]
  },
  {
    title: "Home Event, Christmas Work Party, 50 guests - Sample 2",
    sections: [
        { course: "Start", items: ["Sourdough focaccia with olive oil and za'atar", "Fresh ricotta", "Spring/summer salad - based on availability"] },
        { course: "Mid-course", items: ["Agnolotti, filled with artichoke and shitake, with crispy sunchokes drizzled with honey"] },
        { course: "Main", items: ["Beef tenderloin, finished in foie gras butter and leek ash", "Asparagus, cured egg yolk, parmesan"] },
        { course: "Movement - Dessert and outdoor fire", items: ["Raspberry marshmallow, with chocolate graham shortbread", "Cognac, or Scotch"] }
    ]
  },
  {
    title: "Home Event, Christmas Work Party, 50 guests - Sample 3",
    sections: [
        { course: "Stationary", items: ["Charcuterie and cheese - a mix of local (Minnesota, Wisconsin, and Indiana) and import (mostly italian, some french), with accoutrement like crudites, olives, jams, nuts, pickles, and housemade chips and crackers. (We can get really specific if you prefer.)", "Fresh Bread - sourdough with local flour - suggesting focaccia and baguette - with olive oil and butter"] },
        { course: "Passed and Placed", items: ["Carrot salad with pistachio and cilantro", "Frites", "James Beard's onion sandwich - onion and mayo with parsley on white bread, crusts cut off", "Duck egg with duck bacon and asparagus", "Scallop and apple", "Short rib \"nigiri\"", "Croque Monsieur"] },
        { course: "Desserts", items: ["Cookie plate - Chocolate Chip, Hazelnut Linzer, + 3rd undecided option", "\"Twinkies\" - citrus chiffon filled with foie gras buttercream", "Japanese cheesecake"] }
    ]
  },
  {
    title: "Home Event, Christmas Work Party, 50 guests - Sample 4",
    sections: [
        { course: "Stationary", items: ["Charcuterie and cheese platters, including: breseola, cured pork tenderloin, marinated olives, pickled beets, tomato jam, 3-5 cheeses, candied walnuts, duck rillettes, house crackers and chips", "Garlic focaccia", "Carrot salad with pistachio and coriander"] },
        { course: "Passed", items: ["Duck egg with duck pastrami", "Kabocha squash toast, ricotta and persimmon honey", "Perfect Beef tenderloin, leek and corn ash, foie gras butter"] },
        { course: "Desserts", items: ["Cookies and bars", "Persimmon cake with cranberry", "Hot chocolate with marshmallows and local peppermint schnapps"] }
    ]
  }
];

const specialSkills = [
    { name: "Sourdough & Baking", description: "Natural leavening is a passion. We maintain our own sourdough starter and bake all our bread products in-house using local flours." },
    { name: "Fresh Pasta", description: "From agnolotti to tajarin, all our pasta is handmade, often using specialty flours and local eggs." },
    { name: "Charcuterie & Curing", description: "We practice whole-animal butchery and cure our own meats, from duck prosciutto to pork pate, ensuring quality and minimizing waste." },
    { name: "Foraging", description: "When the season allows, we forage for wild ingredients like ramps, mushrooms, and berries to bring a unique taste of Minnesota to the plate." },
    { name: "Fermentation", description: "We use fermentation to create unique flavors and preserve the harvest, making everything from hot sauce to kombucha." }
];


// --- Schema.org Generation (Unchanged) ---
const JsonLd = ({ data }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

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
  "founder": [
    { "@type": "Person", "name": "Catherine Olsen" },
    { "@type": "Person", "name": "Weston Smith" }
  ],
  "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://www.localeffortfood.com/contact"
  },
  "image": "https://placehold.co/1200x400/111827/f3f4f6?text=LOCAL+EFFORT"
};

// --- Main App Component ---
function App() {
  const [activePage, setActivePage] = useState('home');

  const pages = {
    home: <HomePage setActivePage={setActivePage} />,
    about: <AboutUsPage />,
    services: <ServicesPage setActivePage={setActivePage} />,
    mealPrep: <MealPrepPage />,
    events: <EventsPage />,
    menu: <MenuPage />,
    pizzaParty: <PizzaPartyPage />,
    pricing: <PricingPage />,
  };
  
  return (
    <HelmetProvider>
      <div className="bg-[#F5F5F5] text-gray-900 font-sans antialiased">
        <Header setActivePage={setActivePage} />
        <main className="p-4 md:p-8 lg:p-16">
          {pages[activePage]}
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

// --- Brutalist Components ---

const Header = ({ setActivePage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="p-4 md:p-8 border-b border-gray-900 relative">
      <div className="flex justify-between items-center">
        <img 
            src={logo} 
            alt="Local Effort Logo" 
            className="h-8 md:h-10 w-auto cursor-pointer" 
            onClick={() => handleNavClick('home')} 
        />
        <nav className="hidden md:flex items-center space-x-4 font-mono text-sm">
          <a href="#services" onClick={() => handleNavClick('services')} className="hover:bg-gray-900 hover:text-white p-2">Services</a>
          <a href="#pricing" onClick={() => handleNavClick('pricing')} className="hover:bg-gray-900 hover:text-white p-2">Pricing</a>
          <a href="#menu" onClick={() => handleNavClick('menu')} className="hover:bg-gray-900 hover:text-white p-2">Menus</a>
          <a href="#about" onClick={() => handleNavClick('about')} className="hover:bg-gray-900 hover:text-white p-2">About</a>
        </nav>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-[#F5F5F5] border-b border-l border-r border-gray-900 font-mono text-center">
          <a href="#services" onClick={() => handleNavClick('services')} className="block p-4 border-t border-gray-300">Services</a>
          <a href="#pricing" onClick={() => handleNavClick('pricing')} className="block p-4 border-t border-gray-300">Pricing</a>
          <a href="#menu" onClick={() => handleNavClick('menu')} className="block p-4 border-t border-gray-300">Menus</a>
          <a href="#about" onClick={() => handleNavClick('about')} className="block p-4 border-t border-gray-300">About</a>
        </nav>
      )}
    </header>
  );
};

const HomePage = ({ setActivePage }) => {
  return (
    <>
      <Helmet>
        <title>Local Effort | Personal Chef & Event Catering in Roseville, MN</title>
        <meta name="description" content="Local Effort offers personal chef services, event catering, and weekly meal prep in Roseville, MN, with a focus on local Minnesotan ingredients and hospitality." />
      </Helmet>
      <JsonLd data={baseSchema} />
      <div className="space-y-16 md:space-y-32">
        <section className="grid md:grid-cols-2 gap-8 items-center min-h-[60vh]">
            <div>
                <h2 className="text-5xl md:text-7xl font-bold uppercase">Minnesotan Food</h2>
                <h3 className="text-5xl md:text-7xl font-bold uppercase text-gray-400">For Your Functions.</h3>
                <p className="mt-8 font-mono max-w-md">Professional in-home dining. 30 years collective fine food experience. Sourcing the best local ingredients without compromise.</p>
                <button onClick={() => setActivePage('services')} className="mt-8 bg-gray-900 text-white font-mono py-3 px-6 text-lg hover:bg-gray-700">Explore Services</button>
            </div>
            <div className="hidden md:block w-full h-full bg-gray-200 border border-gray-900 p-4">
                <div className="w-full h-full border border-gray-900 bg-cover" style={{backgroundImage: "url('https://placehold.co/600x800/e5e7eb/111827?text=MN/WI')"}}></div>
            </div>
        </section>

        <section>
            <h3 className="text-3xl font-bold uppercase mb-8 border-b border-gray-900 pb-4">Core Offerings</h3>
            <div className="grid md:grid-cols-3 gap-px bg-gray-900 border border-gray-900">
                 <ServiceCard 
                    title="Weekly Meal Prep"
                    description="Foundation & custom plans. Basic, good nutrition from local Midwest sources."
                    action={() => setActivePage('mealPrep')}
                />
                <ServiceCard 
                    title="Dinners & Events"
                    description="Event catering and In-home chef experiences, for parties of 2 to 50."
                    action={() => setActivePage('events')}
                />
                <ServiceCard 
                    title="Pizza Parties"
                    description="Mobile high-temperature pizza oven, sourdough crusts, and all local ingredients. We bring the party to you."
                    action={() => setActivePage('pizzaParty')}
                />
            </div>
        </section>
      </div>
    </>
  );
};

const ServiceCard = ({ title, description, action }) => (
  <div className="bg-[#F5F5F5] p-8 space-y-4 hover:bg-gray-200 cursor-pointer" onClick={action}>
    <h4 className="text-2xl font-bold uppercase">{title}</h4>
    <p className="font-mono text-gray-600 h-24">{description}</p>
    <span className="font-mono text-sm underline">Learn More &rarr;</span>
  </div>
);

const AboutUsPage = () => {
    const [activeSkill, setActiveSkill] = useState(specialSkills[0]);

    return (
        <>
            <Helmet>
                <title>About Us | Local Effort</title>
                <meta name="description" content="Meet the chefs behind Local Effort, Weston Smith and Catherine Olsen. With 30 years of collective experience, we are passionate about food and hospitality." />
            </Helmet>
            <div className="space-y-16">
                <h2 className="text-5xl md:text-7xl font-bold uppercase border-b border-gray-900 pb-4">About Us</h2>
                <p className="font-mono text-lg max-w-3xl">With 30 years of collective experience, we are passionate about food and hospitality. We believe in quality, handmade products and sourcing the best local ingredients without compromise. We prefer direct communication with our clients.</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="border border-gray-900 p-8">
                        <h3 className="text-3xl font-bold">Weston Smith</h3>
                        <p className="font-mono text-gray-600 mb-4">Chef de Cuisine, Director</p>
                        <p className="font-mono">California-born and New York-trained, Weston is in charge of baking our sourdough bread and creating the menus. (He's friendlier than he looks.)</p>
                    </div>
                    <div className="border border-gray-900 p-8">
                        <h3 className="text-3xl font-bold">Catherine Olsen</h3>
                        <p className="font-mono text-gray-600 mb-4">Pastry, General Manager</p>
                        <p className="font-mono">A Minnesota native specializing in tarts, bars, cakes, and fresh pasta. She also forages for stunning floral arrangements.</p>
                    </div>
                </div>

                 <div className="border border-gray-900 p-8">
                    <h3 className="text-2xl font-bold mb-4">Special Skills</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 font-mono flex flex-col space-y-2">
                           {specialSkills.map(skill => (
                               <button 
                                key={skill.name} 
                                onMouseEnter={() => setActiveSkill(skill)}
                                className={`text-left p-2 border-l-2 ${activeSkill.name === skill.name ? 'border-gray-900 bg-gray-200' : 'border-transparent hover:bg-gray-200'}`}
                               >
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

const ServicesPage = ({ setActivePage }) => {
    return (
        <>
            <Helmet>
                <title>Services | Local Effort</title>
                <meta name="description" content="Explore the personal chef and catering services offered by Local Effort, including weekly meal prep, in-home dinners, event catering, and mobile pizza parties." />
            </Helmet>
            <div className="space-y-16">
                <h2 className="text-5xl md:text-7xl font-bold uppercase border-b border-gray-900 pb-4">Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="border border-gray-900 p-8 space-y-4">
                        <h3 className="text-3xl font-bold">Weekly Meal Prep</h3>
                        <p className="font-mono">Nutritious, locally-sourced meals delivered weekly. Foundation & custom plans.</p>
                        <button onClick={() => setActivePage('mealPrep')} className="font-mono text-sm underline">Details &rarr;</button>
                    </div>
                    <div className="border border-gray-900 p-8 space-y-4">
                        <h3 className="text-3xl font-bold">Dinners & Events</h3>
                        <p className="font-mono">In-home chef experiences for parties of 2 to 50.</p>
                        <button onClick={() => setActivePage('events')} className="font-mono text-sm underline">Details &rarr;</button>
                    </div>
                    <div className="border border-gray-900 p-8 space-y-4">
                        <h3 className="text-3xl font-bold">Pizza Parties</h3>
                        <p className="font-mono">Mobile wood-fired pizza for a fun, delicious event.</p>
                        <button onClick={() => setActivePage('pizzaParty')} className="font-mono text-sm underline">Details &rarr;</button>
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
            <meta name="description" content="Our Foundation Meal Plan, inspired by 'Protocol by Bryan Johnson,' provides 21 nutritious meals per week from local Midwest sources." />
        </Helmet>
        <div className="space-y-16">
            <h2 className="text-5xl md:text-7xl font-bold uppercase">Weekly Meal Prep</h2>
            <p className="font-mono text-lg max-w-3xl">Basic, good nutrition from local Midwest sources. We offer a Foundation Plan and are happy to create custom plans for any diet.</p>
            
            <div className="border border-gray-900 p-8">
                <h3 className="text-3xl font-bold mb-4">Foundation Meal Plan</h3>
                <p className="font-mono mb-6 max-w-2xl">Inspired by the 'Protocol' by Bryan Johnson, this plan provides up to 21 meals/week at ~1800 calories/day. Designed for optimal nutrition and convenience.</p>
                <div className="grid md:grid-cols-3 gap-px bg-gray-900 border border-gray-900">
                    <div className="bg-[#F5F5F5] p-6">
                        <h4 className="font-bold text-lg">01. Morning</h4>
                        <p className="font-mono text-sm text-gray-600">Seedy bowl or smoothie.</p>
                    </div>
                    <div className="bg-[#F5F5F5] p-6">
                        <h4 className="font-bold text-lg">02. Midday</h4>
                        <p className="font-mono text-sm text-gray-600">Large, nutrient-dense vegetable bowl.</p>
                    </div>
                    <div className="bg-[#F5F5F5] p-6">
                        <h4 className="font-bold text-lg">03. Evening</h4>
                        <p className="font-mono text-sm text-gray-600">Rotating daily special.</p>
                    </div>
                </div>
            </div>
            <button className="bg-gray-900 text-white font-mono py-3 px-6 text-lg hover:bg-gray-700">Get Started With Meal Prep</button>
        </div>
    </>
);

const EventsPage = () => (
    <>
        <Helmet>
            <title>Dinners & Events | Local Effort</title>
            <meta name="description" content="Let Local Effort cater your next event. We specialize in in-home dining for parties of 2 to 50, including birthdays, showers, and corporate events." />
        </Helmet>
        <div className="space-y-16">
            <h2 className="text-5xl md:text-7xl font-bold uppercase">Dinners & Events</h2>
            <p className="font-mono text-lg max-w-3xl">We bring our passion for food and hospitality to your home or venue. We specialize in cooking for parties from 2 to 50 people, creating memorable experiences for intimate dinners, birthdays, showers, corporate parties, and more.</p>
            
            <div className="border border-gray-900 p-8">
                <h3 className="text-3xl font-bold mb-2">A Professional Experience, Anywhere.</h3>
                <p className="font-mono max-w-3xl">Don't worry about your kitchen setup. With our thirty years of collective experience, we can work in almost any home kitchen to produce restaurant-quality food. We handle the details so you can enjoy your event.</p>
            </div>
            <button className="bg-gray-900 text-white font-mono py-3 px-6 text-lg hover:bg-gray-700">Contact Us to Book Your Event</button>
        </div>
    </>
);

const MenuPage = () => {
    const [openMenu, setOpenMenu] = useState(0); // First menu is open by default

    return (
        <>
            <Helmet>
                <title>Menu Examples | Local Effort</title>
                <meta name="description" content="View sample menus from real events catered by Local Effort. Get inspiration for your wedding, office party, or intimate dinner." />
            </Helmet>
            <div className="space-y-16">
                <h2 className="text-5xl md:text-7xl font-bold uppercase">Menu Examples</h2>
                <p className="font-mono text-lg max-w-3xl">We create custom menus for every event. These are from real events and proposals and are intended as inspiration. Use them as a starting point for your own handmade menu.</p>
                
                <div className="space-y-px bg-gray-900 border border-gray-900">
                    {sampleMenus.map((menu, index) => (
                        <div key={index} className="bg-[#F5F5F5]">
                            <button 
                                onClick={() => setOpenMenu(openMenu === index ? null : index)}
                                className="w-full p-8 text-left flex justify-between items-center"
                            >
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
                                                    {section.items.map((item, iIndex) => (
                                                        <li key={iIndex}>{item}</li>
                                                    ))}
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
            <meta name="description" content="Book a mobile wood-fired pizza party with Local Effort. We bring the oven and the fresh, local ingredients to your event." />
        </Helmet>
        <div className="space-y-16">
            <h2 className="text-5xl md:text-7xl font-bold uppercase">Pizza Parties</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="border border-gray-900 p-8">
                    <h3 className="text-3xl font-bold mb-2">We Bring the Party to You.</h3>
                    <p className="font-mono">Our mobile wood-fired pizza oven is the perfect addition to any event. We'll set up at your location and serve up delicious, made-to-order pizzas for you and your guests. It's a fun, interactive, and delicious way to celebrate.</p>
                    <button className="mt-6 bg-gray-900 text-white font-mono py-2 px-4 hover:bg-gray-700">Book Your Pizza Party</button>
                </div>
                <div className="w-full h-96 bg-gray-200 border border-gray-900 p-4">
                    <div className="w-full h-full border border-gray-900 bg-cover" style={{backgroundImage: "url('https://placehold.co/600x400/e5e7eb/111827?text=PIZZA')"}}></div>
                </div>
            </div>
        </div>
    </>
);


const CostEstimator = () => {
    const [userAnswers, setUserAnswers] = useState({});
    const [currentQuestionKey, setCurrentQuestionKey] = useState('start');
    const [questionPath, setQuestionPath] = useState([]);
    const [finalCost, setFinalCost] = useState(0);
    const [breakdown, setBreakdown] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    const questions = {
        'start': { id: 'serviceType', title: "What kind of service are you looking for?", type: 'options', options: [ { text: "Weekly Meal Plan", value: "mealPlan" }, { text: "Small Event or Party", value: "smallEvent" }, { text: "Intimate Dinner at Home", value: "dinnerAtHome" }, { text: "Pizza Party", value: "pizzaParty" } ], next: (answer) => `${answer}_q1` },
        'mealPlan_q1': { id: 'numPeople', title: "How many people?", type: 'number', placeholder: "e.g., 2", next: 'mealPlan_q2' },
        'mealPlan_q2': { id: 'meals', title: "Meals per week?", type: 'multi_number', fields: [ { id: 'breakfasts', label: 'Breakfasts' }, { id: 'lunches', label: 'Lunches' }, { id: 'dinners', label: 'Dinners' } ], next: 'mealPlan_q3' },
        'mealPlan_q3': { id: 'billing', title: "Billing preference?", type: 'options', options: [ { text: "Weekly", value: "weekly" }, { text: "Monthly (10% off)", value: "monthly" }, { text: "Seasonally (20% off)", value: "seasonal" } ], next: 'end' },
        'smallEvent_q1': { id: 'numPeople', title: "How many guests?", type: 'number', placeholder: "e.g., 25", next: 'smallEvent_q2' },
        'dinnerAtHome_q1': { id: 'numPeople', title: "How many guests?", type: 'number', placeholder: "e.g., 4", next: 'smallEvent_q2' },
        'smallEvent_q2': { id: 'serviceStyle', title: "Service style?", type: 'options', options: [ { text: "Food Drop-off", value: "dropoff" }, { text: "Passed Appetizers", value: "passedApps" }, { text: "Buffet Style", value: "buffet" }, { text: "Buffet & Passed Apps", value: "buffetAndPassed" }, { text: "Plated Meal", value: "plated" } ], next: (answer) => (answer === 'buffet' || answer === 'passedApps' || answer === 'buffetAndPassed') ? 'smallEvent_q3' : 'smallEvent_q4' },
        'smallEvent_q3': { id: 'portionSize', title: "Portion size?", type: 'options', options: [ { text: "Light snacks", value: "lightSnacks" }, { text: "Substantial (meal replacement)", value: "substantialApps" }, { text: "A full meal", value: "fullMeal" } ], next: 'smallEvent_q4' },
        'smallEvent_q4': { id: 'sensitivity', title: "Focus for the event?", type: 'options', options: [ { text: "Premium / Unforgettable", value: "quality_sensitive" }, { text: "Budget-friendly / Impressive", value: "price_sensitive" } ], next: 'end' },
        'pizzaParty_q1': { id: 'numPeople', title: "How many people?", type: 'number', placeholder: "e.g., 20", next: 'pizzaParty_q2' },
        'pizzaParty_q2': { id: 'addons', title: "Add-ons (salads, etc.)?", type: 'options', options: [ { text: "Yes", value: true }, { text: "No, just pizza", value: false } ], next: (answer) => answer ? 'pizzaParty_q3' : 'end' },
        'pizzaParty_q3': { id: 'sensitivity', title: "Goal for add-ons?", type: 'options', options: [ { text: "Gourmet & Artisanal", value: "quality_sensitive" }, { text: "Classic & Crowd-pleasing", value: "price_sensitive" } ], next: 'end' }
    };

    const calculateCost = (answers) => {
        const type = answers.serviceType;
        let totalCost = 0;
        let breakdownCalc = [];
        const people = parseInt(answers.numPeople) || 1;
        const model = { mealPlan: { price_per_meal: { breakfast: 13.5, lunch: 18.5, dinner: 24 }, discounts: { couple: 0.1, family: 0.2, monthly: 0.1, seasonal: 0.2 } }, eventBase: { plated: 85, buffet: 55, passedApps: 55, dropoff: 25, buffetAndPassed: 65 }, portionMultiplier: { lightSnacks: 0.8, substantialApps: 1.0, fullMeal: 1.2 }, pizzaParty: { base_fee: 300, per_person_mid: 20, per_person_large: 16, addons_per_person: { low: 10, high: 30 } } };
        
        switch(type) {
            case 'mealPlan':
                let weeklyCost = ((parseInt(answers.breakfasts) || 0) * model.mealPlan.price_per_meal.breakfast) + ((parseInt(answers.lunches) || 0) * model.mealPlan.price_per_meal.lunch) + ((parseInt(answers.dinners) || 0) * model.mealPlan.price_per_meal.dinner);
                weeklyCost *= people;
                breakdownCalc.push(`Weekly meal total for ${people} ${people > 1 ? 'people' : 'person'}: $${weeklyCost.toFixed(2)}`);
                let coupleDiscount = (people === 2) ? weeklyCost * model.mealPlan.discounts.couple : 0;
                let familyDiscount = (people >= 4) ? weeklyCost * model.mealPlan.discounts.family : 0;
                if(coupleDiscount > 0) breakdownCalc.push(`10% discount for two: -$${coupleDiscount.toFixed(2)}`);
                if(familyDiscount > 0) breakdownCalc.push(`20% discount for family of 4+: -$${familyDiscount.toFixed(2)}`);
                let costAfterPeopleDiscount = weeklyCost - coupleDiscount - familyDiscount;
                let billingDiscount = 0;
                if (answers.billing === 'seasonal') { billingDiscount = costAfterPeopleDiscount * model.mealPlan.discounts.seasonal; breakdownCalc.push(`20% seasonal billing discount: -$${billingDiscount.toFixed(2)}`); }
                else if (answers.billing === 'monthly') { billingDiscount = costAfterPeopleDiscount * model.mealPlan.discounts.monthly; breakdownCalc.push(`10% monthly billing discount: -$${billingDiscount.toFixed(2)}`); }
                totalCost = costAfterPeopleDiscount - billingDiscount;
                break;
            case 'smallEvent':
            case 'dinnerAtHome':
                let basePerPerson = model.eventBase[answers.serviceStyle] || 85;
                basePerPerson *= (answers.sensitivity === 'price_sensitive' ? 0.9 : 1.2);
                if (answers.portionSize) { basePerPerson *= model.portionMultiplier[answers.portionSize]; }
                const getGroupSizeDiscountFactor = (numPeople) => { if (numPeople >= 31) return 0.8; if (numPeople >= 16) return 0.9; if (numPeople >= 6) return 0.95; return 1.0; }
                const discountFactor = getGroupSizeDiscountFactor(people);
                const finalPerPerson = basePerPerson * discountFactor;
                totalCost = finalPerPerson * people;
                breakdownCalc.push(`Event for ${people} guests: ~$${totalCost.toFixed(2)}`);
                if(discountFactor < 1) breakdownCalc.push(`Includes a group discount for ${people} guests.`);
                break;
            case 'pizzaParty':
                if (people <= 15) {
                    totalCost = model.pizzaParty.base_fee;
                    breakdownCalc.push(`Pizza party for up to 15 guests: $${totalCost.toFixed(2)}`);
                } else if (people <= 30) {
                    totalCost = people * model.pizzaParty.per_person_mid;
                    breakdownCalc.push(`Pizza party for ${people} guests at $${model.pizzaParty.per_person_mid}/person: $${totalCost.toFixed(2)}`);
                } else { // 31+
                    totalCost = people * model.pizzaParty.per_person_large;
                    breakdownCalc.push(`Pizza party for ${people} guests at $${model.pizzaParty.per_person_large}/person: $${totalCost.toFixed(2)}`);
                }

                if (answers.addons) {
                    const addonCost = answers.sensitivity === 'price_sensitive' ? model.pizzaParty.addons_per_person.low : model.pizzaParty.addons_per_person.high;
                    const addonTotal = addonCost * people;
                    totalCost += addonTotal;
                    breakdownCalc.push(`Gourmet add-ons for ${people} guests: +$${addonTotal.toFixed(2)}`);
                }
                break;
            default:
                totalCost = 0;
        }
        setFinalCost(totalCost);
        setBreakdown(breakdownCalc);
        setShowResults(true);
    };

    const handleAnswer = (question, value) => {
        const newAnswers = { ...userAnswers };
        if (question.type === 'multi_number') { Object.assign(newAnswers, value); } 
        else { newAnswers[question.id] = value; }
        setUserAnswers(newAnswers);

        setQuestionPath([...questionPath, currentQuestionKey]);
        
        let nextKey = 'end';
        if (typeof question.next === 'function') { nextKey = question.next(value); } 
        else { nextKey = question.next; }
        
        if (!nextKey || nextKey === 'end') {
            calculateCost(newAnswers);
        } else {
            setCurrentQuestionKey(nextKey);
        }
    };

    const goBack = () => {
        if (questionPath.length === 0) return;

        const newPath = [...questionPath];
        const previousKey = newPath.pop();
        
        setQuestionPath(newPath);
        setCurrentQuestionKey(previousKey);

        const questionToLeave = questions[previousKey];
        if (questionToLeave) {
            const newAnswers = { ...userAnswers };
            if (questionToLeave.type === 'multi_number') {
                questionToLeave.fields.forEach(field => delete newAnswers[field.id]);
            } else {
                delete newAnswers[questionToLeave.id];
            }
            setUserAnswers(newAnswers);
        }
    };

    const restart = () => {
        setUserAnswers({});
        setCurrentQuestionKey('start');
        setQuestionPath([]);
        setFinalCost(0);
        setBreakdown([]);
        setShowResults(false);
        setShowLeadForm(false);
        setShowThankYou(false);
    };

    const initiateSquarePayment = () => {
        const paymentDetails = {
            amount: finalCost * 100, // Square expects amount in cents
            currency: 'USD',
            description: `Personal Chef Service - ${userAnswers.serviceType}`,
            isRecurring: userAnswers.serviceType === 'mealPlan' && userAnswers.billing !== 'weekly',
            customerAnswers: userAnswers
        };
        console.log("SIMULATING SQUARE PAYMENT. A developer would take this data and send it to a secure server to create a payment link.", paymentDetails);
        alert("This would connect to Square to process the payment. See the browser console for details.");
    };

    const currentQData = questions[currentQuestionKey];
    const totalSteps = userAnswers.serviceType ? {mealPlan: 3, smallEvent: 4, dinnerAtHome: 4, pizzaParty: 3}[userAnswers.serviceType] : 5;
    const progress = (questionPath.length / totalSteps) * 100;

    if (showResults) {
        return (
            <div className="border border-gray-900 p-8 text-center">
                <h3 className="text-2xl font-bold">All-Inclusive Ballpark Estimate</h3>
                <p className="font-mono text-gray-600 mb-6">Estimated total for food, service, and fees:</p>
                <p className="text-6xl font-bold mb-4">${finalCost.toFixed(2)}</p>
                <div className="bg-gray-200 border border-gray-900 p-4 text-left mb-6 font-mono text-sm space-y-1">
                    {breakdown.map((item, i) => <p key={i}>- {item}</p>)}
                    <p className="text-xs text-gray-600 pt-2"><strong>Note:</strong> Final price may vary based on specific menu selections.</p>
                </div>
                
                {!showLeadForm && !showThankYou && (
                    <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                        <button onClick={initiateSquarePayment} className="w-full sm:w-auto bg-gray-900 text-white font-mono py-2 px-4 hover:bg-gray-700">Book Now</button>
                        <button onClick={() => setShowLeadForm(true)} className="w-full sm:w-auto bg-gray-300 text-gray-900 font-mono py-2 px-4 hover:bg-gray-400">I Need More Info</button>
                    </div>
                )}

                {showLeadForm && !showThankYou && (
                    <div className="mt-6 text-left font-mono">
                        <h3 className="font-bold text-lg mb-4">Excellent! Provide your details to proceed.</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Full Name" className="w-full p-3 border border-gray-900 bg-transparent"/>
                            <input type="email" placeholder="Email Address" className="w-full p-3 border border-gray-900 bg-transparent"/>
                            <input type="tel" placeholder="Phone Number" className="w-full p-3 border border-gray-900 bg-transparent"/>
                            <button onClick={() => {
                                console.log("LEAD CAPTURED (SIMULATED):", {
                                    name: "User's Name", // In a real app, get this from state
                                    email: "User's Email",
                                    phone: "User's Phone",
                                    quote: finalCost,
                                    answers: userAnswers
                                });
                                setShowThankYou(true);
                            }} className="w-full bg-gray-900 text-white font-mono py-2 px-4 hover:bg-gray-700">Send My Info</button>
                        </div>
                    </div>
                )}
                
                {showThankYou && (
                     <p className="font-mono text-lg">Thank you! We've received your information and will contact you soon.</p>
                )}

                <button onClick={restart} className="mt-6 text-sm underline font-mono">Start Over</button>
            </div>
        );
    }

    return (
        <div className="relative w-full border border-gray-900 p-8 min-h-[400px]">
            {questionPath.length > 0 && (
                 <button onClick={goBack} className="absolute top-8 left-8 text-gray-900 font-mono hover:underline">&larr; Back</button>
            )}
            <div className="w-full bg-gray-300 h-1 my-8">
                <div className="bg-gray-900 h-1" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-6">{currentQData.title}</h2>
                {currentQData.type === 'options' && (
                    <div className="space-y-3 font-mono">
                        {currentQData.options.map(opt => (
                            <button key={opt.value.toString()} onClick={() => handleAnswer(currentQData, opt.value)} className="w-full text-left p-4 border border-gray-900 hover:bg-gray-200 block">
                                {opt.text}
                            </button>
                        ))}
                    </div>
                )}
                {currentQData.type === 'number' && (
                    <div>
                        <input type="number" id={`input-${currentQData.id}`} placeholder={currentQData.placeholder} className="w-full p-4 text-xl border-b-2 border-gray-900 outline-none bg-transparent font-mono" onKeyPress={(e) => { if (e.key === 'Enter') { handleAnswer(currentQData, e.target.value || '0'); } }}/>
                        <button onClick={() => handleAnswer(currentQData, document.getElementById(`input-${currentQData.id}`).value || '0')} className="mt-6 bg-gray-900 text-white font-mono py-2 px-4 hover:bg-gray-700">OK</button>
                    </div>
                )}
                 {currentQData.type === 'multi_number' && (
                    <div className="font-mono space-y-4">
                        {currentQData.fields.map(field => (
                             <div key={field.id} className="grid grid-cols-2 items-center gap-4">
                                 <label htmlFor={`input-${field.id}`} className="text-lg">{field.label}</label>
                                 <input type="number" id={`input-${field.id}`} placeholder="0" className="p-3 text-lg border-b-2 border-gray-900 outline-none bg-transparent"/>
                             </div>
                        ))}
                        <button onClick={() => {
                            const multiValue = {};
                            currentQData.fields.forEach(field => {
                                multiValue[field.id] = document.getElementById(`input-${field.id}`).value || '0';
                            });
                            handleAnswer(currentQData, multiValue);
                        }} className="mt-6 bg-gray-900 text-white font-mono py-2 px-4 hover:bg-gray-700 !ml-auto !block">OK</button>
                    </div>
                )}
            </div>
        </div>
    );
};




const PricingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const pricingFaqData = [
        {
          name: "How much does a weekly meal plan cost?",
          answer: "Our weekly meal plans range from $13.50 for lighter breakfast options to $24 for full dinner meals. The average price is typically around $18.50 per meal. We offer a 10% discount for couples and an additional 10% for families of 4 or more. Significant discounts of 10-20% are also available for monthly or seasonal billing."
        },
        {
          name: "What is the cost for a small event or party?",
          answer: "Pricing for small events is flexible based on your needs. A simple food drop-off service starts as low as $25 per person. Full-service events, which can include passed appetizers, a buffet, or a coursed family-style meal, can range up to $85 per person or more, depending on menu complexity and service style. The price per person decreases for larger groups."
        },
        {
          name: "How much does an intimate dinner at home cost?",
          answer: "An intimate dinner at your home generally ranges from $65 to $125 per person. For parties of two, pricing begins at $95 per person. We can get extra fancy too, if you like, and the sky is the limit."
        },
        {
          name: "How much is a private pizza party?",
          answer: "Our private pizza parties start at $300 for groups of up to 15 people. We also offer add-on services like salads, appetizers, and desserts, which typically range from an additional $15 to $30 per person."
        }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": pricingFaqData.map(item => ({
            "@type": "Question",
            "name": item.name,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };
    
    return (
        <>
            <Helmet>
                <title>Pricing | Local Effort</title>
                <meta name="description" content="How much does a personal chef cost? Find pricing information for Local Effort's personal chef services, including weekly meal plans, event catering, intimate dinners, and private pizza parties." />
            </Helmet>
            <JsonLd data={faqSchema} />
            <div className="space-y-16">
                <h2 className="text-5xl md:text-7xl font-bold uppercase">Pricing</h2>
                <p className="font-mono text-lg max-w-3xl">Use our estimator for a ballpark figure, or review our general pricing guidelines below. All menus are custom and prices may vary. Contact us for a detailed quote.</p>
                
                <section>
                    <h3 className="text-3xl font-bold uppercase mb-4">Cost Estimator</h3>
                    <CostEstimator />
                </section>

                <section>
                    <h3 className="text-3xl font-bold uppercase mb-4">General Pricing FAQ</h3>
                    <div className="space-y-px bg-gray-900 border border-gray-900">
                        {pricingFaqData.map((item, index) => (
                            <div key={index} className="bg-[#F5F5F5]">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full p-8 text-left flex justify-between items-center"
                                >
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
                 <button className="bg-gray-900 text-white font-mono py-3 px-6 text-lg hover:bg-gray-700">Request a Quote</button>
            </div>
        </>
    );
};


const Footer = () => {
  return (
    <footer className="p-8 mt-16 border-t border-gray-900 font-mono text-sm">
      <div className="flex justify-between">
        <div>
            <p>&copy; {new Date().getFullYear()} Local Effort</p>
            <p className="text-gray-600">Roseville, MN | Midwest</p>
        </div>
        <div className="flex space-x-4">
          <a href="#instagram" className="underline">Instagram</a>
          <a href="#facebook" className="underline">Facebook</a>
          <a href="#thumbtack" className="underline">Thumbtack</a>
        </div>
      </div>
    </footer>
  );
};

export default App;
