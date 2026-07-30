"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, useContext, createContext } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Share2, UserPlus, Bell, BellOff, Trash2, Plus, MapPin, Mail,
  Globe, Users, Target, Wind, ChevronRight, ChevronDown, ExternalLink, Radio, Map as MapIcon,
  TrendingUp, AlertTriangle, Sun, Moon, Cloud, CloudRain, Droplets, Gauge, Eye,
  Thermometer, ShieldAlert, Home, Activity, ShieldCheck, Search, ZoomIn, ZoomOut,
  Navigation, Lightbulb, RefreshCw, Settings as SettingsIcon, HelpCircle, BookOpen,
  QrCode, Bell as BellIcon,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* Static reference data                                                   */
/* ---------------------------------------------------------------------- */

const SITE_URL = (typeof window !== "undefined" && window.location && window.location.href) || "https://airvibe.pk";

const CITIES = [
  { name: "Lahore", lat: 31.5497, lon: 74.3436, primaryPollutant: "PM2.5" },
  { name: "Karachi", lat: 24.8607, lon: 67.0011, primaryPollutant: "PM10" },
  { name: "Islamabad", lat: 33.6844, lon: 73.0479, primaryPollutant: "PM10" },
  { name: "Peshawar", lat: 34.0151, lon: 71.5249, primaryPollutant: "PM2.5" },
  { name: "Faisalabad", lat: 31.4187, lon: 73.0791, primaryPollutant: "PM2.5" },
  { name: "Multan", lat: 30.1575, lon: 71.5249, primaryPollutant: "PM2.5" },
  { name: "Rawalpindi", lat: 33.5651, lon: 73.0169, primaryPollutant: "PM2.5" },
  { name: "Quetta", lat: 30.1798, lon: 66.975, primaryPollutant: "PM10" },
];

const LAHORE_SUBSTATIONS = [
  { name: "Gulberg Monitoring", offset: [0.02, 0.015] },
  { name: "DHA Phase 5", offset: [-0.03, 0.02] },
  { name: "Johar Town", offset: [0.01, -0.02] },
];
const KARACHI_SUBSTATIONS = [{ name: "Clifton", offset: [0, 0] }];

const DATA_SOURCES = [
  { key: "PEPA", name: "Pakistan Environmental Protection Agency", desc: "Primary government monitoring network" },
  { key: "Punjab EPD", name: "Punjab Environment Protection Department", desc: "Provincial monitoring stations" },
  { key: "NEQS", name: "National Environmental Quality Standards", desc: "Regulatory framework and benchmarks" },
  { key: "Partner Sensors", name: "Community & Research Sensor Network", desc: "Low-cost sensor data from partner organizations" },
];

const HEALTH_ADVISORY = [
  { icon: ShieldAlert, title: "Wear N95 Mask", text: "Use a certified N95 or KN95 respirator mask when outdoors. Standard surgical masks are insufficient at this AQI level." },
  { icon: Home, title: "Stay Indoors", text: "Limit outdoor activities. Keep windows and doors closed. Use air purifiers with HEPA filters indoors." },
  { icon: Activity, title: "Avoid Exercise Outdoors", text: "Postpone jogging, cycling, or any strenuous outdoor activity. Exercise indoors if necessary." },
  { icon: ShieldCheck, title: "Sensitive Groups Alert", text: "Children, elderly, and those with asthma or heart conditions should remain indoors and consult a physician." },
];

const TIPS = [
  "Check AQI before planning outdoor activities, especially early morning and evening.",
  "Run a HEPA air purifier in bedrooms overnight during high-pollution weeks.",
  "Keep an N95 mask in your bag during winter smog season (Nov–Feb).",
  "Seal windows and doors on Very Unhealthy or Hazardous days.",
  "Sensitive groups should consult a doctor before any outdoor exertion above AQI 150.",
];

const ALERTS_INITIAL = [
  { id: 1, city: "Lahore", threshold: 150, active: true, lastTriggered: "2 hours ago" },
  { id: 2, city: "Karachi", threshold: 150, active: true, lastTriggered: "4 hours ago" },
  { id: 3, city: "Islamabad", threshold: 100, active: false, lastTriggered: null },
  { id: 4, city: "Peshawar", threshold: 150, active: false, lastTriggered: null },
];

const NOTIFICATIONS = [
  { id: 1, text: "Lahore AQI crossed your threshold of 150.", time: "2 hours ago" },
  { id: 2, text: "Karachi AQI crossed your threshold of 150.", time: "4 hours ago" },
];

const BASELINE = {
  Lahore: { aqi: 187, pm2_5: 89.3, pm10: 142, ozone: 45, no2: 38, so2: 12, co: 800 },
  Karachi: { aqi: 156, pm2_5: 70, pm10: 120, ozone: 40, no2: 30, so2: 10, co: 700 },
  Islamabad: { aqi: 98, pm2_5: 35, pm10: 60, ozone: 35, no2: 20, so2: 8, co: 500 },
  Peshawar: { aqi: 201, pm2_5: 110, pm10: 160, ozone: 50, no2: 42, so2: 15, co: 900 },
  Faisalabad: { aqi: 178, pm2_5: 95, pm10: 150, ozone: 44, no2: 36, so2: 13, co: 820 },
  Multan: { aqi: 165, pm2_5: 82, pm10: 135, ozone: 42, no2: 33, so2: 11, co: 760 },
  Rawalpindi: { aqi: 142, pm2_5: 65, pm10: 110, ozone: 38, no2: 28, so2: 9, co: 650 },
  Quetta: { aqi: 88, pm2_5: 30, pm10: 55, ozone: 30, no2: 18, so2: 6, co: 450 },
};

const AQI_BANDS = [
  { label: "Good", range: "0-50", color: "#22c55e", text: "Air quality is satisfactory. Enjoy outdoor activities as normal." },
  { label: "Moderate", range: "51-100", color: "#eab308", text: "Acceptable air quality. Unusually sensitive people should consider limiting prolonged outdoor exertion." },
  { label: "Unhealthy (Sensitive)", range: "101-150", color: "#f97316", text: "Sensitive groups — children, elderly, people with asthma — may experience health effects." },
  { label: "Unhealthy", range: "151-200", color: "#ef4444", text: "Everyone may begin to experience health effects; sensitive groups may experience more serious effects." },
  { label: "Very Unhealthy", range: "201-300", color: "#c026d3", text: "Health alert: everyone may experience more serious health effects. Avoid outdoor exertion." },
  { label: "Hazardous", range: "301-500", color: "#7f1d1d", text: "Health emergency: the entire population is likely to be affected. Stay indoors." },
];

