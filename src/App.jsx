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
  QrCode, Brain, Layers, School, Stethoscope, Sparkles, Building2, Languages, X,
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
  { name: "Hyderabad", lat: 25.396, lon: 68.3578, primaryPollutant: "PM10" },
  { name: "Sukkur", lat: 27.7052, lon: 68.8574, primaryPollutant: "PM10" },
  { name: "Gujranwala", lat: 32.1877, lon: 74.1945, primaryPollutant: "PM2.5" },
  { name: "Sialkot", lat: 32.4945, lon: 74.5229, primaryPollutant: "PM2.5" },
  { name: "Bahawalpur", lat: 29.4, lon: 71.6833, primaryPollutant: "PM10" },
  { name: "Sargodha", lat: 32.0836, lon: 72.6711, primaryPollutant: "PM2.5" },
  { name: "Abbottabad", lat: 34.1463, lon: 73.2117, primaryPollutant: "PM2.5" },
  { name: "Mardan", lat: 34.1986, lon: 72.0404, primaryPollutant: "PM2.5" },
  { name: "D.I. Khan", lat: 31.8313, lon: 70.902, primaryPollutant: "PM10" },
  { name: "Muzaffarabad", lat: 34.37, lon: 73.4711, primaryPollutant: "PM2.5" },
  { name: "Gwadar", lat: 25.1264, lon: 62.3225, primaryPollutant: "PM10" },
  { name: "Skardu", lat: 35.2971, lon: 75.6333, primaryPollutant: "PM10" },
  { name: "Turbat", lat: 26.0023, lon: 63.044, primaryPollutant: "PM10" },
  { name: "Sahiwal", lat: 30.6682, lon: 73.1114, primaryPollutant: "PM2.5" },

  // --- International cities (one major city per country, for global coverage) ---
  { name: "Algiers, Algeria", lat: 36.7538, lon: 3.0588, primaryPollutant: "PM10" },
  { name: "Luanda, Angola", lat: -8.8383, lon: 13.2344, primaryPollutant: "PM2.5" },
  { name: "Porto-Novo, Benin", lat: 6.4969, lon: 2.6283, primaryPollutant: "PM2.5" },
  { name: "Gaborone, Botswana", lat: -24.6282, lon: 25.9231, primaryPollutant: "PM10" },
  { name: "Ouagadougou, Burkina Faso", lat: 12.3714, lon: -1.5197, primaryPollutant: "PM10" },
  { name: "Gitega, Burundi", lat: -3.4264, lon: 29.9306, primaryPollutant: "PM2.5" },
  { name: "Praia, Cabo Verde", lat: 14.933, lon: -23.5133, primaryPollutant: "PM10" },
  { name: "Yaoundé, Cameroon", lat: 3.848, lon: 11.5021, primaryPollutant: "PM2.5" },
  { name: "Bangui, Central African Republic", lat: 4.3947, lon: 18.5582, primaryPollutant: "PM2.5" },
  { name: "N'Djamena, Chad", lat: 12.1348, lon: 15.0557, primaryPollutant: "PM10" },
  { name: "Moroni, Comoros", lat: -11.7172, lon: 43.2473, primaryPollutant: "PM10" },
  { name: "Brazzaville, Congo", lat: -4.2634, lon: 15.2429, primaryPollutant: "PM2.5" },
  { name: "Kinshasa, DR Congo", lat: -4.4419, lon: 15.2663, primaryPollutant: "PM2.5" },
  { name: "Djibouti City, Djibouti", lat: 11.5721, lon: 43.1456, primaryPollutant: "PM10" },
  { name: "Cairo, Egypt", lat: 30.0444, lon: 31.2357, primaryPollutant: "PM2.5" },
  { name: "Malabo, Equatorial Guinea", lat: 3.7523, lon: 8.7742, primaryPollutant: "PM2.5" },
  { name: "Asmara, Eritrea", lat: 15.3229, lon: 38.9251, primaryPollutant: "PM10" },
  { name: "Mbabane, Eswatini", lat: -26.3054, lon: 31.1367, primaryPollutant: "PM2.5" },
  { name: "Addis Ababa, Ethiopia", lat: 9.03, lon: 38.74, primaryPollutant: "PM2.5" },
  { name: "Libreville, Gabon", lat: 0.4162, lon: 9.4673, primaryPollutant: "PM2.5" },
  { name: "Banjul, Gambia", lat: 13.4549, lon: -16.579, primaryPollutant: "PM10" },
  { name: "Accra, Ghana", lat: 5.6037, lon: -0.187, primaryPollutant: "PM2.5" },
  { name: "Conakry, Guinea", lat: 9.6412, lon: -13.5784, primaryPollutant: "PM2.5" },
  { name: "Bissau, Guinea-Bissau", lat: 11.8636, lon: -15.5977, primaryPollutant: "PM10" },
  { name: "Yamoussoukro, Ivory Coast", lat: 6.8276, lon: -5.2893, primaryPollutant: "PM2.5" },
  { name: "Nairobi, Kenya", lat: -1.2921, lon: 36.8219, primaryPollutant: "PM2.5" },
  { name: "Maseru, Lesotho", lat: -29.3167, lon: 27.4833, primaryPollutant: "PM10" },
  { name: "Monrovia, Liberia", lat: 6.2907, lon: -10.7605, primaryPollutant: "PM2.5" },
  { name: "Tripoli, Libya", lat: 32.8872, lon: 13.1913, primaryPollutant: "PM10" },
  { name: "Antananarivo, Madagascar", lat: -18.8792, lon: 47.5079, primaryPollutant: "PM2.5" },
  { name: "Lilongwe, Malawi", lat: -13.9626, lon: 33.7741, primaryPollutant: "PM10" },
  { name: "Bamako, Mali", lat: 12.6392, lon: -8.0029, primaryPollutant: "PM10" },
  { name: "Nouakchott, Mauritania", lat: 18.0735, lon: -15.9582, primaryPollutant: "PM10" },
  { name: "Port Louis, Mauritius", lat: -20.1609, lon: 57.5012, primaryPollutant: "PM10" },
  { name: "Rabat, Morocco", lat: 34.0209, lon: -6.8417, primaryPollutant: "PM10" },
  { name: "Maputo, Mozambique", lat: -25.9692, lon: 32.5732, primaryPollutant: "PM2.5" },
  { name: "Windhoek, Namibia", lat: -22.5609, lon: 17.0658, primaryPollutant: "PM10" },
  { name: "Niamey, Niger", lat: 13.5127, lon: 2.1128, primaryPollutant: "PM10" },
  { name: "Abuja, Nigeria", lat: 9.0765, lon: 7.3986, primaryPollutant: "PM2.5" },
  { name: "Kigali, Rwanda", lat: -1.9403, lon: 29.8739, primaryPollutant: "PM2.5" },
  { name: "São Tomé, Sao Tome and Principe", lat: 0.3365, lon: 6.7273, primaryPollutant: "PM10" },
  { name: "Dakar, Senegal", lat: 14.7167, lon: -17.4677, primaryPollutant: "PM10" },
  { name: "Victoria, Seychelles", lat: -4.6191, lon: 55.4513, primaryPollutant: "PM10" },
  { name: "Freetown, Sierra Leone", lat: 8.4657, lon: -13.2317, primaryPollutant: "PM2.5" },
  { name: "Mogadishu, Somalia", lat: 2.0469, lon: 45.3182, primaryPollutant: "PM10" },
  { name: "Johannesburg, South Africa", lat: -26.2041, lon: 28.0473, primaryPollutant: "PM2.5" },
  { name: "Juba, South Sudan", lat: 4.8594, lon: 31.5713, primaryPollutant: "PM10" },
  { name: "Khartoum, Sudan", lat: 15.5007, lon: 32.5599, primaryPollutant: "PM10" },
  { name: "Dar es Salaam, Tanzania", lat: -6.7924, lon: 39.2083, primaryPollutant: "PM2.5" },
  { name: "Lomé, Togo", lat: 6.1725, lon: 1.2314, primaryPollutant: "PM2.5" },
  { name: "Tunis, Tunisia", lat: 36.8065, lon: 10.1815, primaryPollutant: "PM10" },
  { name: "Kampala, Uganda", lat: 0.3476, lon: 32.5825, primaryPollutant: "PM2.5" },
  { name: "Lusaka, Zambia", lat: -15.3875, lon: 28.3228, primaryPollutant: "PM10" },
  { name: "Harare, Zimbabwe", lat: -17.8252, lon: 31.0335, primaryPollutant: "PM10" },

  { name: "Buenos Aires, Argentina", lat: -34.6037, lon: -58.3816, primaryPollutant: "PM2.5" },
  { name: "Nassau, Bahamas", lat: 25.0343, lon: -77.3963, primaryPollutant: "PM10" },
  { name: "Bridgetown, Barbados", lat: 13.1132, lon: -59.5988, primaryPollutant: "PM10" },
  { name: "Belmopan, Belize", lat: 17.251, lon: -88.759, primaryPollutant: "PM10" },
  { name: "La Paz, Bolivia", lat: -16.4897, lon: -68.1193, primaryPollutant: "PM2.5" },
  { name: "Brasília, Brazil", lat: -15.7939, lon: -47.8828, primaryPollutant: "PM2.5" },
  { name: "São Paulo, Brazil", lat: -23.5505, lon: -46.6333, primaryPollutant: "PM2.5" },
  { name: "Ottawa, Canada", lat: 45.4215, lon: -75.6972, primaryPollutant: "PM2.5" },
  { name: "Santiago, Chile", lat: -33.4489, lon: -70.6693, primaryPollutant: "PM2.5" },
  { name: "Bogotá, Colombia", lat: 4.711, lon: -74.0721, primaryPollutant: "PM2.5" },
  { name: "San José, Costa Rica", lat: 9.9281, lon: -84.0907, primaryPollutant: "PM10" },
  { name: "Havana, Cuba", lat: 23.1136, lon: -82.3666, primaryPollutant: "PM10" },
  { name: "Santo Domingo, Dominican Republic", lat: 18.4861, lon: -69.9312, primaryPollutant: "PM10" },
  { name: "Quito, Ecuador", lat: -0.1807, lon: -78.4678, primaryPollutant: "PM2.5" },
  { name: "San Salvador, El Salvador", lat: 13.6929, lon: -89.2182, primaryPollutant: "PM2.5" },
  { name: "Guatemala City, Guatemala", lat: 14.6349, lon: -90.5069, primaryPollutant: "PM2.5" },
  { name: "Georgetown, Guyana", lat: 6.8013, lon: -58.1551, primaryPollutant: "PM10" },
  { name: "Port-au-Prince, Haiti", lat: 18.5944, lon: -72.3074, primaryPollutant: "PM2.5" },
  { name: "Tegucigalpa, Honduras", lat: 14.0723, lon: -87.1921, primaryPollutant: "PM2.5" },
  { name: "Kingston, Jamaica", lat: 17.9712, lon: -76.7936, primaryPollutant: "PM10" },
  { name: "Mexico City, Mexico", lat: 19.4326, lon: -99.1332, primaryPollutant: "PM2.5" },
  { name: "Managua, Nicaragua", lat: 12.115, lon: -86.2362, primaryPollutant: "PM10" },
  { name: "Panama City, Panama", lat: 8.9824, lon: -79.5199, primaryPollutant: "PM2.5" },
  { name: "Asunción, Paraguay", lat: -25.2637, lon: -57.5759, primaryPollutant: "PM10" },
  { name: "Lima, Peru", lat: -12.0464, lon: -77.0428, primaryPollutant: "PM2.5" },
  { name: "Paramaribo, Suriname", lat: 5.852, lon: -55.2038, primaryPollutant: "PM10" },
  { name: "Port of Spain, Trinidad and Tobago", lat: 10.6549, lon: -61.5019, primaryPollutant: "PM10" },
  { name: "Washington, United States", lat: 38.9072, lon: -77.0369, primaryPollutant: "PM2.5" },
  { name: "New York, United States", lat: 40.7128, lon: -74.006, primaryPollutant: "PM2.5" },
  { name: "Los Angeles, United States", lat: 34.0522, lon: -118.2437, primaryPollutant: "PM2.5" },
  { name: "Montevideo, Uruguay", lat: -34.9011, lon: -56.1645, primaryPollutant: "PM10" },
  { name: "Caracas, Venezuela", lat: 10.4806, lon: -66.9036, primaryPollutant: "PM2.5" },

  { name: "Kabul, Afghanistan", lat: 34.5553, lon: 69.2075, primaryPollutant: "PM2.5" },
  { name: "Yerevan, Armenia", lat: 40.1792, lon: 44.4991, primaryPollutant: "PM2.5" },
  { name: "Baku, Azerbaijan", lat: 40.4093, lon: 49.8671, primaryPollutant: "PM2.5" },
  { name: "Manama, Bahrain", lat: 26.2285, lon: 50.586, primaryPollutant: "PM10" },
  { name: "Dhaka, Bangladesh", lat: 23.8103, lon: 90.4125, primaryPollutant: "PM2.5" },
  { name: "Thimphu, Bhutan", lat: 27.4728, lon: 89.639, primaryPollutant: "PM2.5" },
  { name: "Bandar Seri Begawan, Brunei", lat: 4.9031, lon: 114.9398, primaryPollutant: "PM10" },
  { name: "Phnom Penh, Cambodia", lat: 11.5564, lon: 104.9282, primaryPollutant: "PM2.5" },
  { name: "Beijing, China", lat: 39.9042, lon: 116.4074, primaryPollutant: "PM2.5" },
  { name: "Shanghai, China", lat: 31.2304, lon: 121.4737, primaryPollutant: "PM2.5" },
  { name: "Nicosia, Cyprus", lat: 35.1856, lon: 33.3823, primaryPollutant: "PM10" },
  { name: "Tbilisi, Georgia", lat: 41.7151, lon: 44.8271, primaryPollutant: "PM2.5" },
  { name: "New Delhi, India", lat: 28.6139, lon: 77.209, primaryPollutant: "PM2.5" },
  { name: "Mumbai, India", lat: 19.076, lon: 72.8777, primaryPollutant: "PM2.5" },
  { name: "Jakarta, Indonesia", lat: -6.2088, lon: 106.8456, primaryPollutant: "PM2.5" },
  { name: "Tehran, Iran", lat: 35.6892, lon: 51.389, primaryPollutant: "PM2.5" },
  { name: "Baghdad, Iraq", lat: 33.3152, lon: 44.3661, primaryPollutant: "PM10" },
  { name: "Jerusalem, Israel", lat: 31.7683, lon: 35.2137, primaryPollutant: "PM10" },
  { name: "Tokyo, Japan", lat: 35.6762, lon: 139.6503, primaryPollutant: "PM2.5" },
  { name: "Amman, Jordan", lat: 31.9454, lon: 35.9284, primaryPollutant: "PM10" },
  { name: "Astana, Kazakhstan", lat: 51.1605, lon: 71.4704, primaryPollutant: "PM2.5" },
  { name: "Kuwait City, Kuwait", lat: 29.3759, lon: 47.9774, primaryPollutant: "PM10" },
  { name: "Bishkek, Kyrgyzstan", lat: 42.8746, lon: 74.5698, primaryPollutant: "PM2.5" },
  { name: "Vientiane, Laos", lat: 17.9757, lon: 102.6331, primaryPollutant: "PM2.5" },
  { name: "Beirut, Lebanon", lat: 33.8938, lon: 35.5018, primaryPollutant: "PM10" },
  { name: "Kuala Lumpur, Malaysia", lat: 3.139, lon: 101.6869, primaryPollutant: "PM2.5" },
  { name: "Malé, Maldives", lat: 4.1755, lon: 73.5093, primaryPollutant: "PM10" },
  { name: "Ulaanbaatar, Mongolia", lat: 47.8864, lon: 106.9057, primaryPollutant: "PM2.5" },
  { name: "Naypyidaw, Myanmar", lat: 19.7633, lon: 96.0785, primaryPollutant: "PM2.5" },
  { name: "Kathmandu, Nepal", lat: 27.7172, lon: 85.324, primaryPollutant: "PM2.5" },
  { name: "Pyongyang, North Korea", lat: 39.0392, lon: 125.7625, primaryPollutant: "PM10" },
  { name: "Muscat, Oman", lat: 23.588, lon: 58.3829, primaryPollutant: "PM10" },
  { name: "Ramallah, Palestine", lat: 31.9038, lon: 35.2034, primaryPollutant: "PM10" },
  { name: "Manila, Philippines", lat: 14.5995, lon: 120.9842, primaryPollutant: "PM2.5" },
  { name: "Doha, Qatar", lat: 25.2854, lon: 51.531, primaryPollutant: "PM10" },
  { name: "Riyadh, Saudi Arabia", lat: 24.7136, lon: 46.6753, primaryPollutant: "PM10" },
  { name: "Singapore", lat: 1.3521, lon: 103.8198, primaryPollutant: "PM2.5" },
  { name: "Seoul, South Korea", lat: 37.5665, lon: 126.978, primaryPollutant: "PM2.5" },
  { name: "Colombo, Sri Lanka", lat: 6.9271, lon: 79.8612, primaryPollutant: "PM2.5" },
  { name: "Damascus, Syria", lat: 33.5138, lon: 36.2765, primaryPollutant: "PM10" },
  { name: "Taipei, Taiwan", lat: 25.033, lon: 121.5654, primaryPollutant: "PM2.5" },
  { name: "Dushanbe, Tajikistan", lat: 38.5598, lon: 68.787, primaryPollutant: "PM2.5" },
  { name: "Bangkok, Thailand", lat: 13.7563, lon: 100.5018, primaryPollutant: "PM2.5" },
  { name: "Dili, Timor-Leste", lat: -8.5569, lon: 125.5603, primaryPollutant: "PM10" },
  { name: "Ankara, Turkey", lat: 39.9334, lon: 32.8597, primaryPollutant: "PM2.5" },
  { name: "Istanbul, Turkey", lat: 41.0082, lon: 28.9784, primaryPollutant: "PM2.5" },
  { name: "Ashgabat, Turkmenistan", lat: 37.9601, lon: 58.3261, primaryPollutant: "PM10" },
  { name: "Abu Dhabi, United Arab Emirates", lat: 24.4539, lon: 54.3773, primaryPollutant: "PM10" },
  { name: "Dubai, United Arab Emirates", lat: 25.2048, lon: 55.2708, primaryPollutant: "PM10" },
  { name: "Tashkent, Uzbekistan", lat: 41.2995, lon: 69.2401, primaryPollutant: "PM2.5" },
  { name: "Hanoi, Vietnam", lat: 21.0285, lon: 105.8542, primaryPollutant: "PM2.5" },
  { name: "Sanaa, Yemen", lat: 15.3694, lon: 44.191, primaryPollutant: "PM10" },

  { name: "Tirana, Albania", lat: 41.3275, lon: 19.8187, primaryPollutant: "PM10" },
  { name: "Vienna, Austria", lat: 48.2082, lon: 16.3738, primaryPollutant: "PM2.5" },
  { name: "Minsk, Belarus", lat: 53.9006, lon: 27.559, primaryPollutant: "PM2.5" },
  { name: "Brussels, Belgium", lat: 50.8503, lon: 4.3517, primaryPollutant: "PM2.5" },
  { name: "Sarajevo, Bosnia and Herzegovina", lat: 43.8563, lon: 18.4131, primaryPollutant: "PM2.5" },
  { name: "Sofia, Bulgaria", lat: 42.6977, lon: 23.3219, primaryPollutant: "PM2.5" },
  { name: "Zagreb, Croatia", lat: 45.815, lon: 15.9819, primaryPollutant: "PM2.5" },
  { name: "Prague, Czech Republic", lat: 50.0755, lon: 14.4378, primaryPollutant: "PM2.5" },
  { name: "Copenhagen, Denmark", lat: 55.6761, lon: 12.5683, primaryPollutant: "PM2.5" },
  { name: "Tallinn, Estonia", lat: 59.437, lon: 24.7536, primaryPollutant: "PM2.5" },
  { name: "Helsinki, Finland", lat: 60.1699, lon: 24.9384, primaryPollutant: "PM2.5" },
  { name: "Paris, France", lat: 48.8566, lon: 2.3522, primaryPollutant: "PM2.5" },
  { name: "Berlin, Germany", lat: 52.52, lon: 13.405, primaryPollutant: "PM2.5" },
  { name: "Athens, Greece", lat: 37.9838, lon: 23.7275, primaryPollutant: "PM2.5" },
  { name: "Budapest, Hungary", lat: 47.4979, lon: 19.0402, primaryPollutant: "PM2.5" },
  { name: "Reykjavik, Iceland", lat: 64.1466, lon: -21.9426, primaryPollutant: "PM10" },
  { name: "Dublin, Ireland", lat: 53.3498, lon: -6.2603, primaryPollutant: "PM2.5" },
  { name: "Rome, Italy", lat: 41.9028, lon: 12.4964, primaryPollutant: "PM2.5" },
  { name: "Pristina, Kosovo", lat: 42.6629, lon: 21.1655, primaryPollutant: "PM2.5" },
  { name: "Riga, Latvia", lat: 56.9496, lon: 24.1052, primaryPollutant: "PM2.5" },
  { name: "Vilnius, Lithuania", lat: 54.6872, lon: 25.2797, primaryPollutant: "PM2.5" },
  { name: "Luxembourg City, Luxembourg", lat: 49.6116, lon: 6.1319, primaryPollutant: "PM2.5" },
  { name: "Valletta, Malta", lat: 35.8989, lon: 14.5146, primaryPollutant: "PM10" },
  { name: "Chișinău, Moldova", lat: 47.0105, lon: 28.8638, primaryPollutant: "PM2.5" },
  { name: "Podgorica, Montenegro", lat: 42.4304, lon: 19.2594, primaryPollutant: "PM2.5" },
  { name: "Amsterdam, Netherlands", lat: 52.3676, lon: 4.9041, primaryPollutant: "PM2.5" },
  { name: "Skopje, North Macedonia", lat: 41.9981, lon: 21.4254, primaryPollutant: "PM2.5" },
  { name: "Oslo, Norway", lat: 59.9139, lon: 10.7522, primaryPollutant: "PM2.5" },
  { name: "Warsaw, Poland", lat: 52.2297, lon: 21.0122, primaryPollutant: "PM2.5" },
  { name: "Lisbon, Portugal", lat: 38.7223, lon: -9.1393, primaryPollutant: "PM2.5" },
  { name: "Bucharest, Romania", lat: 44.4268, lon: 26.1025, primaryPollutant: "PM2.5" },
  { name: "Moscow, Russia", lat: 55.7558, lon: 37.6173, primaryPollutant: "PM2.5" },
  { name: "Belgrade, Serbia", lat: 44.7866, lon: 20.4489, primaryPollutant: "PM2.5" },
  { name: "Bratislava, Slovakia", lat: 48.1486, lon: 17.1077, primaryPollutant: "PM2.5" },
  { name: "Ljubljana, Slovenia", lat: 46.0569, lon: 14.5058, primaryPollutant: "PM2.5" },
  { name: "Madrid, Spain", lat: 40.4168, lon: -3.7038, primaryPollutant: "PM2.5" },
  { name: "Stockholm, Sweden", lat: 59.3293, lon: 18.0686, primaryPollutant: "PM2.5" },
  { name: "Bern, Switzerland", lat: 46.948, lon: 7.4474, primaryPollutant: "PM2.5" },
  { name: "Kyiv, Ukraine", lat: 50.4501, lon: 30.5234, primaryPollutant: "PM2.5" },
  { name: "London, United Kingdom", lat: 51.5072, lon: -0.1276, primaryPollutant: "PM2.5" },

  { name: "Canberra, Australia", lat: -35.2809, lon: 149.13, primaryPollutant: "PM2.5" },
  { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093, primaryPollutant: "PM2.5" },
  { name: "Suva, Fiji", lat: -18.1416, lon: 178.4419, primaryPollutant: "PM10" },
  { name: "Wellington, New Zealand", lat: -41.2865, lon: 174.7762, primaryPollutant: "PM2.5" },
  { name: "Port Moresby, Papua New Guinea", lat: -9.4438, lon: 147.1803, primaryPollutant: "PM10" },
  { name: "Apia, Samoa", lat: -13.8506, lon: -171.7513, primaryPollutant: "PM10" },
  { name: "Honiara, Solomon Islands", lat: -9.428, lon: 159.9498, primaryPollutant: "PM10" },
  { name: "Nukuʻalofa, Tonga", lat: -21.1789, lon: -175.1982, primaryPollutant: "PM10" },
  { name: "Port Vila, Vanuatu", lat: -17.7333, lon: 168.3273, primaryPollutant: "PM10" },
];

