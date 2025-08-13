// src/App.js

import React from 'react';
import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CrowdfundingTab from "./CrowdfundingTab";
import logo from './logo.png';

// CrowdfundingTab component (pizza tracker) — START
function CrowdfundingTab({ goal = 1000, initialFilled = 100 }) {
import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * CrowdfundingTab
 * - Goal-driven presale tracker focused on pizzas & pies
 * - SVG pizza with 1,000 slices. Filled slices == contributors (or pizzas sold)
 * - Starts at 100 filled slices so you can preview
 * - Exposes window.addContributors(n) for quick simulation
 */
export default function CrowdfundingTab({ goal = 1000, initialFilled = 100 }) {
  const TOTAL_SLICES = goal; // 1000 by default
  const [filled, setFilled] = useState(Math.min(initialFilled, TOTAL_SLICES));
  const lastFilledRef = useRef(filled);

  // expose a quick test hook for you / your agent logic
  useEffect(() => {
    window.addContributors = (n = 1) =>
      setFilled((c) => Math.min(TOTAL_SLICES, c + Math.max(1, Math.floor(n))));
    return () => {
      delete window.addContributors;
    };
  }, [TOTAL_SLICES]);

  // track which indices just changed so we can animate them
  const justAdded = useMemo(() => {
    const prev = lastFilledRef.current;
    const now = filled;
    lastFilledRef.current = now;
    if (now <= prev) return new Set();
    const s = new Set();
    for (let i = prev; i < now; i++) s.add(i);
    return s;
  }, [filled]);

  // geometry (kept tiny for performance):
  const size = 360; // viewBox size
  const cx = size / 2;
  const cy = size / 2;
  const R = 160; // outer radius (pizza edge)
  const r = 70; // inner radius (creates a hub so wedges look clean)
  const crust = 175; // slightly bigger circle for crust glow
  const dTheta = (2 * Math.PI) / TOTAL_SLICES;

  const slices = useMemo(() => {
    const arr = new Array(TOTAL_SLICES);
    for (let i = 0; i < TOTAL_SLICES; i++) {
      const a0 = i * dTheta - Math.PI / 2; // rotate so first slice starts at top
      const a1 = (i + 1) * dTheta - Math.PI / 2;
      const x0 = cx + R * Math.cos(a0);
      const y0 = cy + R * Math.sin(a0);
      const x1 = cx + R * Math.cos(a1);
      const y1 = cy + R * Math.sin(a1);
      const xi1 = cx + r * Math.cos(a1);
      const yi1 = cy + r * Math.sin(a1);
      const xi0 = cx + r * Math.cos(a0);
      const yi0 = cy + r * Math.sin(a0);
      // small arc flags for 1000-slice pizza
      const large = 0;
      const sweepOuter = 1;
      const sweepInner = 0;
      const d = `M ${x0} ${y0} A ${R} ${R} 0 ${large} ${sweepOuter} ${x1} ${y1} L ${xi1} ${yi1} A ${r} ${r} 0 ${large} ${sweepInner} ${xi0} ${yi0} Z`;
      arr[i] = d;
    }
    return arr;
  }, [TOTAL_SLICES, dTheta, cx, cy, R, r]);

  const pct = Math.round((filled / TOTAL_SLICES) * 1000) / 10; // 0.1% precision

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4">
      {/* Header / KPIs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-2xl font-semibold">Presale Crowdfunding</div>
        <div className="flex items-center gap-6 text-sm">
          <Stat label="Pizzas Goal" value={TOTAL_SLICES.toLocaleString()} />
          <Stat label="Pizzas Sold" value={filled.toLocaleString()} />
          <Stat label="Progress" value={`${pct}%`} />
        </div>
      </div>

      {/* Tabs local to this feature (Products / Tracker) */}
      <LocalTabs
        tabs={["Products", "Pizza Tracker"]}
        render={({ active }) => (
          <div className="rounded-2xl shadow p-4 bg-white">
            {active === 0 ? (
              <ProductsPanel onQuickBuy={() => setFilled((c) => Math.min(c + 1, TOTAL_SLICES))} />
            ) : (
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col gap-4">
                  <div className="text-lg font-medium">Pizza Progress (1,000 slices)</div>
                  <div className="text-sm opacity-70">
                    Each filled wedge = 1 presold pizza. Starts at 100 to preview. Call <code>addContributors(n)</code> in the console or use the + buttons.
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={() => setFilled((c) => Math.min(TOTAL_SLICES, c + 1))}>+1</button>
                    <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={() => setFilled((c) => Math.min(TOTAL_SLICES, c + 10))}>+10</button>
                    <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={() => setFilled((c) => Math.min(TOTAL_SLICES, c + 100))}>+100</button>
                    <button className="px-3 py-2 rounded-xl bg-neutral-200" onClick={() => setFilled(0)}>Reset</button>
                  </div>
                  <ProgressBar value={filled} max={TOTAL_SLICES} />
                </div>
                <div className="flex items-center justify-center">
                  <PizzaSVG
                    size={size}
                    cx={cx}
                    cy={cy}
                    R={R}
                    inner={r}
                    crust={crust}
                    paths={slices}
                    filled={filled}
                    justAdded={justAdded}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-start">
      <div className="text-xs uppercase tracking-wide opacity-60">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-3 rounded-full bg-neutral-200 overflow-hidden">
      <div
        className="h-full bg-black transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function LocalTabs({ tabs, render }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={`px-3 py-2 rounded-xl border ${
              i === active ? "bg-black text-white border-black" : "bg-white border-neutral-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {render({ active })}
    </div>
  );
}

function ProductsPanel({ onQuickBuy }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <ProductCard
        title="Pizza Presale"
        desc="One 12\" artisan pizza voucher. Redeem later."
        price="$20"
        onBuy={onQuickBuy}
      />
      <ProductCard
        title="Pie Presale"
        desc="One 9\" seasonal pie voucher. Redeem later."
        price="$24"
        onBuy={onQuickBuy}
      />
      <ProductCard
        title="Supporter Pack"
        desc="Sticker + thank-you wall mention."
        price="$10"
        onBuy={onQuickBuy}
      />
    </div>
  );
}

function ProductCard({ title, desc, price, onBuy }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4 flex flex-col gap-3">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm opacity-70">{desc}</div>
      <div className="mt-auto flex items-center justify-between">
        <div className="font-semibold">{price}</div>
        <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={onBuy}>Prebuy</button>
      </div>
    </div>
  );
}

function PizzaSVG({ size, cx, cy, R, inner, crust, paths, filled, justAdded }) {
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="drop-shadow-sm"
    >
      {/* subtle crust halo */}
      <circle cx={cx} cy={cy} r={crust} fill="#f2d3a0" opacity="0.25" />
      {/* base (cheese) */}
      <circle cx={cx} cy={cy} r={R} fill="#f4cf5d" stroke="#e1b44d" strokeWidth="2" />
      {/* hub */}
      <circle cx={cx} cy={cy} r={inner} fill="#f4cf5d" />

      {/* slices */}
      <g>
        {paths.map((d, i) => {
          const isFilled = i < filled;
          const highlight = justAdded.has(i);
          return (
            <path
              key={i}
              d={d}
              fill={isFilled ? "#d35435" : "transparent"}
              stroke={"#9c2d11"}
              strokeWidth={isFilled ? 0.4 : 0.2}
              opacity={isFilled ? 1 : 0.1}
              style={{
                transition: "opacity 300ms ease, stroke-width 300ms ease",
                filter: highlight ? "drop-shadow(0 0 6px rgba(255,80,0,0.6))" : "none",
              }}
            />
          );
        })}
      </g>

      {/* center label */}
      <g>
        <circle cx={cx} cy={cy} r={inner - 8} fill="white" stroke="#ddd" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="28" fontWeight="700">{filled}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="12" opacity="0.7">/ {paths.length}</text>
      </g>
    </svg>
  );
}
}
// CrowdfundingTab component — END
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
                } else if (people <= 29) {
                    totalCost = people * model.pizzaParty.per_person_mid;
                    breakdownCalc.push(`Pizza party for ${people} guests at $${model.pizzaParty.per_person_mid}/person: $${totalCost.toFixed(2)}`);
                } else { // 30+
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
            <Route path="/crowdfunding" element={<CrowdfundingTab goal={1000} initialFilled={100} />} />
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
          <Link to="/crowdfunding">Crowdfunding</Link>

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