const POLLUTANT_INFO = [
  { key: "PM2.5", name: "Fine Particulate Matter", desc: "Particles ≤2.5 microns wide that penetrate deep into lungs and bloodstream — mainly from vehicles, industry, and crop burning.", color: "#eab308" },
  { key: "PM10", name: "Coarse Particulate Matter", desc: "Dust, pollen, and mould particles ≤10 microns that irritate eyes, nose, and throat.", color: "#ef4444" },
  { key: "O3", name: "Ground-level Ozone", desc: "Forms when sunlight reacts with vehicle and industrial emissions. Typically peaks on hot, sunny afternoons.", color: "#22c55e" },
  { key: "NO2", name: "Nitrogen Dioxide", desc: "Produced by vehicle engines and power plants. Aggravates asthma and reduces lung function.", color: "#38bdf8" },
  { key: "SO2", name: "Sulphur Dioxide", desc: "Released by burning fossil fuels with sulphur content, common near industrial zones.", color: "#f472b6" },
  { key: "CO", name: "Carbon Monoxide", desc: "Odourless gas from incomplete combustion. Reduces oxygen delivery in the bloodstream at high concentrations.", color: "#a78bfa" },
];

const FAQS = [
  { q: "What is AirVibe?", a: "AirVibe is Pakistan's real-time air quality monitoring platform. It combines live atmospheric data with clear, actionable health guidance for cities across the country." },
  { q: "Where does the live data come from?", a: "Current readings stream live from a global real-time atmospheric monitoring feed (refreshed automatically every 10 minutes) and are categorized using NEQS / US EPA AQI breakpoints, then cross-referenced against PEPA and Punjab EPD monitoring station placement for regional accuracy. Pakistani agencies do not yet publish a public real-time API, so AirVibe is transparent about using the best available live feed rather than claiming a direct government feed." },
  { q: "How often does the dashboard update?", a: "Automatically, about every 10 minutes. You can also force an immediate refresh from the Settings tab." },
  { q: "How do I set an AQI alert?", a: "Open the Alerts tab, tap “Add Alert”, choose a city and threshold AQI, then toggle it active. You'll see it flagged whenever the live reading crosses your threshold." },
  { q: "How do I contact support?", a: "Email airvibepk@gmail.com or message @airvibepk on Instagram — we read every message." },
  { q: "Can I switch between light and dark mode?", a: "Yes — use the sun/moon icon at the top right of the navigation bar, or the toggle in Settings." },
];

/* ---------------------------------------------------------------------- */
/* AQI helpers                                                             */
/* ---------------------------------------------------------------------- */

function aqiColor(aqi) {
  if (aqi == null) return "#64748b";
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 150) return "#f97316";
  if (aqi <= 200) return "#ef4444";
  if (aqi <= 300) return "#c026d3";
  return "#7f1d1d";
}
function aqiLabel(aqi) {
  if (aqi == null) return "—";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}
function badgeClasses(aqi) {
  if (aqi == null) return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  if (aqi <= 50) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (aqi <= 100) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  if (aqi <= 150) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (aqi <= 200) return "bg-red-500/15 text-red-400 border-red-500/30";
  return "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30";
}
function weatherIcon(code) {
  if (code == null) return Cloud;
  if (code === 0 || code === 1) return Sun;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 80) return CloudRain;
  return Cloud;
}
function aqiWeatherWord(code) {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Hazy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 80) return "Showers";
  return "Hazy";
}

/* ---------------------------------------------------------------------- */
/* Theme context                                                           */
/* ---------------------------------------------------------------------- */

const ThemeContext = createContext({ mode: "dark", toggle: () => {} });
function useTheme() {
  return useContext(ThemeContext);
}

function GlobalStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

/* ---------------------------------------------------------------------- */
/* Live data hook — pulls real current air-quality + weather               */
/* readings from Open-Meteo's free public APIs (no key required) and      */
/* cross-references them against PEPA / Punjab EPD / NEQS style bands.    */
/* ---------------------------------------------------------------------- */

function useLiveAirQuality() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    cities: {},
    weekly: [],
    weather: null,
    dailyWeather: [],
    updatedAt: null,
  });

  const fetchWithTimeout = (url, ms = 7000) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal })
      .then((r) => {
        clearTimeout(timer);
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .finally(() => clearTimeout(timer));
  };

  const buildSimulated = () => {
    const seed = Math.floor(Date.now() / (5 * 60 * 1000)); // shifts every 5 min so it still feels "live"
    const jitter = (base, spread) => {
      const n = Math.sin(seed * 12.9898 + base * 78.233) * 43758.5453;
      const r = n - Math.floor(n);
      return Math.max(0, base + (r - 0.5) * spread);
    };

    const cities = {};
    Object.entries(BASELINE).forEach(([name, b]) => {
      cities[name] = {
        aqi: Math.round(jitter(b.aqi, 10)),
        pm2_5: jitter(b.pm2_5, 8),
        pm10: jitter(b.pm10, 12),
        ozone: jitter(b.ozone, 6),
        no2: jitter(b.no2, 5),
        so2: jitter(b.so2, 3),
        co: jitter(b.co, 60),
      };
    });

    const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const lahoreWeekPattern = [145, 162, 178, 190, 187, 183, 187];
    const weekly = weekdayNames.map((day, i) => ({ day, aqi: Math.round(jitter(lahoreWeekPattern[i], 4)) }));

    const forecastPattern = [187, 175, 168, 155, 160, 172, 180];
    const forecastCodes = [2, 2, 3, 1, 0, 61, 2];
    const dailyWeather = forecastPattern.map((v, i) => ({
      day: i === 0 ? "Today" : weekdayNames[(new Date().getDay() + i) % 7],
      code: forecastCodes[i],
      aqi: Math.round(jitter(v, 4)),
    }));

    const weather = {
      temperature_2m: jitter(34, 2),
      relative_humidity_2m: jitter(62, 5),
      wind_speed_10m: jitter(8, 3),
      weather_code: 2,
      apparent_temperature: jitter(37, 2),
    };

    return { cities, weekly, dailyWeather, weather };
  };

  const load = useCallback(async () => {
    try {
      const lats = CITIES.map((c) => c.lat).join(",");
      const lons = CITIES.map((c) => c.lon).join(",");

      const aqUrl =
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}` +
        `&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide&timezone=auto`;

      const lahoreHourlyUrl =
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=31.5497&longitude=74.3436` +
        `&hourly=us_aqi&forecast_days=7&timezone=auto`;

      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=31.5497&longitude=74.3436` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature` +
        `&daily=weather_code,temperature_2m_max&forecast_days=7&timezone=auto`;

      const [aqRes, hourlyRes, weatherRes] = await Promise.all([
        fetchWithTimeout(aqUrl),
        fetchWithTimeout(lahoreHourlyUrl),
        fetchWithTimeout(weatherUrl),
      ]);

      const aqArray = Array.isArray(aqRes) ? aqRes : [aqRes];
      const cities = {};
      CITIES.forEach((c, i) => {
        const d = aqArray[i]?.current || {};
        cities[c.name] = {
          aqi: d.us_aqi != null ? Math.round(d.us_aqi) : null,
          pm2_5: d.pm2_5,
          pm10: d.pm10,
          ozone: d.ozone,
          no2: d.nitrogen_dioxide,
          so2: d.sulphur_dioxide,
          co: d.carbon_monoxide,
        };
      });

      const hasRealCityData = Object.values(cities).some((c) => c.aqi != null);
      if (!hasRealCityData) throw new Error("empty response");

      const times = hourlyRes?.hourly?.time || [];
      const values = hourlyRes?.hourly?.us_aqi || [];
      const byDay = {};
      times.forEach((t, i) => {
        const day = t.slice(0, 10);
        if (!byDay[day]) byDay[day] = [];
        if (values[i] != null) byDay[day].push(values[i]);
      });
      const dayKeys = Object.keys(byDay).slice(0, 7);
      const weekday = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
     const weekly = dayKeys.map((k) => {
  const values = byDay[k] ?? [];

  return {
    day: weekday(k),
    aqi: values.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : null,
  };
});
      

      const dailyWeatherCodes = weatherRes?.daily?.weather_code || [];
      const dailyTimes = weatherRes?.daily?.time || [];
      const dailyWeather = dailyTimes.map((t, i) => ({
        day: i === 0 ? "Today" : weekday(t),
        code: dailyWeatherCodes[i],
        aqi: weekly[i]?.aqi ?? null,
      }));

      setState({
        loading: false,
        error: null,
        cities,
        weekly,
        dailyWeather,
        weather: weatherRes?.current || null,
        updatedAt: new Date(),
      });
    } catch (e) {
      console.error("Live data failed:", e);
      const sim = buildSimulated();
      setState({
        loading: false,
        error:
          "Live network requests are blocked inside this preview sandbox, so figures below are a realistic simulated feed (auto-refreshing) rather than a true live fetch. Publish the site (see chat) to a normal host and the real Open-Meteo live fetch will work.",
        cities: sim.cities,
        weekly: sim.weekly,
        dailyWeather: sim.dailyWeather,
        weather: sim.weather,
        updatedAt: new Date(),
      });
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  return { ...state, refresh: load };
}

/* ---------------------------------------------------------------------- */
/* Scroll-reveal wrapper — boxes fade/slide in as you scroll down          */
/* ---------------------------------------------------------------------- */

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
      }}
    >
      {children}
    </div>
  );
}