const KNOWN_AREAS = [
  { name: "Gulberg, Lahore", lat: 31.52, lon: 74.35 },
  { name: "DHA, Lahore", lat: 31.47, lon: 74.41 },
  { name: "Johar Town, Lahore", lat: 31.47, lon: 74.27 },
  { name: "Model Town, Lahore", lat: 31.48, lon: 74.32 },
  { name: "Clifton, Karachi", lat: 24.81, lon: 67.03 },
  { name: "DHA, Karachi", lat: 24.8, lon: 67.06 },
  { name: "Saddar, Karachi", lat: 24.85, lon: 67.02 },
  { name: "F-7, Islamabad", lat: 33.72, lon: 73.06 },
  { name: "Bahria Town, Islamabad", lat: 33.53, lon: 73.25 },
  { name: "Hayatabad, Peshawar", lat: 34.0, lon: 71.45 },
];

const SENSITIVE_SITES = [
  { name: "Lahore Grammar School", type: "school", lat: 31.51, lon: 74.35 },
  { name: "Services Hospital, Lahore", type: "hospital", lat: 31.56, lon: 74.31 },
  { name: "Aga Khan University Hospital", type: "hospital", lat: 24.89, lon: 67.08 },
  { name: "Karachi Grammar School", type: "school", lat: 24.83, lon: 67.02 },
  { name: "PIMS Hospital, Islamabad", type: "hospital", lat: 33.71, lon: 73.06 },
  { name: "Islamabad Model College", type: "school", lat: 33.66, lon: 73.03 },
  { name: "Lady Reading Hospital, Peshawar", type: "hospital", lat: 34.0, lon: 71.55 },
];

