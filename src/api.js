// src/services/api.js

const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN;

export async function getAirQuality(lat, lon) {
  const response = await fetch(
    `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_TOKEN}`
  );

  return response.json();
}

export async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?...`
  );

  return response.json();
}