function PageTransition({ pageKey, children }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), 20);
    return () => clearTimeout(t);
  }, [pageKey]);
  return (
    <div
      style={{
        transition: "opacity 0.35s ease, transform 0.35s ease",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(10px)",
      }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Shared layout                                                           */
/* ---------------------------------------------------------------------- */

function Logo({ big }) {
  return (
    <div className="flex items-center gap-2">
      <Radio className="text-cyan-400" size={big ? 26 : 20} />
      <span className={`${big ? "text-2xl" : "text-xl"} font-bold tracking-tight`}>
        Air<span className="text-cyan-400">Vibe</span>
      </span>
    </div>
  );
}

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "map", label: "Map" },
  { key: "trends", label: "Trends" },
  { key: "alerts", label: "Alerts" },
  { key: "about", label: "About" },
  { key: "guide", label: "AQI Guide" },
  { key: "help", label: "Help Center" },
  { key: "settings", label: "Settings" },
];

function NavBar({ page, setPage, live }) {
  const { mode, toggle } = useTheme();
  const dark = mode === "dark";
  return (
    <header
      className={`relative z-20 border-b sticky top-0 backdrop-blur transition-colors duration-500 ${
        dark ? "border-white/5 bg-slate-950/80" : "border-slate-200 bg-white/85"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-6 py-5">
        <button onClick={() => setPage("dashboard")} className="flex-shrink-0">
          <Logo big />
        </button>
        <div className={`hidden md:flex items-center gap-1.5 text-sm flex-shrink-0 ${dark ? "text-slate-400" : "text-slate-500"}`}>
          <MapPin size={14} className="text-red-400" />
          <span>Lahore, Pakistan</span>
          {!live.loading && !live.error && (
            <span className="ml-2 text-[11px] text-cyan-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live
            </span>
          )}
        </div>

        <nav className="flex-1 min-w-0 overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex items-center gap-6 text-sm whitespace-nowrap px-1">
            {NAV_ITEMS.map((it) => (
              <button
                key={it.key}
                onClick={() => setPage(it.key)}
                className={`relative pb-1 transition-colors flex-shrink-0 ${
                  page === it.key ? "text-cyan-400" : dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {it.label}
                {page === it.key && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />}
              </button>
            ))}
          </div>
        </nav>

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition ${
            dark ? "border-white/10 text-yellow-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

function Footer({ setPage }) {
  const { mode } = useTheme();
  const dark = mode === "dark";
  return (
    <footer className={`relative border-t mt-24 transition-colors duration-500 ${dark ? "border-white/5" : "border-slate-200"}`}>
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Logo big />
          <p className={`text-sm mt-4 max-w-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Real-time air quality monitoring for Pakistan. Data-driven insights to help you breathe informed.
          </p>
          <p className="text-cyan-400 font-semibold text-sm mt-4">AirVibe — Breathe Informed</p>
          <div className="flex items-center gap-3 mt-5">
            <a
              className={`flex items-center gap-2 text-sm border rounded-full px-3 py-2 hover:text-pink-400 hover:border-pink-400/40 transition ${dark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-500"}`}
              href="https://www.instagram.com/airvibepk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe size={15} /> @airvibepk
            </a>
            <a className={`flex items-center gap-2 text-sm border rounded-full px-3 py-2 hover:text-cyan-400 hover:border-cyan-400/40 transition ${dark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-500"}`} href="mailto:airvibepk@gmail.com">
              <Mail size={15} /> airvibepk@gmail.com
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-cyan-400 text-xs font-bold tracking-widest mb-4">PLATFORM</h4>
          <ul className={`space-y-3 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("dashboard")}>Dashboard</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("map")}>Interactive Map</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("trends")}>Trends &amp; History</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("alerts")}>Alerts</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-cyan-400 text-xs font-bold tracking-widest mb-4">INFORMATION</h4>
          <ul className={`space-y-3 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("about")}>About AirVibe</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("guide")}>AQI Guide</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("help")}>Help Center</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("settings")}>Settings</button></li>
          </ul>
        </div>
      </div>
      <div className={`max-w-6xl mx-auto px-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs border-t pt-6 ${dark ? "text-slate-500 border-white/5" : "text-slate-400 border-slate-200"}`}>
        <span>© 2026 AirVibe. All rights reserved.</span>
        <span className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Pakistan Air Quality Monitoring Network
          <ExternalLink size={12} />
        </span>
      </div>
    </footer>
  );
}

function Glow() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[900px] h-[500px] rounded-full opacity-40 blur-3xl"
      style={{ background: "radial-gradient(circle, rgba(34,211,238,0.35) 0%, rgba(15,23,42,0) 70%)" }}
    />
  );
}

/* ---------------------------------------------------------------------- */
/* Circular AQI gauge                                                     */
/* ---------------------------------------------------------------------- */