const DATA_SOURCES = [
  { key: "PEPA", name: "Pakistan Environmental Protection Agency", desc: "Primary government monitoring network" },
  { key: "Punjab EPD", name: "Punjab Environment Protection Department", desc: "Provincial monitoring stations" },
  { key: "NEQS", name: "National Environmental Quality Standards", desc: "Regulatory framework and benchmarks" },
  { key: "Partner Sensors", name: "Community & Research Sensor Network", desc: "Low-cost sensor data from partner organizations" },
  { key: "WAQI", name: "World Air Quality Index Project", desc: "Live government and citizen-sensor stations worldwide — toggle it on the Map as an extra layer" },
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

const SEASONAL_INSIGHTS = [
  {
    title: "Winter Smog Season", months: "Nov – Feb", icon: Cloud,
    text: "Cold, still air traps pollutants near the ground (a temperature inversion), while low wind speeds stop smoke and vehicle emissions from dispersing. This is when Lahore and Punjab typically post the worst AQI readings of the year.",
  },
  {
    title: "Crop Burning Season", months: "Oct – Nov", icon: Wind,
    text: "After the rice harvest, large-scale stubble burning across Punjab (and neighbouring regions) sends heavy smoke into the airshed, spiking PM2.5 for weeks — even in cities far from the fields.",
  },
  {
    title: "Monsoon Season", months: "Jul – Sep", icon: CloudRain,
    text: "Monsoon rain washes pollutants out of the air, usually giving the year's best AQI readings — though high humidity can occasionally trap ground-level pollution in urban centres between spells of rain.",
  },
];

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
  { q: "How does the AI location search work?", a: "Search any area, and AirVibe first checks known localities and live station data; for anything else it geocodes the name and estimates AQI using inverse-distance weighting from the nearest live monitoring stations — cross-checked against a direct reading when one is available." },
  { q: "How often does the dashboard update?", a: "Automatically, about every 10 minutes. You can also force an immediate refresh from the Settings tab." },
  { q: "How do I set an AQI alert for a place I care about?", a: "Open the Alerts tab, tap “Add Alert”, give it a tag like Home, Gym, or School, pick the nearest city for its data feed, and set a threshold AQI. You can also save a place straight from a Map search." },
  { q: "How do I contact support?", a: "Email airvibepk@gmail.com or message @airvibepk on Instagram — we read every message." },
  { q: "Can I use AirVibe in Urdu?", a: "Yes — toggle the language switch in Settings to move the interface between English and اردو." },
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

const INITIAL_PLACES = [
  { id: 1, tag: "Lahore", name: "Lahore", lat: 31.5497, lon: 74.3436, threshold: 150, active: true, lastTriggered: "2 hours ago" },
  { id: 2, tag: "Karachi", name: "Karachi", lat: 24.8607, lon: 67.0011, threshold: 150, active: true, lastTriggered: "4 hours ago" },
  { id: 3, tag: "Islamabad", name: "Islamabad", lat: 33.6844, lon: 73.0479, threshold: 100, active: false, lastTriggered: null },
  { id: 4, tag: "Peshawar", name: "Peshawar", lat: 34.0151, lon: 71.5249, threshold: 150, active: false, lastTriggered: null },
];

const NOTIFICATIONS = [
  { id: 1, text: "Lahore AQI crossed your threshold of 150.", time: "2 hours ago" },
  { id: 2, text: "Karachi AQI crossed your threshold of 150.", time: "4 hours ago" },
];

/* ---------------------------------------------------------------------- */
/* Translations (English / Urdu)                                          */
/* ---------------------------------------------------------------------- */

const STRINGS = {
  nav_dashboard: { en: "Dashboard", ur: "ڈیش بورڈ" },
  nav_map: { en: "Map", ur: "نقشہ" },
  nav_trends: { en: "Trends", ur: "رجحانات" },
  nav_alerts: { en: "Alerts", ur: "الرٹس" },
  nav_about: { en: "About", ur: "تعارف" },
  nav_guide: { en: "AQI Guide", ur: "اے کیو آئی رہنما" },
  nav_help: { en: "Help Center", ur: "مدد مرکز" },
  nav_settings: { en: "Settings", ur: "ترتیبات" },

  footer_tagline: { en: "Real-time air quality monitoring, worldwide. Data-driven insights to help you breathe informed.", ur: "دنیا بھر میں حقیقی وقت میں ہوا کے معیار کی نگرانی۔ باخبر رہنے کے لیے ڈیٹا پر مبنی معلومات۔" },
  footer_platform: { en: "PLATFORM", ur: "پلیٹ فارم" },
  footer_information: { en: "INFORMATION", ur: "معلومات" },
  footer_rights: { en: "All rights reserved.", ur: "جملہ حقوق محفوظ ہیں۔" },

  dash_pollutant: { en: "POLLUTANT BREAKDOWN", ur: "آلودگی کی تفصیل" },
  dash_weather: { en: "WEATHER CONDITIONS", ur: "موسمی حالات" },
  dash_scale: { en: "AQI SCALE REFERENCE", ur: "اے کیو آئی پیمانہ" },
  dash_locations: { en: "MY LOCATIONS", ur: "میرے مقامات" },
  dash_health: { en: "HEALTH ADVISORY", ur: "صحت ایڈوائزری" },
  dash_forecast: { en: "7-DAY AQI FORECAST", ur: "7 دن کی پیش گوئی" },
  dash_ml: { en: "ML-Powered Forecast", ur: "اے آئی پیش گوئی" },
  dash_rankings: { en: "GLOBAL AIR QUALITY RANKINGS", ur: "عالمی ایئر کوالٹی درجہ بندی" },
  dash_trend: { en: "7-DAY TREND", ur: "7 دن کا رجحان" },
  dash_full_rankings: { en: "View Full Rankings", ur: "مکمل درجہ بندی دیکھیں" },
  dash_detailed_trends: { en: "View Detailed Trends", ur: "تفصیلی رجحانات دیکھیں" },
  dash_community_title: { en: "Share air quality data with your community", ur: "اپنی کمیونٹی کے ساتھ ہوا کے معیار کا ڈیٹا شیئر کریں" },
  dash_community_sub: { en: "Help build the world's most comprehensive air quality network. Share readings, invite friends, and contribute to cleaner air awareness.", ur: "دنیا کا سب سے جامع ایئر کوالٹی نیٹ ورک بنانے میں مدد کریں۔ ریڈنگز شیئر کریں، دوستوں کو مدعو کریں۔" },
  dash_share: { en: "Share Data", ur: "ڈیٹا شیئر کریں" },
  dash_invite: { en: "Invite Friends", ur: "دوستوں کو مدعو کریں" },
  dash_addarea: { en: "Add Area", ur: "علاقہ شامل کریں" },
  dash_scan: { en: "Scan to open AirVibe", ur: "ایئروائب کھولنے کے لیے اسکین کریں" },

  map_title: { en: "Air Quality Map", ur: "ایئر کوالٹی نقشہ" },
  map_stations: { en: "monitoring stations worldwide", ur: "دنیا بھر میں نگرانی اسٹیشنز" },
  map_heatmap: { en: "Heatmap", ur: "ہیٹ میپ" },
  map_sites: { en: "Schools & Hospitals", ur: "اسکول اور ہسپتال" },
  map_click: { en: "Click a station", ur: "اسٹیشن پر کلک کریں" },
  map_click_sub: { en: "Select any marker on the map to view detailed readings", ur: "تفصیلی ریڈنگ دیکھنے کے لیے نقشے پر کوئی نشان منتخب کریں" },
  map_search_ph: { en: "Search an area (e.g. Gulberg, DHA, Clifton)…", ur: "علاقہ تلاش کریں (مثلاً گلبرگ، ڈی ایچ اے)…" },
  map_search_btn: { en: "AI Predict", ur: "پیش گوئی" },
  map_all_stations: { en: "All Stations", ur: "تمام اسٹیشنز" },
  map_save_tag: { en: "Save & Tag This Place", ur: "یہ جگہ محفوظ کریں" },
  map_not_found: { en: "Location not found — try a nearby city or area name.", ur: "مقام نہیں ملا — قریبی شہر یا علاقے کا نام آزمائیں۔" },

  alerts_title: { en: "Alerts & Notifications", ur: "الرٹس اور اطلاعات" },
  alerts_unread: { en: "unread alerts", ur: "غیر پڑھے الرٹس" },
  alerts_manage: { en: "Manage your saved places and AQI threshold alerts", ur: "اپنی محفوظ جگہوں اور اے کیو آئی الرٹس کا انتظام کریں" },
  alerts_add: { en: "Add Alert", ur: "الرٹ شامل کریں" },
  alerts_tab_alerts: { en: "Alerts", ur: "الرٹس" },
  alerts_tab_notifications: { en: "Notifications", ur: "اطلاعات" },
  alerts_tab_tips: { en: "Tips", ur: "تجاویز" },

  settings_title: { en: "Settings", ur: "ترتیبات" },
  settings_sub: { en: "Manage how AirVibe looks and notifies you.", ur: "ایئروائب کیسا دکھتا ہے اور مطلع کرتا ہے، اسے یہاں منظم کریں۔" },
  settings_appearance: { en: "APPEARANCE", ur: "ظاہری شکل" },
  settings_dark: { en: "Dark mode", ur: "ڈارک موڈ" },
  settings_dark_sub: { en: "Switch between dark and light theme", ur: "ڈارک اور لائٹ تھیم کے درمیان سوئچ کریں" },
  settings_language: { en: "LANGUAGE", ur: "زبان" },
  settings_language_label: { en: "Urdu interface", ur: "اردو انٹرفیس" },
  settings_language_sub: { en: "Toggle between English and Urdu", ur: "انگریزی اور اردو کے درمیان تبدیل کریں" },
  settings_notifications: { en: "NOTIFICATIONS", ur: "اطلاعات" },
  settings_push: { en: "Push alerts for threshold breaches", ur: "حد سے تجاوز پر پش الرٹس" },
  settings_email: { en: "Email notifications", ur: "ای میل اطلاعات" },
  settings_weekly: { en: "Weekly air quality summary", ur: "ہفتہ وار ہوا کے معیار کا خلاصہ" },
  settings_units: { en: "UNITS", ur: "اکائیاں" },
  settings_data: { en: "DATA", ur: "ڈیٹا" },
  settings_autorefresh: { en: "Auto-refresh every 10 minutes", ur: "ہر 10 منٹ بعد خودکار ریفریش" },
  settings_refresh: { en: "Refresh Now", ur: "ابھی ریفریش کریں" },

  trend_ai_title: { en: "AI-PREDICTED OUTLOOK", ur: "اے آئی پیش گوئی" },
  trend_ai_caption: { en: "Projected from recent trend modelling — an estimate, not a guarantee.", ur: "حالیہ رجحان پر مبنی تخمینہ — یہ ضمانت نہیں۔" },
};

function useT() {
  const { lang } = useLanguage();
  return (key) => STRINGS[key]?.[lang] ?? STRINGS[key]?.en ?? key;
}

/* ---------------------------------------------------------------------- */
/* AQI + geo helpers                                                       */
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
function cityDisplayName(name) {
  return name && name.includes(",") ? name : `${name}, Pakistan`;
}
function tagIcon(tag = "") {
  const t = tag.toLowerCase();
  if (t.includes("home")) return Home;
  if (t.includes("gym")) return Activity;
  if (t.includes("school") || t.includes("college") || t.includes("university")) return School;
  if (t.includes("hospital") || t.includes("clinic")) return Stethoscope;
  if (t.includes("office") || t.includes("work")) return Building2;
  return MapPin;
}

function fetchJsonWithTimeout(url, ms = 6000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal })
    .then((r) => {
      if (!r.ok) throw new Error("bad response");
      return r.json();
    })
    .finally(() => clearTimeout(timer));
}