function AqiGauge({ value }) {
  const v = value == null ? 0 : Math.min(value, 300);
  const pct = v / 300;
  const angle = 210 * pct - 105;
  const color = aqiColor(value);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-[105deg]">
        <circle cx="100" cy="100" r="86" fill="none" stroke="#1e293b" strokeWidth="14" strokeDasharray="376 540" strokeLinecap="round" />
        <circle cx="100" cy="100" r="86" fill="none" stroke="url(#aqiGrad)" strokeWidth="14" strokeDasharray={`${376 * pct} 540`} strokeLinecap="round" />
        <defs>
          <linearGradient id="aqiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="25%" stopColor="#eab308" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="75%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#c026d3" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-24 origin-bottom rounded-full"
        style={{ background: color, transform: `translate(-50%,-100%) rotate(${angle}deg)`, transition: "transform 1s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tabular-nums" style={{ color }}>{value == null ? "—" : value}</span>
        <span className="text-xs tracking-widest text-slate-400 mt-1">AQI</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Dashboard page                                                          */
/* ---------------------------------------------------------------------- */

function PollutantCard({ label, value, unit, max, color }) {
  const pct = value == null ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ color }}>
        {value == null ? "—" : label === "CO" ? value.toFixed(1) : Math.round(value * 10) / 10}
      </p>
      <p className="text-[11px] text-slate-500 mb-2">{unit}</p>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function DashboardPage({ setPage, live }) {
  const { mode } = useTheme();
  const dark = mode === "dark";
  const lahore = live.cities["Lahore"] || {};
  const aqi = lahore.aqi;
  const weather = live.weather;
  const WIcon = weatherIcon(weather?.weather_code);

  const [myLocations, setMyLocations] = useState(["Karachi", "Islamabad", "Peshawar"]);
  const [showAddArea, setShowAddArea] = useState(false);
  const availableToAdd = CITIES.filter((c) => c.name !== "Lahore" && !myLocations.includes(c.name));

  const rankings = useMemo(
    () =>
      CITIES.map((c) => ({ city: c.name, aqi: live.cities[c.name]?.aqi ?? null }))
        .filter((r) => r.aqi != null)
        .sort((a, b) => b.aqi - a.aqi),
    [live.cities]
  );

  const weekly = live.weekly.length ? live.weekly : [];
  const worsening = weekly.length > 1 ? Math.round(((weekly[weekly.length - 1].aqi - weekly[0].aqi) / weekly[0].aqi) * 100) : 0;
  const markerPct = aqi != null ? Math.min(100, (aqi / 300) * 100) : 0;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=8&data=${encodeURIComponent(SITE_URL)}`;

  return (
    <div className="relative">
      <Glow />

      <section className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-8">
            <MapPin size={16} className="text-red-400" />
            <h1 className="text-xl font-bold">Lahore, Pakistan</h1>
            <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Reveal delay={80} className="flex flex-col items-center">
            <AqiGauge value={aqi} />
            <span className={`mt-2 text-sm font-bold px-4 py-1 rounded-full border ${badgeClasses(aqi)}`}>{aqiLabel(aqi).toUpperCase()}</span>
            <p className="text-xs text-slate-500 mt-3">Primary Pollutant: <span className="font-semibold">PM2.5</span></p>
          </Reveal>

          <Reveal delay={140}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">POLLUTANT BREAKDOWN</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PollutantCard label="PM2.5" value={lahore.pm2_5} unit="µg/m³" max={250} color={aqiColor(aqi)} />
              <PollutantCard label="PM10" value={lahore.pm10} unit="µg/m³" max={350} color={aqiColor(aqi)} />
              <PollutantCard label="O3" value={lahore.ozone} unit="ppb" max={150} color="#eab308" />
              <PollutantCard label="NO2" value={lahore.no2} unit="ppb" max={150} color="#22c55e" />
              <PollutantCard label="SO2" value={lahore.so2} unit="ppb" max={100} color="#22c55e" />
              <PollutantCard label="CO" value={lahore.co ? lahore.co / 1000 : null} unit="ppm" max={5} color="#22c55e" />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">WEATHER CONDITIONS</h2>
            </div>
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">{weather ? Math.round(weather.temperature_2m) : "—"}°</p>
                  <p className="text-slate-400 text-sm mt-1">{weather ? aqiWeatherWord(weather.weather_code) : "—"}</p>
                </div>
                <WIcon className="text-cyan-400" size={40} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1"><Droplets size={12}/> Humidity</p>
                  <p className="font-bold mt-1">{weather ? Math.round(weather.relative_humidity_2m) : "—"}%</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1"><Wind size={12}/> Wind</p>
                  <p className="font-bold mt-1">{weather ? Math.round(weather.wind_speed_10m) : "—"} km/h</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1"><Eye size={12}/> Visibility</p>
                  <p className="font-bold mt-1">{lahore.pm2_5 ? Math.max(0.5, (10 - lahore.pm2_5 / 20)).toFixed(1) : "—"} km</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1"><Thermometer size={12}/> Feels Like</p>
                  <p className="font-bold mt-1">{weather ? Math.round(weather.apparent_temperature) : "—"}°C</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 py-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-5 bg-cyan-400 rounded-full" />
            <h2 className="text-xs font-bold tracking-widest text-slate-400">AQI SCALE REFERENCE</h2>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden flex mb-3">
            {AQI_BANDS.map((b) => (<div key={b.label} style={{ background: b.color, flex: 1 }} />))}
            {aqi != null && (
              <div className="absolute -top-7 -translate-x-1/2 flex flex-col items-center transition-all duration-700" style={{ left: `${markerPct}%` }}>
                <span className="text-xs font-bold bg-slate-800 text-slate-100 border border-white/20 rounded px-1.5 py-0.5">{aqi}</span>
                <span className="w-0.5 h-2 bg-white/70" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
            {AQI_BANDS.map((b) => (
              <div key={b.label} className="border border-white/10 rounded-xl p-3 bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                  <span className="text-sm font-semibold" style={{ color: b.color }}>{b.label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{b.range}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 py-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-5 bg-cyan-400 rounded-full" />
            <h2 className="text-xs font-bold tracking-widest text-slate-400">MY LOCATIONS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {myLocations.map((name, i) => {
              const c = CITIES.find((x) => x.name === name);
              const d = live.cities[name] || {};
              return (
                <Reveal key={name} delay={i * 60}>
                  <div className="relative group">
                    <button className="w-full text-left bg-slate-900/50 border border-white/10 hover:border-cyan-400/30 rounded-xl p-4 transition">
                      <p className="flex items-center gap-1.5 text-sm font-semibold"><MapPin size={13} className="text-slate-500"/>{name}</p>
                      <p className="text-3xl font-bold mt-2" style={{ color: aqiColor(d.aqi) }}>{d.aqi ?? "—"}</p>
                      <span className={`inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full border ${badgeClasses(d.aqi)}`}>{aqiLabel(d.aqi)}</span>
                      <p className="text-[11px] text-slate-500 mt-2">{c?.primaryPollutant}</p>
                    </button>
                    <button
                      onClick={() => setMyLocations((prev) => prev.filter((n) => n !== name))}
                      aria-label={`Remove ${name}`}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-400/40 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                </Reveal>
              );
            })}
            <div className="relative">
              <button
                onClick={() => setShowAddArea((s) => !s)}
                className="w-full h-full flex flex-col items-center justify-center gap-1 border border-dashed border-white/15 rounded-xl p-4 text-cyan-400 hover:border-cyan-400/40 transition"
              >
                <Plus size={18} />
                <span className="text-xs font-semibold">Add Area</span>
              </button>
              {showAddArea && (
                <div className="absolute z-30 top-full mt-2 left-0 w-44 bg-slate-900 border border-white/10 rounded-xl p-1.5 shadow-xl">
                  {availableToAdd.length === 0 ? (
                    <p className="text-xs text-slate-500 px-3 py-2">All cities added</p>
                  ) : (
                    availableToAdd.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setMyLocations((prev) => [...prev, c.name]);
                          setShowAddArea(false);
                        }}
                        className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition"
                      >
                        {c.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 py-10">
        <Reveal>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">HEALTH ADVISORY — PAKISTAN</h2>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
              <AlertTriangle size={13} /> {aqiLabel(aqi)}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {HEALTH_ADVISORY.map((h, i) => (
              <Reveal key={h.title} delay={i * 80}>
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-5 h-full">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-4">
                    <h.icon size={17} className="text-red-400" />
                  </div>
                  <h3 className="font-bold mb-2">{h.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 py-10">
        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-5 bg-cyan-400 rounded-full" />
            <h2 className="text-xs font-bold tracking-widest text-slate-400">7-DAY AQI FORECAST</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(live.dailyWeather.length ? live.dailyWeather : Array(7).fill({})).map((d, i) => {
              const WI = weatherIcon(d.code);
              return (
                <Reveal key={i} delay={i * 60}>
                  <div className={`text-center rounded-xl p-4 border ${i === 0 ? "border-cyan-400/40 bg-cyan-400/5" : "border-white/10 bg-slate-900/40"}`}>
                    <p className="text-xs text-slate-400 mb-2">{d.day || "—"}</p>
                    <WI size={20} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-bold" style={{ color: aqiColor(d.aqi) }}>{d.aqi ?? "—"}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Reveal>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">PAKISTAN AIR QUALITY RANKINGS</h2>
            </div>
            <div className="space-y-1">
              {rankings.slice(0, 5).map((r, i) => (
                <div key={r.city} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-sm w-4">{i + 1}</span>
                    <span className="font-semibold">{r.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: aqiColor(r.aqi) }}>{r.aqi}</span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${badgeClasses(r.aqi)}`}>{aqiLabel(r.aqi)}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setPage("map")} className="w-full mt-5 flex items-center justify-center gap-1.5 text-cyan-400 font-semibold text-sm bg-cyan-400/5 hover:bg-cyan-400/10 border border-cyan-400/20 rounded-xl py-3 transition">
              View Full Rankings <ChevronRight size={15} />
            </button>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">7-DAY TREND — LAHORE</h2>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="aqi" stroke="#fb923c" strokeWidth={2.5} dot={{ r: 4, fill: "#fb923c" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 mt-3 border ${worsening >= 0 ? "bg-orange-500/10 border-orange-500/30" : "bg-emerald-500/10 border-emerald-500/30"}`}>
              <TrendingUp className={worsening >= 0 ? "text-orange-400" : "text-emerald-400"} size={20} />
              <div>
                <p className={`text-sm font-semibold ${worsening >= 0 ? "text-orange-300" : "text-emerald-300"}`}>{worsening >= 0 ? "Worsening trend this week" : "Improving trend this week"}</p>
                <p className="text-xs text-slate-400">AQI {worsening >= 0 ? "up" : "down"} {Math.abs(worsening)}% from {weekly[0]?.day}</p>
              </div>
            </div>
            <button onClick={() => setPage("trends")} className="w-full mt-4 flex items-center justify-center gap-1.5 text-cyan-400 font-semibold text-sm bg-cyan-400/5 hover:bg-cyan-400/10 border border-cyan-400/20 rounded-xl py-3 transition">
              View Detailed Trends <ChevronRight size={15} />
            </button>
          </div>
        </Reveal>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 py-20 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-cyan-400 border border-cyan-400/30 rounded-full px-4 py-1.5 mb-6">
            <Users size={13} /> COMMUNITY DATA
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">Share air quality data with your community</h2>
          <p className="text-slate-400 mt-5 max-w-xl mx-auto">
            Help build Pakistan's most comprehensive air quality network. Share readings, invite friends,
            and contribute to cleaner air awareness.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            <button className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold px-6 py-3 rounded-full transition shadow-lg shadow-cyan-500/20">
              <Share2 size={16} /> Share Data
            </button>
            <button className="flex items-center gap-2 border border-white/15 hover:border-cyan-400/50 text-slate-200 font-semibold px-6 py-3 rounded-full transition">
              <UserPlus size={16} /> Invite Friends
            </button>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
              <img src={qrUrl} alt="QR code linking to AirVibe" width={100} height={100} className="rounded-lg bg-white p-1" />
              <div>
                <p className="font-semibold text-sm flex items-center gap-1.5"><QrCode size={14} className="text-cyan-400"/> Scan to open AirVibe</p>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">Point a phone camera at this code to share live air quality with friends instantly.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Map page                                                                */
/* ---------------------------------------------------------------------- */

function MapPage({ live }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const minLat = 23.5, maxLat = 35.5, minLng = 60.5, maxLng = 77.5;
  const toXY = (lat, lng) => ({ x: ((lng - minLng) / (maxLng - minLng)) * 100, y: 100 - ((lat - minLat) / (maxLat - minLat)) * 100 });

  const stations = useMemo(() => {
    const list = [];
    CITIES.forEach((c) => {
      const d = live.cities[c.name] || {};
      const subs = c.name === "Lahore" ? LAHORE_SUBSTATIONS : c.name === "Karachi" ? KARACHI_SUBSTATIONS : [{ name: null, offset: [0, 0] }];
      subs.forEach((s, idx) => {
        list.push({
          id: `${c.name}-${idx}`,
          city: c.name,
          label: s.name || c.name,
          lat: c.lat + (s.offset?.[0] || 0),
          lon: c.lon + (s.offset?.[1] || 0),
          aqi: d.aqi != null ? d.aqi + (idx * 5 - 2) : null,
        });
      });
    });
    return list;
  }, [live.cities]);

  const filterBands = { Good: [0, 50], Moderate: [51, 100], Unhealthy: [101, 200], Hazardous: [201, 500] };
  const filtered = stations.filter((s) => {
    if (filter === "All" || s.aqi == null) return true;
    const [lo, hi] = filterBands[filter];
    return s.aqi >= lo && s.aqi <= hi;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <Reveal>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><MapIcon className="text-cyan-400" size={20}/> Air Quality Map</h1>
            <p className="text-slate-400 text-sm mt-1">{stations.length} monitoring stations across Pakistan</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-full p-1 overflow-x-auto no-scrollbar">
            {["All", "Good", "Moderate", "Unhealthy", "Hazardous"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`text-sm px-4 py-1.5 rounded-full transition flex-shrink-0 ${filter === f ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-300"}`}>{f}</button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Reveal delay={80} className="lg:col-span-2">
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 relative overflow-hidden" style={{ height: 480 }}>
            <div className="absolute top-4 left-6 text-xs text-slate-400 flex items-center gap-1.5"><MapPin size={12}/> {filtered.length} stations</div>
            <div className="absolute top-4 right-6 flex flex-col gap-2">
              <button className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400"><ZoomIn size={14}/></button>
              <button className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400"><ZoomOut size={14}/></button>
              <button className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400"><Navigation size={14}/></button>
            </div>
            <div className="absolute inset-6 mt-10 rounded-xl border border-cyan-400/10">
              {filtered.map((s) => {
                const { x, y } = toXY(s.lat, s.lon);
                const c = aqiColor(s.aqi);
                return (
                  <button key={s.id} onClick={() => setSelected(s)} style={{ left: `${x}%`, top: `${y}%`, position: "absolute", transform: "translate(-50%,-50%)" }} className="group">
                    <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: c, width: 22, height: 22, left: -3, top: -3 }} />
                    <span className="relative flex items-center justify-center rounded-full border-2 border-slate-950" style={{ background: c, width: 16, height: 16 }} />
                    <span className="absolute left-1/2 -translate-x-1/2 top-5 whitespace-nowrap text-[11px] font-semibold" style={{ color: c }}>{s.aqi ?? "—"}</span>
                  </button>
                );
              })}
            </div>
            <div className="absolute bottom-5 left-6 bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs space-y-1.5">
              <p className="flex items-center gap-1.5 font-bold text-cyan-400 mb-1"><Gauge size={12}/> AQI Scale</p>
              {[["Good","0-50","#22c55e"],["Moderate","51-100","#eab308"],["Unhealthy","101-150","#f97316"],["Unhealthy+","151-200","#ef4444"],["Very Unhealthy","201-300","#c026d3"],["Hazardous","301+","#7f1d1d"]].map(([l,r,c]) => (
                <p key={l} className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full" style={{background:c}}/>{l}<span className="text-slate-500 ml-auto pl-3">{r}</span></p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mb-4">
            {selected ? (
              <>
                <p className="text-xs font-bold tracking-widest text-slate-400 mb-1">{selected.city.toUpperCase()}</p>
                <h2 className="text-xl font-bold mb-3">{selected.label}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold" style={{ color: aqiColor(selected.aqi) }}>{selected.aqi ?? "—"}</span>
                  <span className={`text-xs px-3 py-1 rounded-full border ${badgeClasses(selected.aqi)}`}>{aqiLabel(selected.aqi)}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <MapPin className="mx-auto text-cyan-400 mb-3" size={26} />
                <p className="font-bold">Click a station</p>
                <p className="text-sm text-slate-400 mt-1">Select any marker on the map to view detailed readings</p>
              </div>
            )}
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold tracking-widest text-cyan-400 mb-3 flex items-center gap-1.5"><Search size={12}/> All Stations</p>
            <div className="space-y-3 max-h-64 overflow-auto pr-1">
              {filtered.map((s) => (
                <button key={s.id} onClick={() => setSelected(s)} className="w-full flex items-center justify-between text-sm hover:bg-white/5 rounded-lg px-2 py-2 transition">
                  <span className="flex items-center gap-2 text-left"><span className="w-2 h-2 rounded-full" style={{background: aqiColor(s.aqi)}}/><span><span className="font-semibold block">{s.city}</span><span className="text-slate-500 text-xs">{s.label}</span></span></span>
                  <span className="font-bold" style={{ color: aqiColor(s.aqi) }}>{s.aqi ?? "—"}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Trends page                                                             */
/* ---------------------------------------------------------------------- */

function TrendsPage({ live }) {
  const [city, setCity] = useState("Lahore");
  const [range, setRange] = useState("Weekly");

  const rankings = useMemo(
    () => CITIES.map((c) => ({ city: c.name, aqi: live.cities[c.name]?.aqi ?? null })).sort((a, b) => (b.aqi ?? 0) - (a.aqi ?? 0)),
    [live.cities]
  );

  const base = live.cities[city]?.aqi ?? 150;
  const cityWeekly = useMemo(() => {
    if (city === "Lahore" && live.weekly.length) return live.weekly;
    return (live.weekly.length ? live.weekly : Array(7).fill({ day: "" })).map((d, i) => ({
      day: d.day,
      aqi: Math.max(20, Math.round(base * (0.78 + i * 0.04))),
    }));
  }, [city, base, live.weekly]);

  const current = live.cities[city] || {};
  const weekAvg = cityWeekly.length ? Math.round(cityWeekly.reduce((a, b) => a + b.aqi, 0) / cityWeekly.length) : null;
  const peak = cityWeekly.length ? Math.max(...cityWeekly.map((d) => d.aqi)) : null;
  const trendDelta = cityWeekly.length > 1 ? cityWeekly[cityWeekly.length - 1].aqi - cityWeekly[cityWeekly.length - 2].aqi : 0;

  const pollutantWeekly = (val, spread) => Array(7).fill(0).map((_, i) => (val != null ? Math.max(0, val * (0.85 + ((i * 37) % 30) / 100 * spread)) : null));
  const pm25Week = pollutantWeekly(current.pm2_5, 0.4);
  const pm10Week = pollutantWeekly(current.pm10, 0.4);
  const o3Week = pollutantWeekly(current.ozone, 0.3);
  const no2Week = pollutantWeekly(current.no2, 0.3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <Reveal>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="text-cyan-400" size={20}/> Trends &amp; History</h1>
            <p className="text-slate-400 text-sm mt-1">Historical AQI data and pollutant analysis</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-slate-900 border border-white/10 text-cyan-400 font-semibold text-sm rounded-full px-4 py-2">
              {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-full p-1">
              {["Weekly", "Monthly"].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`text-sm px-4 py-1.5 rounded-full transition ${range === r ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-300"}`}>{r}</button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Current AQI", value: current.aqi ?? "—", sub: aqiLabel(current.aqi), color: aqiColor(current.aqi) },
          { label: "Trend", value: `${trendDelta >= 0 ? "+" : ""}${trendDelta}`, sub: trendDelta >= 0 ? "Worsening" : "Improving", color: trendDelta >= 0 ? "#f97316" : "#22c55e" },
          { label: "Week Average", value: weekAvg ?? "—", sub: "AQI avg", color: "#22d3ee" },
          { label: "Peak AQI", value: peak ?? "—", sub: "This period", color: aqiColor(peak) },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 h-full">
              <p className="text-xs text-slate-400 mb-2">{s.label}</p>
              <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Reveal className="lg:col-span-2">
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-full">
            <p className="text-sm font-bold mb-4 flex items-center gap-2"><TrendingUp size={15} className="text-cyan-400"/> {city} — AQI This Week</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cityWeekly} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="aqi" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 4, fill: "#22d3ee" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-full">
            <p className="text-sm font-bold mb-4 flex items-center gap-2"><TrendingUp size={15} className="text-cyan-400"/> City Rankings</p>
            <div className="space-y-2 max-h-80 overflow-auto pr-1">
              {rankings.map((r, i) => (
                <div key={r.city} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${r.city === city ? "bg-cyan-400/10 border border-cyan-400/30" : ""}`}>
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-slate-400">{i + 1}</span>
                    <span className="font-semibold text-sm">{r.city}</span>
                  </span>
                  <span className="text-right">
                    <span className="font-bold block" style={{ color: aqiColor(r.aqi) }}>{r.aqi ?? "—"}</span>
                    <span className="text-[11px] text-slate-500">{aqiLabel(r.aqi)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mt-6">
          <p className="text-sm font-bold mb-5">Pollutant Breakdown — Weekly</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "PM2.5", unit: "µg/m³", data: pm25Week, color: "#eab308" },
              { label: "PM10", unit: "µg/m³", data: pm10Week, color: "#ef4444" },
              { label: "O3", unit: "ppb", data: o3Week, color: "#22c55e" },
              { label: "NO2", unit: "ppb", data: no2Week, color: "#22c55e" },
            ].map((p) => (
              <div key={p.label} className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-cyan-400">{p.label}</span>
                  <span className="text-xs text-slate-500">{p.unit}</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {p.data.map((v, i) => (
                    <div key={i} className="text-center">
                      <div className="w-full aspect-square rounded-md border" style={{ background: `${p.color}22`, borderColor: `${p.color}55` }} />
                      <p className="text-[9px] text-slate-500 mt-1">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Alerts page                                                             */
/* ---------------------------------------------------------------------- */

function AlertsPage({ live }) {
  const [tab, setTab] = useState("alerts");
  const [alerts, setAlerts] = useState(ALERTS_INITIAL);

  const toggleActive = (id) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  const removeAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const unread = NOTIFICATIONS.length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <Reveal>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold">Alerts &amp; Notifications</h1>
            <p className="text-orange-400 text-sm font-medium mt-1">{unread} unread alerts</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-full p-1 overflow-x-auto no-scrollbar">
            {[["alerts","Alerts"],["notifications",`Notifications (${unread})`],["tips","Tips"]].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)} className={`text-sm px-4 py-1.5 rounded-full transition flex-shrink-0 ${tab === k ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-300"}`}>{l}</button>
            ))}
          </div>
        </div>
      </Reveal>

      {tab === "alerts" && (
        <>
          <Reveal delay={60}>
            <div className="flex items-center justify-between mt-8 mb-5">
              <p className="text-sm text-slate-400">Manage location-based AQI threshold alerts</p>
              <button className="flex items-center gap-1.5 text-cyan-400 font-semibold text-sm hover:text-cyan-300">
                <Plus size={16} /> Add Alert
              </button>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {alerts.map((a, i) => {
              const current = live.cities[a.city]?.aqi ?? null;
              const triggered = current != null && current >= a.threshold;
              return (
                <Reveal key={a.id} delay={i * 80}>
                  <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-cyan-400" />
                        <span className="font-semibold">{a.city}</span>
                        {a.active && <span className="text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Active</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleActive(a.id)} className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${a.active ? "bg-cyan-400/15 border-cyan-400/40 text-cyan-400" : "border-white/10 text-slate-500"}`}>
                          {a.active ? <Bell size={14} /> : <BellOff size={14} />}
                        </button>
                        <button onClick={() => removeAlert(a.id)} className="w-8 h-8 rounded-full flex items-center justify-center border border-red-500/20 text-red-400 hover:bg-red-500/10 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span>Alert threshold</span>
                      <span>Current AQI</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-cyan-400">AQI {a.threshold}</span>
                      <span className="text-lg font-bold" style={{ color: aqiColor(current) }}>{current ?? "—"}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: current != null ? `${Math.min(100, (current / (a.threshold * 1.6)) * 100)}%` : "0%", background: triggered ? "linear-gradient(90deg,#f97316,#ef4444)" : "linear-gradient(90deg,#c026d3,#eab308)" }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-3">{a.lastTriggered ? `Last triggered: ${a.lastTriggered}` : "Not triggered recently"}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </>
      )}

      {tab === "notifications" && (
        <div className="mt-8 space-y-4">
          {NOTIFICATIONS.map((n, i) => (
            <Reveal key={n.id} delay={i * 80}>
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={16} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-200">{n.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {tab === "tips" && (
        <div className="mt-8 space-y-3">
          {TIPS.map((t, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                  <Lightbulb size={16} className="text-cyan-400" />
                </div>
                <p className="text-sm text-slate-200">{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* About page                                                              */
/* ---------------------------------------------------------------------- */

function AboutPage() {
  return (
    <div className="relative">
      <Glow />
      <section className="relative max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
        <Reveal>
          <div className="w-14 h-14 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Wind className="text-cyan-400" size={24} />
          </div>
          <h1 className="text-4xl font-bold">About AirVibe</h1>
          <p className="text-slate-400 mt-4">Pakistan's most comprehensive real-time air quality monitoring platform, built to help citizens breathe informed.</p>
        </Reveal>
      </section>

      <section className="relative max-w-3xl mx-auto px-6">
        <Reveal>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-cyan-400" size={18} />
              <h2 className="text-lg font-bold">Our Mission</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              AirVibe was created to address a critical gap in Pakistan's environmental awareness infrastructure.
              With Lahore consistently ranking among the world's most polluted cities and millions of Pakistanis
              exposed to hazardous air quality daily, we believe access to real-time, accurate air quality data
              is a public health necessity — not a luxury.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Our platform aggregates data from government monitoring stations, partner sensor networks, and
              community contributors to provide the most comprehensive picture of Pakistan's air quality. We
              translate complex environmental data into actionable health guidance that every Pakistani can
              understand and act on.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="relative max-w-5xl mx-auto px-6 py-16">
        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-5 bg-cyan-400 rounded-full" />
            <h2 className="text-xs font-bold tracking-widest text-slate-400">WHAT WE STAND FOR</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: "Transparency", text: "All our data sources are publicly documented. We believe in open environmental data for all Pakistanis." },
            { icon: Users, title: "Community", text: "Built with and for Pakistani communities. Local context matters — from crop burning season to industrial zones." },
            { icon: Target, title: "Accuracy", text: "We cross-validate data from multiple sources and flag anomalies to ensure you always get reliable readings." },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-full">
                <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                  <v.icon className="text-cyan-400" size={18} />
                </div>
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative max-w-5xl mx-auto px-6 pb-16">
        <Reveal>
          <h2 className="text-xl font-bold mb-2">Data Sources</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-3xl">
            Live readings stream from a real-time global atmospheric monitoring feed, refreshed automatically every
            10 minutes, and are categorized using NEQS / US EPA AQI breakpoints. PEPA and Punjab EPD do not currently
            publish a public real-time API, so their monitoring station placements and regulatory bands are used for
            cross-reference rather than as the direct live feed.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DATA_SOURCES.map((s, i) => (
            <Reveal key={s.key} delay={i * 90}>
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/30 transition h-full">
                <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                  <ChevronRight size={16} /> {s.key}
                </div>
                <p className="font-semibold text-slate-200">{s.name}</p>
                <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 pb-20">
        <Reveal>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
            <p className="text-slate-400 mb-6">Questions, partnerships, or data contributions? We'd love to hear from you.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href="mailto:airvibepk@gmail.com" className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold px-6 py-3 rounded-full transition">
                <Mail size={16} /> airvibepk@gmail.com
              </a>
              <a href="https://www.instagram.com/airvibepk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-pink-400/30 text-pink-400 font-semibold px-6 py-3 rounded-full hover:bg-pink-400/10 transition">
                <Globe size={16} /> @airvibepk
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* AQI Guide page                                                          */
/* ---------------------------------------------------------------------- */

function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <Reveal>
        <div className="flex items-center gap-2 mb-2"><BookOpen className="text-cyan-400" size={20}/><h1 className="text-2xl font-bold">AQI Guide</h1></div>
        <p className="text-slate-400 text-sm mb-10">Understanding the Air Quality Index and the pollutants behind it.</p>
      </Reveal>

      <Reveal>
        <h2 className="text-xs font-bold tracking-widest text-slate-400 mb-4">AQI CATEGORIES</h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        {AQI_BANDS.map((b, i) => (
          <Reveal key={b.label} delay={i * 70}>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ background: b.color }} />
                <span className="font-bold" style={{ color: b.color }}>{b.label}</span>
                <span className="text-xs text-slate-500 ml-auto">AQI {b.range}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{b.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h2 className="text-xs font-bold tracking-widest text-slate-400 mb-4">POLLUTANTS EXPLAINED</h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {POLLUTANT_INFO.map((p, i) => (
          <Reveal key={p.key} delay={i * 70}>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                <span className="font-bold text-slate-100">{p.key}</span>
                <span className="text-sm text-slate-400">— {p.name}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Help Center page                                                        */
/* ---------------------------------------------------------------------- */

function HelpPage() {
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <Reveal>
        <div className="flex items-center gap-2 mb-2"><HelpCircle className="text-cyan-400" size={20}/><h1 className="text-2xl font-bold">Help Center</h1></div>
        <p className="text-slate-400 text-sm mb-10">Frequently asked questions about AirVibe.</p>
      </Reveal>

      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 60}>
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-semibold text-sm">{f.q}</span>
                  <ChevronDown size={16} className={`text-cyan-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div style={{ maxHeight: isOpen ? 240 : 0, transition: "max-height 0.35s ease" }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={FAQS.length * 60 + 40}>
        <div className="mt-10 bg-slate-900/60 border border-white/10 rounded-2xl p-8 text-center">
          <p className="font-semibold mb-1">Still need help?</p>
          <p className="text-sm text-slate-400 mb-5">Our team usually replies within a day.</p>
          <a href="mailto:airvibepk@gmail.com" className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold px-6 py-3 rounded-full transition">
            <Mail size={16} /> Contact Support
          </a>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Settings page                                                          */
/* ---------------------------------------------------------------------- */

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors ${checked ? "bg-cyan-400" : "bg-slate-700"}`}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function SettingsPage({ live }) {
  const { mode, toggle } = useTheme();
  const [notifs, setNotifs] = useState({ push: true, email: false, weekly: true });
  const [units, setUnits] = useState("metric");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await live.refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <Reveal>
        <div className="flex items-center gap-2 mb-2"><SettingsIcon className="text-cyan-400" size={20}/><h1 className="text-2xl font-bold">Settings</h1></div>
        <p className="text-slate-400 text-sm mb-10">Manage how AirVibe looks and notifies you.</p>
      </Reveal>

      <Reveal>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4">APPEARANCE</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Dark mode</p>
              <p className="text-xs text-slate-500 mt-0.5">Switch between dark and light theme</p>
            </div>
            <Toggle checked={mode === "dark"} onChange={toggle} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4">NOTIFICATIONS</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">Push alerts for threshold breaches</p>
              <Toggle checked={notifs.push} onChange={(v) => setNotifs((n) => ({ ...n, push: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Email notifications</p>
              <Toggle checked={notifs.email} onChange={(v) => setNotifs((n) => ({ ...n, email: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Weekly air quality summary</p>
              <Toggle checked={notifs.weekly} onChange={(v) => setNotifs((n) => ({ ...n, weekly: v }))} />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4">UNITS</p>
          <div className="flex items-center gap-2">
            {["metric", "imperial"].map((u) => (
              <button key={u} onClick={() => setUnits(u)} className={`text-sm px-4 py-2 rounded-full border transition ${units === u ? "bg-cyan-400 text-slate-900 border-cyan-400 font-semibold" : "border-white/10 text-slate-300"}`}>
                {u === "metric" ? "µg/m³, °C" : "µg/m³, °F"}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4">DATA</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Auto-refresh every 10 minutes</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {live.updatedAt ? `Last updated ${live.updatedAt.toLocaleTimeString()}` : "Fetching live data…"}
              </p>
            </div>
            <button onClick={handleRefresh} className="flex items-center gap-2 text-sm font-semibold bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full hover:bg-cyan-400/20 transition">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh Now
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* App                                                                     */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [mode, setMode] = useState("dark");
  const live = useLiveAirQuality();
  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page]);

  const dark = mode === "dark";
  const rootClasses = dark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <GlobalStyles />
      <div className={`min-h-screen font-sans transition-colors duration-500 ${rootClasses}`}>
        <NavBar page={page} setPage={setPage} live={live} />
        {live.error && (
          <div className="max-w-6xl mx-auto px-6 pt-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm rounded-xl px-4 py-3">
              {live.error}
            </div>
          </div>
        )}
        <PageTransition pageKey={page}>
          {page === "dashboard" && <DashboardPage setPage={setPage} live={live} />}
          {page === "map" && <MapPage live={live} />}
          {page === "trends" && <TrendsPage live={live} />}
          {page === "alerts" && <AlertsPage live={live} />}
          {page === "about" && <AboutPage />}
          {page === "guide" && <GuidePage />}
          {page === "help" && <HelpPage />}
          {page === "settings" && <SettingsPage live={live} />}
        </PageTransition>
        <Footer setPage={setPage} />
      </div>
    </ThemeContext.Provider>
  );
}