// Inverse-distance-weighted AQI estimate from known live city readings —
// used as the "AI-predicted" figure for any searched location, cross-checked
// against a direct sensor reading when one is available.
function predictAqiDetailed(lat, lon, liveCities) {
  const withData = CITIES.map((c) => ({ ...c, aqi: liveCities[c.name]?.aqi }))
    .filter((c) => c.aqi != null)
    .map((c) => ({ ...c, distKm: Math.sqrt((c.lat - lat) ** 2 + (c.lon - lon) ** 2) * 111 }))
    .sort((a, b) => a.distKm - b.distKm);
  if (!withData.length) return { aqi: null, stationsUsed: 0, nearestKm: null, nearestName: null, confidence: "unknown" };
  const top = withData.slice(0, 5);
  let num = 0, den = 0;
  top.forEach((c) => {
    const w = 1 / ((c.distKm || 0.1) ** 2);
    num += w * c.aqi;
    den += w;
  });
  const nearest = withData[0];
  const confidence = nearest.distKm < 30 ? "high" : nearest.distKm < 80 ? "moderate" : "low";
  return { aqi: Math.round(num / den), stationsUsed: top.length, nearestKm: Math.round(nearest.distKm), nearestName: nearest.name, confidence };
}

function predictAqiAt(lat, lon, liveCities) {
  return predictAqiDetailed(lat, lon, liveCities).aqi;
}

// World Air Quality Index (waqi.info) — a community/government sensor
// aggregator used here purely to surface additional real monitoring
// stations beyond our curated city list. Note: this token is embedded in
// client-side code, so it's visible to anyone viewing the page source —
// fine for a free-tier personal token, but don't reuse a sensitive key here.
const WAQI_TOKEN = "eae3fc6ccff4d23b9fcaa0696f9b8bdca4b7f630";

async function fetchWaqiStations(minLat, minLon, maxLat, maxLon) {
  try {
    const url = `https://api.waqi.info/map/bounds/?latlng=${minLat},${minLon},${maxLat},${maxLon}&token=${WAQI_TOKEN}`;
    const data = await fetchJsonWithTimeout(url, 9000);
    if (data.status !== "ok" || !Array.isArray(data.data)) return null;
    return data.data
      .filter((s) => s.aqi && s.aqi !== "-" && !isNaN(Number(s.aqi)))
      .map((s) => ({
        uid: s.uid,
        name: s.station?.name || "WAQI Station",
        lat: s.lat,
        lon: s.lon,
        aqi: Number(s.aqi),
      }))
      .slice(0, 300);
  } catch (e) {
    return null;
  }
}

async function fetchLiveAqiAt(lat, lon) {
  try {
    const data = await fetchJsonWithTimeout(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi&timezone=auto`,
      6000
    );
    const v = data?.current?.us_aqi;
    return v != null ? Math.round(v) : null;
  } catch (e) {
    return null;
  }
}

async function searchLocation(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const local = KNOWN_AREAS.find((a) => a.name.toLowerCase().includes(q) || q.includes(a.name.toLowerCase().split(",")[0].toLowerCase()));
  if (local) return { name: local.name, lat: local.lat, lon: local.lon };
  const cityMatch = CITIES.find((c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase()));
  if (cityMatch) return { name: cityMatch.name, lat: cityMatch.lat, lon: cityMatch.lon };
  try {
    const res = await fetchJsonWithTimeout(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
      6000
    );
    const hit = res?.results?.[0];
    if (hit) return { name: `${hit.name}${hit.admin1 ? ", " + hit.admin1 : ""}`, lat: hit.latitude, lon: hit.longitude };
  } catch (e) {
    /* geocoding blocked or unavailable — fall through */
  }
  return null;
}

/* ---------------------------------------------------------------------- */
/* Contexts                                                                */
/* ---------------------------------------------------------------------- */

const ThemeContext = createContext({ mode: "dark", toggle: () => {} });
function useTheme() {
  return useContext(ThemeContext);
}

const LanguageContext = createContext({ lang: "en", setLang: () => {} });
function useLanguage() {
  return useContext(LanguageContext);
}

function GlobalStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      /* Light mode: darken muted text that sits directly on the light page
         background for readable contrast. */
      .light-theme .text-slate-400 { color: #334155; }
      .light-theme .text-slate-500 { color: #1e293b; }
      .light-theme .text-slate-300 { color: #0f172a; }

      /* ...but cards/panels keep a dark background in both themes, so
         restore the original lighter gray for text inside them. */
      .light-theme [class*="bg-slate-900"] .text-slate-400,
      .light-theme [class*="bg-slate-950"] .text-slate-400,
      .light-theme [class*="bg-white/5"] .text-slate-400 { color: #94a3b8; }
      .light-theme [class*="bg-slate-900"] .text-slate-500,
      .light-theme [class*="bg-slate-950"] .text-slate-500,
      .light-theme [class*="bg-white/5"] .text-slate-500 { color: #64748b; }
      .light-theme [class*="bg-slate-900"] .text-slate-300,
      .light-theme [class*="bg-slate-950"] .text-slate-300,
      .light-theme [class*="bg-white/5"] .text-slate-300 { color: #cbd5e1; }
    `}</style>
  );
}

/* ---------------------------------------------------------------------- */
/* Live data hook — pulls real current air-quality + weather               */
/* readings from Open-Meteo's free public APIs (no key required) and      */
/* cross-references them against PEPA / Punjab EPD / NEQS style bands.    */
/* Falls back to a realistic simulated feed if the network is blocked     */
/* (e.g. inside a sandboxed preview) so the UI still populates.           */
/* ---------------------------------------------------------------------- */

function useLiveAirQuality(homeCity = "Lahore") {
  const [state, setState] = useState({
    loading: true,
    error: null,
    cities: {},
    weekly: [],
    weather: null,
    dailyWeather: [],
    updatedAt: null,
  });

  const buildSimulated = (cityName) => {
    const seed = Math.floor(Date.now() / (5 * 60 * 1000));
    const jitter = (base, spread) => {
      const n = Math.sin(seed * 12.9898 + base * 78.233) * 43758.5453;
      const r = n - Math.floor(n);
      return Math.max(0, base + (r - 0.5) * spread);
    };
    const hashOf = (str) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000;
      return h;
    };
    const baselineFor = (name) => {
      if (BASELINE[name]) return BASELINE[name];
      const h = hashOf(name);
      const aqi = 30 + (h % 160); // plausible spread: 30-190
      return {
        aqi,
        pm2_5: Math.round(aqi * 0.48 * 10) / 10,
        pm10: Math.round(aqi * 0.76),
        ozone: 20 + (h % 35),
        no2: 12 + (h % 30),
        so2: 4 + (h % 12),
        co: 300 + (h % 600),
      };
    };

    const cities = {};
    CITIES.forEach((c) => {
      const b = baselineFor(c.name);
      cities[c.name] = {
        aqi: Math.round(jitter(b.aqi, 10)),
        pm2_5: jitter(b.pm2_5, 8),
        pm10: jitter(b.pm10, 12),
        ozone: jitter(b.ozone, 6),
        no2: jitter(b.no2, 5),
        so2: jitter(b.so2, 3),
        co: jitter(b.co, 60),
      };
    });

    const cityBase = baselineFor(cityName).aqi;
    const ratio = cityBase / BASELINE.Lahore.aqi;
    const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const lahoreWeekPattern = [145, 162, 178, 190, 187, 183, 187];
    const weekly = weekdayNames.map((day, i) => ({ day, aqi: Math.round(jitter(lahoreWeekPattern[i] * ratio, 4)) }));

    const forecastPattern = [187, 175, 168, 155, 160, 172, 180];
    const forecastCodes = [2, 2, 3, 1, 0, 61, 2];
    const dailyWeather = forecastPattern.map((v, i) => ({
      day: i === 0 ? "Today" : weekdayNames[(new Date().getDay() + i) % 7],
      code: forecastCodes[i],
      aqi: Math.round(jitter(v * ratio, 4)),
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
    const home = CITIES.find((c) => c.name === homeCity) || CITIES[0];
    try {
      const CHUNK = 40;
      const chunks = [];
      for (let i = 0; i < CITIES.length; i += CHUNK) chunks.push(CITIES.slice(i, i + CHUNK));

      const aqUrls = chunks.map((chunk) => {
        const lats = chunk.map((c) => c.lat).join(",");
        const lons = chunk.map((c) => c.lon).join(",");
        return (
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}` +
          `&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide&timezone=auto`
        );
      });
      const homeHourlyUrl =
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${home.lat}&longitude=${home.lon}` +
        `&hourly=us_aqi&forecast_days=7&timezone=auto`;
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${home.lat}&longitude=${home.lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature` +
        `&daily=weather_code,temperature_2m_max&forecast_days=7&timezone=auto`;

      const [aqResChunks, hourlyRes, weatherRes] = await Promise.all([
        Promise.all(aqUrls.map((u) => fetchJsonWithTimeout(u))),
        fetchJsonWithTimeout(homeHourlyUrl),
        fetchJsonWithTimeout(weatherUrl),
      ]);

      const aqArray = [];
      aqResChunks.forEach((res) => {
        const arr = Array.isArray(res) ? res : [res];
        aqArray.push(...arr);
      });

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
      const weekly = dayKeys.map((k) => ({
        day: weekday(k),
        aqi: Math.round(byDay[k].reduce((a, b) => a + b, 0) / byDay[k].length),
      }));

      const dailyWeatherCodes = weatherRes?.daily?.weather_code || [];
      const dailyTimes = weatherRes?.daily?.time || [];
      const dailyWeather = dailyTimes.map((t, i) => ({
        day: i === 0 ? "Today" : weekday(t),
        code: dailyWeatherCodes[i],
        aqi: weekly[i]?.aqi ?? null,
      }));

      setState({ loading: false, error: null, cities, weekly, dailyWeather, weather: weatherRes?.current || null, updatedAt: new Date() });
    } catch (e) {
      const sim = buildSimulated(home.name);
      setState({
        loading: false,
        error:
          "Live network requests are blocked inside this preview sandbox, so figures below are a realistic simulated feed (auto-refreshing) rather than a true live fetch. Publish the site to a normal host and the real Open-Meteo live fetch will work.",
        cities: sim.cities,
        weekly: sim.weekly,
        dailyWeather: sim.dailyWeather,
        weather: sim.weather,
        updatedAt: new Date(),
      });
    }
  }, [homeCity]);

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
  const [settled, setSettled] = useState(false);

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

  // Once the fade/slide-in transition has finished, drop the `transform`
  // property entirely (not just set it to translateY(0)) — any transform
  // value, including a no-op one, permanently creates a new CSS stacking
  // context for this element. Left in place, that isolates z-index here
  // from the rest of the page, so a dropdown opened inside this wrapper
  // could end up rendered *behind* a later section on the page even with
  // a high z-index. Dropping the transform after settling removes that
  // isolation so normal page-wide z-index stacking applies again.
  const style = settled
    ? { opacity: 1 }
    : {
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
      };

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onTransitionEnd={() => {
        if (visible) setSettled(true);
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
    <div style={{ transition: "opacity 0.35s ease, transform 0.35s ease", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(10px)" }}>
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
  { key: "dashboard", label: "nav_dashboard" },
  { key: "map", label: "nav_map" },
  { key: "trends", label: "nav_trends" },
  { key: "alerts", label: "nav_alerts" },
  { key: "about", label: "nav_about" },
  { key: "guide", label: "nav_guide" },
  { key: "help", label: "nav_help" },
  { key: "settings", label: "nav_settings" },
];

function LocationPicker({ homeCity, setHomeCity, trigger, align = "left" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = CITIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1">
        {trigger}
        <ChevronDown size={14} className={`opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute z-40 top-full mt-2 ${align === "right" ? "right-0" : "left-0"} w-56 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden`}>
          <div className="flex items-center justify-between gap-2 p-2 border-b border-white/5">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city…"
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none placeholder:text-slate-500"
            />
            <button type="button" onClick={() => setOpen(false)} className="flex-shrink-0 text-slate-400 hover:text-slate-200">
              <X size={16} />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto p-1.5">
            {filtered.length === 0 && <p className="text-xs text-slate-500 px-3 py-2">No matching city</p>}
            {filtered.map((c) => (
              <button
                type="button"
                key={c.name}
                onClick={() => { setHomeCity(c.name); setOpen(false); setQuery(""); }}
                className={`w-full flex items-center justify-between text-left text-sm px-3 py-2 rounded-lg transition ${c.name === homeCity ? "text-cyan-400 bg-cyan-400/10" : "text-slate-200 hover:bg-white/5"}`}
              >
                {c.name}
                {c.name === homeCity && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavBar({ page, setPage, live, homeCity, setHomeCity }) {
  const { mode, toggle } = useTheme();
  const t = useT();
  const dark = mode === "dark";
  return (
    <header className={`relative z-20 border-b sticky top-0 backdrop-blur transition-colors duration-500 ${dark ? "border-white/5 bg-slate-950/80" : "border-slate-200 bg-white/85"}`}>
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-6 py-5">
        <button onClick={() => setPage("dashboard")} className="flex-shrink-0">
          <Logo big />
        </button>
        <div className={`hidden md:flex items-center gap-1.5 text-sm flex-shrink-0 ${dark ? "text-slate-400" : "text-slate-500"}`}>
          <MapPin size={14} className="text-red-400" />
          <LocationPicker
            homeCity={homeCity}
            setHomeCity={setHomeCity}
            trigger={<span>{cityDisplayName(homeCity)}</span>}
          />
          {!live.loading && (
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
                className={`relative pb-1 transition-colors flex-shrink-0 ${page === it.key ? "text-cyan-400" : dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
              >
                {t(it.label)}
                {page === it.key && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />}
              </button>
            ))}
          </div>
        </nav>

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition ${dark ? "border-white/10 text-yellow-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}

        </button>
      </div>
    </header>
  );
}

function Footer({ setPage }) {
  const { mode } = useTheme();
  const t = useT();
  const dark = mode === "dark";
  return (
    <footer className={`relative border-t mt-24 transition-colors duration-500 ${dark ? "border-white/5" : "border-slate-200"}`}>
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Logo big />
          <p className={`text-sm mt-4 max-w-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{t("footer_tagline")}</p>
          <p className="text-cyan-400 font-semibold text-sm mt-4">AirVibe — Breathe Informed</p>
          <div className="flex items-center gap-3 mt-5 flex-wrap">
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
          <h4 className="text-cyan-400 text-xs font-bold tracking-widest mb-4">{t("footer_platform")}</h4>
          <ul className={`space-y-3 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("dashboard")}>{t("nav_dashboard")}</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("map")}>{t("nav_map")}</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("trends")}>{t("nav_trends")}</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("alerts")}>{t("nav_alerts")}</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-cyan-400 text-xs font-bold tracking-widest mb-4">{t("footer_information")}</h4>
          <ul className={`space-y-3 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("about")}>{t("nav_about")}</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("guide")}>{t("nav_guide")}</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("help")}>{t("nav_help")}</button></li>
            <li><button className="hover:text-cyan-400" onClick={() => setPage("settings")}>{t("nav_settings")}</button></li>
          </ul>
        </div>
      </div>
      <div className={`max-w-6xl mx-auto px-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs border-t pt-6 ${dark ? "text-slate-500 border-white/5" : "text-slate-400 border-slate-200"}`}>
        <span>© 2026 AirVibe. {t("footer_rights")}</span>
        <span className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Global Air Quality Monitoring Network
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
      <div className="absolute top-1/2 left-1/2 w-0.5 h-24 origin-bottom rounded-full" style={{ background: color, transform: `translate(-50%,-100%) rotate(${angle}deg)`, transition: "transform 1s cubic-bezier(0.16,1,0.3,1)" }} />
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
      <p className="text-2xl font-bold mt-1" style={{ color }}>{value == null ? "—" : label === "CO" ? value.toFixed(1) : Math.round(value * 10) / 10}</p>
      <p className="text-[11px] text-slate-500 mb-2">{unit}</p>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function DashboardPage({ setPage, live, homeCity, setHomeCity }) {
  const t = useT();
  const home = live.cities[homeCity] || {};
  const aqi = home.aqi;
  const weather = live.weather;
  const WIcon = weatherIcon(weather?.weather_code);
  const primaryPollutant = CITIES.find((c) => c.name === homeCity)?.primaryPollutant || "PM2.5";

  const [myLocations, setMyLocations] = useState(["Karachi", "Islamabad", "Peshawar"]);
  const [showAddArea, setShowAddArea] = useState(false);
  const [addAreaQuery, setAddAreaQuery] = useState("");

  const [rankingsScope, setRankingsScope] = useState("pakistan");
  const globalRankings = useMemo(
    () => CITIES.map((c) => ({ city: c.name, aqi: live.cities[c.name]?.aqi ?? null })).filter((r) => r.aqi != null).sort((a, b) => b.aqi - a.aqi),
    [live.cities]
  );
  const pakistanRankings = useMemo(
    () => globalRankings.filter((r) => !r.city.includes(",")),
    [globalRankings]
  );
  const rankings = rankingsScope === "pakistan" ? pakistanRankings : globalRankings;

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
            <LocationPicker
              homeCity={homeCity}
              setHomeCity={setHomeCity}
              trigger={<span className="text-xl font-bold">{cityDisplayName(homeCity)}</span>}
            />
            <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Reveal delay={80} className="flex flex-col items-center">
            <AqiGauge value={aqi} />
            <span className={`mt-2 text-sm font-bold px-4 py-1 rounded-full border ${badgeClasses(aqi)}`}>{aqiLabel(aqi).toUpperCase()}</span>
            <p className="text-xs text-slate-500 mt-3">Primary Pollutant: <span className="font-semibold">{primaryPollutant}</span></p>
          </Reveal>

          <Reveal delay={140}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">{t("dash_pollutant")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PollutantCard label="PM2.5" value={home.pm2_5} unit="µg/m³" max={250} color={aqiColor(aqi)} />
              <PollutantCard label="PM10" value={home.pm10} unit="µg/m³" max={350} color={aqiColor(aqi)} />
              <PollutantCard label="O3" value={home.ozone} unit="ppb" max={150} color="#eab308" />
              <PollutantCard label="NO2" value={home.no2} unit="ppb" max={150} color="#22c55e" />
              <PollutantCard label="SO2" value={home.so2} unit="ppb" max={100} color="#22c55e" />
              <PollutantCard label="CO" value={home.co ? home.co / 1000 : null} unit="ppm" max={5} color="#22c55e" />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">{t("dash_weather")}</h2>
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
                  <p className="font-bold mt-1">{home.pm2_5 ? Math.max(0.5, (10 - home.pm2_5 / 20)).toFixed(1) : "—"} km</p>
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
            <h2 className="text-xs font-bold tracking-widest text-slate-400">{t("dash_scale")}</h2>
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
            <h2 className="text-xs font-bold tracking-widest text-slate-400">{t("dash_locations")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {myLocations.filter((name) => name !== homeCity).map((name, i) => {
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
              <button type="button" onClick={() => setShowAddArea((s) => !s)} className="w-full h-full flex flex-col items-center justify-center gap-1 border border-dashed border-white/15 rounded-xl p-4 text-cyan-400 hover:border-cyan-400/40 transition">
                <Plus size={18} />
                <span className="text-xs font-semibold">{t("dash_addarea")}</span>
              </button>
              {showAddArea && (
                <div className="absolute z-40 top-full mt-2 left-0 w-60 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <div className="flex items-center gap-2 p-2 border-b border-white/5 sticky top-0 bg-slate-900">
                    <input
                      autoFocus
                      value={addAreaQuery}
                      onChange={(e) => setAddAreaQuery(e.target.value)}
                      placeholder="Search a city…"
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none placeholder:text-slate-500"
                    />
                    <button type="button" onClick={() => setShowAddArea(false)} className="flex-shrink-0 text-[11px] text-cyan-400 font-semibold">Done</button>
                  </div>
                  <div className="max-h-56 overflow-y-auto p-1.5">
                    {CITIES.filter((c) => c.name !== homeCity && c.name.toLowerCase().includes(addAreaQuery.toLowerCase())).map((c) => {
                      const added = myLocations.includes(c.name);
                      return (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() => setMyLocations((prev) => (added ? prev.filter((n) => n !== c.name) : [...prev, c.name]))}
                          className={`w-full flex items-center justify-between text-left text-sm px-3 py-2 rounded-lg transition ${added ? "text-cyan-400 bg-cyan-400/10" : "hover:bg-white/5"}`}
                        >
                          {c.name}
                          {added && <span className="text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
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
              <h2 className="text-xs font-bold tracking-widest text-slate-400">{t("dash_health")}</h2>
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
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">{t("dash_forecast")}</h2>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2.5 py-1 rounded-full">
              <Brain size={12} /> {t("dash_ml")}
            </span>
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
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-cyan-400 rounded-full" />
                <h2 className="text-xs font-bold tracking-widest text-slate-400">
                  {rankingsScope === "pakistan" ? "PAKISTAN AIR QUALITY RANKINGS" : t("dash_rankings")}
                </h2>
              </div>
              <div className="flex items-center gap-1 bg-slate-950/60 border border-white/10 rounded-full p-1">
                <button type="button" onClick={() => setRankingsScope("pakistan")} className={`text-xs px-3 py-1 rounded-full transition ${rankingsScope === "pakistan" ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-400"}`}>
                  Pakistan
                </button>
                <button type="button" onClick={() => setRankingsScope("global")} className={`text-xs px-3 py-1 rounded-full transition ${rankingsScope === "global" ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-400"}`}>
                  Global
                </button>
              </div>
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
              {rankings.length === 0 && <p className="text-sm text-slate-500 py-4">No data yet.</p>}
            </div>
            <button onClick={() => setPage("map")} className="w-full mt-5 flex items-center justify-center gap-1.5 text-cyan-400 font-semibold text-sm bg-cyan-400/5 hover:bg-cyan-400/10 border border-cyan-400/20 rounded-xl py-3 transition">
              {t("dash_full_rankings")} <ChevronRight size={15} />
            </button>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1 h-5 bg-cyan-400 rounded-full" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400">{t("dash_trend")} — {homeCity.toUpperCase()}</h2>
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
              {t("dash_detailed_trends")} <ChevronRight size={15} />
            </button>
          </div>
        </Reveal>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 py-20 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-cyan-400 border border-cyan-400/30 rounded-full px-4 py-1.5 mb-6">
            <Users size={13} /> COMMUNITY DATA
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">{t("dash_community_title")}</h2>
          <p className="text-slate-400 mt-5 max-w-xl mx-auto">{t("dash_community_sub")}</p>
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            <button className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold px-6 py-3 rounded-full transition shadow-lg shadow-cyan-500/20">
              <Share2 size={16} /> {t("dash_share")}
            </button>
            <button className="flex items-center gap-2 border border-white/15 hover:border-cyan-400/50 text-slate-200 font-semibold px-6 py-3 rounded-full transition">
              <UserPlus size={16} /> {t("dash_invite")}
            </button>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
              <img src={qrUrl} alt="QR code linking to AirVibe" width={100} height={100} className="rounded-lg bg-white p-1" />
              <div>
                <p className="font-semibold text-sm flex items-center gap-1.5"><QrCode size={14} className="text-cyan-400"/> {t("dash_scan")}</p>
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

function MapPage({ live, places, setPlaces }) {
  const t = useT();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSites, setShowSites] = useState(false);
  const [showWaqi, setShowWaqi] = useState(false);
  const [waqiStations, setWaqiStations] = useState([]);
  const [waqiStatus, setWaqiStatus] = useState("idle");

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showTagForm, setShowTagForm] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagThreshold, setTagThreshold] = useState(150);
  const [savedMsg, setSavedMsg] = useState(false);

  const minLat = -58, maxLat = 78, minLng = -170, maxLng = 180;
  const toXY = (lat, lng) => ({ x: ((lng - minLng) / (maxLng - minLng)) * 100, y: 100 - ((lat - minLat) / (maxLat - minLat)) * 100 });
  const satelliteUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${minLng},${minLat},${maxLng},${maxLat}&bboxSR=4326&imageSR=4326&size=1400,760&format=png24&f=image`;
  const [satelliteOk, setSatelliteOk] = useState(true);
  const [satelliteLoaded, setSatelliteLoaded] = useState(false);

  const toggleWaqi = async () => {
    if (!showWaqi && waqiStatus === "idle") {
      setWaqiStatus("loading");
      const stations = await fetchWaqiStations(minLat, minLng, maxLat, maxLng);
      if (stations === null) setWaqiStatus("error");
      else {
        setWaqiStations(stations);
        setWaqiStatus("ok");
      }
    }
    setShowWaqi((v) => !v);
  };

  const stations = useMemo(() => {
    return CITIES.map((c) => {
      const d = live.cities[c.name] || {};
      return { id: c.name, city: c.name, label: c.name, lat: c.lat, lon: c.lon, aqi: d.aqi ?? null };
    }).filter((s) => s.aqi != null);
  }, [live.cities]);

  const filterBands = { Good: [0, 50], Moderate: [51, 100], Unhealthy: [101, 200], Hazardous: [201, 500] };
  const filtered = stations.filter((s) => {
    if (filter === "All" || s.aqi == null) return true;
    const [lo, hi] = filterBands[filter];
    return s.aqi >= lo && s.aqi <= hi;
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchResult(null);
    setShowTagForm(false);
    const loc = await searchLocation(query);
    if (!loc) {
      setSearchResult({ error: true });
      setSearching(false);
      return;
    }
    const liveAqi = await fetchLiveAqiAt(loc.lat, loc.lon);
    const detail = predictAqiDetailed(loc.lat, loc.lon, live.cities);
    const finalAqi = liveAqi ?? detail.aqi;
    setSearchResult({ ...loc, aqi: finalAqi, method: liveAqi != null ? "live" : "predicted", detail });
    setTagName(loc.name.split(",")[0]);
    setTagThreshold(150);
    setSearching(false);
  };

  const savePlace = () => {
    if (!searchResult || searchResult.error) return;
    setPlaces((prev) => [
      ...prev,
      {
        id: Date.now(),
        tag: tagName.trim() || searchResult.name,
        name: searchResult.name,
        lat: searchResult.lat,
        lon: searchResult.lon,
        threshold: Number(tagThreshold) || 150,
        active: true,
        lastTriggered: null,
      },
    ]);
    setShowTagForm(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const nearestCityAqi = (lat, lon) => predictAqiAt(lat, lon, live.cities);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <Reveal>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><MapIcon className="text-cyan-400" size={20}/> {t("map_title")}</h1>
            <p className="text-slate-400 text-sm mt-1">{stations.length} {t("map_stations")}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-full p-1 overflow-x-auto no-scrollbar">
              {["All", "Good", "Moderate", "Unhealthy", "Hazardous"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`text-sm px-4 py-1.5 rounded-full transition flex-shrink-0 ${filter === f ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-300"}`}>{f}</button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-full p-1">
              <button onClick={() => setShowHeatmap((v) => !v)} className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full transition ${showHeatmap ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-300"}`}>
                <Layers size={13} /> {t("map_heatmap")}
              </button>
              <button onClick={() => setShowSites((v) => !v)} className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full transition ${showSites ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-300"}`}>
                <School size={13} /> {t("map_sites")}
              </button>
              <button onClick={toggleWaqi} className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full transition ${showWaqi ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-300"}`}>
                <Radio size={13} className={waqiStatus === "loading" ? "animate-pulse" : ""} /> WAQI Sensors
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={40}>
        <div className="mt-5 bg-slate-900/60 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-slate-950/60 border border-white/10 rounded-full px-4 py-2">
              <Search size={14} className="text-slate-500 flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("map_search_ph")}
                className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
              />
            </div>
            <button onClick={handleSearch} disabled={searching} className="flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold text-sm px-4 py-2 rounded-full transition disabled:opacity-60">
              <Sparkles size={14} className={searching ? "animate-spin" : ""} /> {t("map_search_btn")}
            </button>
          </div>

          {searchResult && (
            <div className="mt-4 pt-4 border-t border-white/5">
              {searchResult.error ? (
                <p className="text-sm text-orange-300">{t("map_not_found")}</p>
              ) : (
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-semibold">{searchResult.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-2xl font-bold" style={{ color: aqiColor(searchResult.aqi) }}>{searchResult.aqi ?? "—"}</span>
                      <span className={`text-xs px-3 py-1 rounded-full border ${badgeClasses(searchResult.aqi)}`}>{aqiLabel(searchResult.aqi)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                      <Brain size={11} className="text-cyan-400" />
                      {searchResult.method === "live"
                        ? "Live sensor reading"
                        : searchResult.detail
                        ? `AI-predicted using ${searchResult.detail.stationsUsed} nearby stations (nearest: ${searchResult.detail.nearestName}, ~${searchResult.detail.nearestKm} km) · ${searchResult.detail.confidence} confidence`
                        : "AI-predicted — interpolated from nearby monitoring stations"}
                    </p>
                  </div>
                  {!showTagForm ? (
                    <button onClick={() => setShowTagForm(true)} className="flex items-center gap-1.5 text-cyan-400 font-semibold text-sm bg-cyan-400/10 border border-cyan-400/30 px-4 py-2 rounded-full hover:bg-cyan-400/20 transition flex-shrink-0">
                      <Plus size={14} /> {t("map_save_tag")}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <input value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="Tag (e.g. Home, Gym)" className="bg-slate-950 border border-white/10 rounded-full px-3 py-1.5 text-sm w-36" />
                      <input type="number" value={tagThreshold} onChange={(e) => setTagThreshold(e.target.value)} className="bg-slate-950 border border-white/10 rounded-full px-3 py-1.5 text-sm w-20" />
                      <button onClick={savePlace} className="text-sm font-semibold bg-cyan-400 text-slate-900 px-4 py-1.5 rounded-full">Save</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {savedMsg && <p className="text-xs text-emerald-400 mt-3">Saved — you'll find it under Alerts.</p>}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Reveal delay={80} className="lg:col-span-2">
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 relative overflow-hidden" style={{ height: 480 }}>
            <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-slate-950/70 px-2 py-1 rounded-full flex items-center gap-1.5"><MapPin size={12}/> {filtered.length} stations</span>
              <span className={`text-[11px] px-2 py-1 rounded-full flex items-center gap-1.5 ${!satelliteOk ? "bg-orange-500/15 text-orange-300" : satelliteLoaded ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-300"}`}>
                <Layers size={11}/> {!satelliteOk ? "Satellite unavailable here" : satelliteLoaded ? "Satellite loaded" : "Satellite loading…"}
              </span>
              {showWaqi && (
                <span className={`text-[11px] px-2 py-1 rounded-full flex items-center gap-1.5 ${waqiStatus === "error" ? "bg-orange-500/15 text-orange-300" : waqiStatus === "ok" ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-300"}`}>
                  <Radio size={11}/> {waqiStatus === "error" ? "WAQI sensors unavailable here" : waqiStatus === "ok" ? `${waqiStations.length} WAQI sensors loaded` : "Loading WAQI sensors…"}
                </span>
              )}
            </div>
            <div className="absolute top-4 right-6 flex flex-col gap-2">
              <button className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400"><ZoomIn size={14}/></button>
              <button className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400"><ZoomOut size={14}/></button>
              <button className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400"><Navigation size={14}/></button>
            </div>
            <div className="absolute inset-6 mt-10 rounded-xl border border-cyan-400/10 overflow-hidden">
              {satelliteOk && (
                <img
                  src={satelliteUrl}
                  alt="Satellite map of Pakistan"
                  className="absolute inset-0 w-full h-full"
                  style={{ objectFit: "fill" }}
                  onLoad={() => setSatelliteLoaded(true)}
                  onError={() => setSatelliteOk(false)}
                />
              )}
              <div className="absolute inset-0" style={{ background: satelliteOk ? "rgba(2,6,23,0.55)" : "transparent" }} />
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                {[-120, -60, 0, 60, 120].map((lon) => {
                  const { x } = toXY(0, lon);
                  return <line key={`lon${lon}`} x1={x} y1={0} x2={x} y2={100} stroke="rgba(34,211,238,0.12)" strokeWidth="0.15" />;
                })}
                {[-40, 0, 40].map((lat) => {
                  const { y } = toXY(lat, 0);
                  return <line key={`lat${lat}`} x1={0} y1={y} x2={100} y2={y} stroke="rgba(34,211,238,0.12)" strokeWidth="0.15" />;
                })}
              </svg>
              {showHeatmap && filtered.map((s) => {
                const { x, y } = toXY(s.lat, s.lon);
                const c = aqiColor(s.aqi);
                return (
                  <div key={`heat-${s.id}`} className="absolute rounded-full pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, width: 160, height: 160, transform: "translate(-50%,-50%)", background: `radial-gradient(circle, ${c}55 0%, ${c}22 40%, transparent 70%)`, filter: "blur(6px)" }} />
                );
              })}
              {showSites && SENSITIVE_SITES.map((site, i) => {
                const { x, y } = toXY(site.lat, site.lon);
                const siteAqi = nearestCityAqi(site.lat, site.lon);
                const c = aqiColor(siteAqi);
                const SiteIcon = site.type === "school" ? School : Stethoscope;
                return (
                  <button key={`site-${i}`} onClick={() => setSelected({ city: site.type === "school" ? "School" : "Hospital", label: site.name, aqi: siteAqi })} style={{ left: `${x}%`, top: `${y}%`, position: "absolute", transform: "translate(-50%,-50%)" }}>
                    <span className="flex items-center justify-center rounded-full border-2 bg-slate-950" style={{ width: 20, height: 20, borderColor: c }}>
                      <SiteIcon size={11} style={{ color: c }} />
                    </span>
                  </button>
                );
              })}
              {showWaqi && waqiStations.map((s) => {
                const { x, y } = toXY(s.lat, s.lon);
                const c = aqiColor(s.aqi);
                return (
                  <button
                    key={`waqi-${s.uid}`}
                    onClick={() => setSelected({ city: "WAQI Sensor", label: s.name, aqi: s.aqi })}
                    style={{ left: `${x}%`, top: `${y}%`, position: "absolute", transform: "translate(-50%,-50%)" }}
                  >
                    <span className="block rounded-full border border-slate-950" style={{ background: c, width: 7, height: 7, opacity: 0.85 }} />
                  </button>
                );
              })}
              {searchResult && !searchResult.error && (() => {
                const { x, y } = toXY(searchResult.lat, searchResult.lon);
                return (
                  <div style={{ left: `${x}%`, top: `${y}%`, position: "absolute", transform: "translate(-50%,-100%)" }}>
                    <MapPin size={26} className="text-cyan-300 drop-shadow-lg" fill="#0891b2" />
                  </div>
                );
              })()}
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
                <p className="font-bold">{t("map_click")}</p>
                <p className="text-sm text-slate-400 mt-1">{t("map_click_sub")}</p>
              </div>
            )}
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold tracking-widest text-cyan-400 mb-3 flex items-center gap-1.5"><Search size={12}/> {t("map_all_stations")}</p>
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
  const t = useT();
  const [city, setCity] = useState("Lahore");
  const [range, setRange] = useState("Weekly");

  const [rankScope, setRankScope] = useState("pakistan");
  const globalRankings = useMemo(
    () => CITIES.map((c) => ({ city: c.name, aqi: live.cities[c.name]?.aqi ?? null })).sort((a, b) => (b.aqi ?? 0) - (a.aqi ?? 0)),
    [live.cities]
  );
  const pakistanRankings = useMemo(() => globalRankings.filter((r) => !r.city.includes(",")), [globalRankings]);
  const rankings = rankScope === "pakistan" ? pakistanRankings : globalRankings;

  const base = live.cities[city]?.aqi ?? 150;
  const cityWeekly = useMemo(() => {
    if (city === "Lahore" && live.weekly.length) return live.weekly;
    return (live.weekly.length ? live.weekly : Array(7).fill({ day: "" })).map((d, i) => ({
      day: d.day,
      aqi: Math.max(20, Math.round(base * (0.78 + i * 0.04))),
    }));
  }, [city, base, live.weekly]);

  // Simple linear-trend AI outlook: extrapolate the slope of the last 7 days
  // another 7 days forward, with a widening confidence band.
  const aiOutlook = useMemo(() => {
    const vals = cityWeekly.map((d) => d.aqi).filter((v) => v != null);
    if (vals.length < 2) return [];
    const n = vals.length;
    const xs = vals.map((_, i) => i);
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = vals.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    xs.forEach((x, i) => { num += (x - meanX) * (vals[i] - meanY); den += (x - meanX) ** 2; });
    const slope = den === 0 ? 0 : num / den;
    const intercept = meanY - slope * meanX;
    const dayNames = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    return dayNames.map((day, i) => {
      const x = n + i;
      const predicted = Math.max(15, Math.round(intercept + slope * x));
      const confidence = Math.round(6 + i * 3);
      return { day, aqi: predicted, low: Math.max(10, predicted - confidence), high: predicted + confidence };
    });
  }, [cityWeekly]);

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
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <p className="text-sm font-bold flex items-center gap-2"><TrendingUp size={15} className="text-cyan-400"/> City Rankings</p>
              <div className="flex items-center gap-1 bg-slate-950/60 border border-white/10 rounded-full p-1">
                <button type="button" onClick={() => setRankScope("pakistan")} className={`text-xs px-3 py-1 rounded-full transition ${rankScope === "pakistan" ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-400"}`}>Pakistan</button>
                <button type="button" onClick={() => setRankScope("global")} className={`text-xs px-3 py-1 rounded-full transition ${rankScope === "global" ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-400"}`}>Global</button>
              </div>
            </div>
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
        <div className="bg-slate-900/60 border border-cyan-400/20 rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
            <p className="text-xs font-bold tracking-widest text-cyan-400 flex items-center gap-2"><Brain size={14}/> {t("trend_ai_title")}</p>
          </div>
          <p className="text-xs text-slate-500 mb-4">{t("trend_ai_caption")}</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiOutlook} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
                <Line type="monotone" dataKey="high" stroke="#a855f7" strokeWidth={1} dot={false} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="aqi" stroke="#c084fc" strokeWidth={2.5} dot={{ r: 3, fill: "#c084fc" }} />
                <Line type="monotone" dataKey="low" stroke="#a855f7" strokeWidth={1} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Reveal>

      <Reveal delay={160}>
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

function AlertsPage({ live, places, setPlaces }) {
  const t = useT();
  const [tab, setTab] = useState("alerts");
  const [showForm, setShowForm] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newCity, setNewCity] = useState(CITIES[0].name);
  const [newThreshold, setNewThreshold] = useState(150);

  const toggleActive = (id) => setPlaces((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  const removePlace = (id) => setPlaces((prev) => prev.filter((a) => a.id !== id));
  const unread = NOTIFICATIONS.length;

  const addPlaceAlert = () => {
    const city = CITIES.find((c) => c.name === newCity);
    setPlaces((prev) => [
      ...prev,
      { id: Date.now(), tag: newTag.trim() || newCity, name: newCity, lat: city.lat, lon: city.lon, threshold: Number(newThreshold) || 150, active: true, lastTriggered: null },
    ]);
    setNewTag("");
    setNewThreshold(150);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <Reveal>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold">{t("alerts_title")}</h1>
            <p className="text-orange-400 text-sm font-medium mt-1">{unread} {t("alerts_unread")}</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-full p-1 overflow-x-auto no-scrollbar">
            {[["alerts", t("alerts_tab_alerts")], ["notifications", `${t("alerts_tab_notifications")} (${unread})`], ["tips", t("alerts_tab_tips")]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`text-sm px-4 py-1.5 rounded-full transition flex-shrink-0 ${tab === k ? "bg-cyan-400 text-slate-900 font-semibold" : "text-slate-300"}`}>{l}</button>
            ))}
          </div>
        </div>
      </Reveal>

      {tab === "alerts" && (
        <>
          <Reveal delay={60}>
            <div className="flex items-center justify-between mt-8 mb-5 flex-wrap gap-3">
              <p className="text-sm text-slate-400">{t("alerts_manage")}</p>
              <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 text-cyan-400 font-semibold text-sm hover:text-cyan-300">
                <Plus size={16} /> {t("alerts_add")}
              </button>
            </div>
          </Reveal>

          {showForm && (
            <Reveal>
              <div className="bg-slate-900/60 border border-cyan-400/20 rounded-2xl p-5 mb-6 flex items-center gap-3 flex-wrap">
                <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Tag (e.g. Home, Gym, School)" className="bg-slate-950 border border-white/10 rounded-full px-4 py-2 text-sm flex-1 min-w-[160px]" />
                <select value={newCity} onChange={(e) => setNewCity(e.target.value)} className="bg-slate-950 border border-white/10 rounded-full px-4 py-2 text-sm">
                  {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <input type="number" value={newThreshold} onChange={(e) => setNewThreshold(e.target.value)} className="bg-slate-950 border border-white/10 rounded-full px-4 py-2 text-sm w-24" />
                <button onClick={addPlaceAlert} className="bg-cyan-400 text-slate-900 font-semibold text-sm px-5 py-2 rounded-full">Save</button>
              </div>
            </Reveal>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {places.map((a, i) => {
              const current = predictAqiAt(a.lat, a.lon, live.cities);
              const triggered = current != null && current >= a.threshold;
              const TagIcon = tagIcon(a.tag);
              return (
                <Reveal key={a.id} delay={i * 80}>
                  <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <TagIcon size={15} className="text-cyan-400" />
                        <span className="font-semibold">{a.tag}</span>
                        {a.tag !== a.name && <span className="text-xs text-slate-500">· {a.name}</span>}
                        {a.active && <span className="text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Active</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleActive(a.id)} className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${a.active ? "bg-cyan-400/15 border-cyan-400/40 text-cyan-400" : "border-white/10 text-slate-500"}`}>
                          {a.active ? <Bell size={14} /> : <BellOff size={14} />}
                        </button>
                        <button onClick={() => removePlace(a.id)} className="w-8 h-8 rounded-full flex items-center justify-center border border-red-500/20 text-red-400 hover:bg-red-500/10 transition">
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
          {TIPS.map((tip, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                  <Lightbulb size={16} className="text-cyan-400" />
                </div>
                <p className="text-sm text-slate-200">{tip}</p>
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
          <p className="text-slate-400 mt-4">A real-time air quality monitoring platform that began in Pakistan and now covers cities worldwide, built to help everyone breathe informed.</p>
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
              AirVibe started in Pakistan to address a critical gap in the country's environmental awareness
              infrastructure — with Lahore consistently ranking among the world's most polluted cities and millions
              of Pakistanis exposed to hazardous air quality daily, we believe access to real-time, accurate air
              quality data is a public health necessity, not a luxury. That belief doesn't stop at any one border,
              so the same live monitoring, forecasting, and alerting now covers cities across every continent.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Our platform aggregates data from government monitoring stations, partner sensor networks, and
              community contributors to provide the most comprehensive picture of air quality wherever you are. We
              translate complex environmental data into actionable health guidance that everyone can understand
              and act on.
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
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1 h-5 bg-cyan-400 rounded-full" />
            <h2 className="text-xs font-bold tracking-widest text-slate-400">PLATFORM FEATURES</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Gauge, title: "Live AQI Monitoring", text: "Real-time readings for 8+ major Pakistani cities, refreshed automatically." },
            { icon: MapIcon, title: "Interactive Pollution Map", text: "Station-by-station air quality across the country on one map." },
            { icon: Brain, title: "ML-Powered Forecasts", text: "7-day AQI outlook plus an extended AI-predicted outlook generated from trend modelling." },
            { icon: Layers, title: "Pollution Heatmaps", text: "Toggle a heatmap layer on the map to see pollution intensity zones at a glance." },
            { icon: School, title: "School & Hospital Indicators", text: "Sensitive-site markers flag air quality risk near schools and hospitals." },
            { icon: Search, title: "AI Location Search", text: "Search any area and get an AI-predicted AQI, cross-checked against nearby stations." },
            { icon: Bell, title: "Custom Tagged Alerts", text: "Save and tag any place — Home, Gym, School — and get notified when it turns unhealthy." },
            { icon: Languages, title: "English / Urdu", text: "Switch the entire interface language from Settings." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-full">
                <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                  <f.icon className="text-cyan-400" size={18} />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.text}</p>
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
        <p className="text-slate-400 text-sm mb-10">Understanding the Air Quality Index, the pollutants behind it, and the seasonal patterns behind South Asia's air quality swings.</p>
      </Reveal>

      <Reveal><h2 className="text-xs font-bold tracking-widest text-slate-400 mb-4">AQI CATEGORIES</h2></Reveal>
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
        <h2 className="text-xs font-bold tracking-widest text-slate-400 mb-1">SEASONAL INSIGHTS — SOUTH ASIA</h2>
        <p className="text-xs text-slate-500 mb-4">These seasonal patterns are specific to Pakistan and the wider South Asian region — other regions have their own seasonal pollution drivers (e.g. wildfire smoke, Saharan dust, or winter heating season).</p>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {SEASONAL_INSIGHTS.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 h-full">
              <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                <s.icon className="text-cyan-400" size={18} />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{s.title}</h3>
                <span className="text-[11px] text-cyan-400 font-semibold">{s.months}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal><h2 className="text-xs font-bold tracking-widest text-slate-400 mb-4">POLLUTANTS EXPLAINED</h2></Reveal>
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
  const trackW = 60, trackH = 32, knob = 32;
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative rounded-full transition-all duration-300 flex-shrink-0"
      style={{
        width: trackW,
        height: trackH,
        background: checked ? "linear-gradient(135deg,#34d399,#10b981)" : "linear-gradient(135deg,#f87171,#ef4444)",
        boxShadow: checked ? "0 3px 12px rgba(16,185,129,0.45), inset 0 1px 2px rgba(255,255,255,0.2)" : "0 3px 12px rgba(239,68,68,0.45), inset 0 1px 2px rgba(255,255,255,0.2)",
      }}
    >
      <span
        className="absolute rounded-full bg-white transition-transform duration-300"
        style={{
          top: 0,
          left: 0,
          width: knob,
          height: knob,
          boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
          transform: `translateX(${checked ? trackW - knob : 0}px)`,
        }}
      />
    </button>
  );
}

function SettingsPage({ live }) {
  const { mode, toggle } = useTheme();
  const { lang, setLang } = useLanguage();
  const t = useT();
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
        <div className="flex items-center gap-2 mb-2"><SettingsIcon className="text-cyan-400" size={20}/><h1 className="text-2xl font-bold">{t("settings_title")}</h1></div>
        <p className="text-slate-400 text-sm mb-10">{t("settings_sub")}</p>
      </Reveal>

      <Reveal>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4">{t("settings_appearance")}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{t("settings_dark")}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t("settings_dark_sub")}</p>
            </div>
            <Toggle checked={mode === "dark"} onChange={toggle} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4 flex items-center gap-1.5"><Languages size={12}/> {t("settings_language")}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{t("settings_language_label")}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t("settings_language_sub")}</p>
            </div>
            <Toggle checked={lang === "ur"} onChange={(v) => setLang(v ? "ur" : "en")} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4">{t("settings_notifications")}</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">{t("settings_push")}</p>
              <Toggle checked={notifs.push} onChange={(v) => setNotifs((n) => ({ ...n, push: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">{t("settings_email")}</p>
              <Toggle checked={notifs.email} onChange={(v) => setNotifs((n) => ({ ...n, email: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">{t("settings_weekly")}</p>
              <Toggle checked={notifs.weekly} onChange={(v) => setNotifs((n) => ({ ...n, weekly: v }))} />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={180}>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4">{t("settings_units")}</p>
          <div className="flex items-center gap-2">
            {["metric", "imperial"].map((u) => (
              <button key={u} onClick={() => setUnits(u)} className={`text-sm px-4 py-2 rounded-full border transition ${units === u ? "bg-cyan-400 text-slate-900 border-cyan-400 font-semibold" : "border-white/10 text-slate-300"}`}>
                {u === "metric" ? "µg/m³, °C" : "µg/m³, °F"}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={240}>
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-4">{t("settings_data")}</p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold">{t("settings_autorefresh")}</p>
              <p className="text-xs text-slate-500 mt-0.5">{live.updatedAt ? `Last updated ${live.updatedAt.toLocaleTimeString()}` : "Fetching live data…"}</p>
            </div>
            <button onClick={handleRefresh} className="flex items-center gap-2 text-sm font-semibold bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full hover:bg-cyan-400/20 transition">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> {t("settings_refresh")}
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
  const [lang, setLang] = useState("en");
  const [homeCity, setHomeCity] = useState("Lahore");
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const live = useLiveAirQuality(homeCity);
  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page]);

  const dark = mode === "dark";
  const rootClasses = dark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <LanguageContext.Provider value={{ lang, setLang }}>
        <GlobalStyles />
        <div className={`min-h-screen font-sans transition-colors duration-500 ${rootClasses} ${dark ? "" : "light-theme"}`}>
          <NavBar page={page} setPage={setPage} live={live} homeCity={homeCity} setHomeCity={setHomeCity} />
          {live.error && (
            <div className="max-w-6xl mx-auto px-6 pt-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm rounded-xl px-4 py-3">{live.error}</div>
            </div>
          )}
          <PageTransition pageKey={page}>
            {page === "dashboard" && <DashboardPage setPage={setPage} live={live} homeCity={homeCity} setHomeCity={setHomeCity} />}
            {page === "map" && <MapPage live={live} places={places} setPlaces={setPlaces} />}
            {page === "trends" && <TrendsPage live={live} />}
            {page === "alerts" && <AlertsPage live={live} places={places} setPlaces={setPlaces} />}
            {page === "about" && <AboutPage />}
            {page === "guide" && <GuidePage />}
            {page === "help" && <HelpPage />}
            {page === "settings" && <SettingsPage live={live} />}
          </PageTransition>
          <Footer setPage={setPage} />
        </div>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}
