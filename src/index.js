const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusline = document.getElementById("statusline");
const emptyState = document.getElementById("emptyState");
const main = document.getElementById("main");

const WMO = {
  0: { label: "clear sky", icon: "clear" },
  1: { label: "mainly clear", icon: "partly" },
  2: { label: "partly cloudy", icon: "partly" },
  3: { label: "overcast clouds", icon: "cloudy" },
  45: { label: "fog", icon: "fog" },
  48: { label: "depositing rime fog", icon: "fog" },
  51: { label: "light drizzle", icon: "drizzle" },
  53: { label: "moderate drizzle", icon: "drizzle" },
  55: { label: "dense drizzle", icon: "drizzle" },
  56: { label: "freezing drizzle", icon: "drizzle" },
  57: { label: "freezing drizzle", icon: "drizzle" },
  61: { label: "slight rain", icon: "rain" },
  63: { label: "moderate rain", icon: "rain" },
  65: { label: "heavy rain", icon: "rain" },
  66: { label: "freezing rain", icon: "rain" },
  67: { label: "freezing rain", icon: "rain" },
  71: { label: "slight snow fall", icon: "snow" },
  73: { label: "moderate snow fall", icon: "snow" },
  75: { label: "heavy snow fall", icon: "snow" },
  77: { label: "snow grains", icon: "snow" },
  80: { label: "slight rain showers", icon: "showers" },
  81: { label: "moderate rain showers", icon: "showers" },
  82: { label: "violent rain showers", icon: "showers" },
  85: { label: "slight snow showers", icon: "snow" },
  86: { label: "heavy snow showers", icon: "snow" },
  95: { label: "thunderstorm", icon: "thunder" },
  96: { label: "thunderstorm, hail", icon: "thunder" },
  99: { label: "thunderstorm, hail", icon: "thunder" },
};
function wxInfo(code) {
  return WMO[code] || { label: "unknown", icon: "cloudy" };
}

function iconSVG(kind, size = 64) {
  const sun = "#f5a623",
    sunCore = "#fbbf3e",
    cloudFill = "#dcdaee",
    cloudStroke = "#a9a5cf",
    cloudShadow = "#c3c0e2",
    sky = "#bfe0fb",
    rain = "#4fa3e0",
    snow = "#8fb9e0",
    bolt = "#f5a623";
  const wrap = (inner) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const cloudBack = `<ellipse cx="29" cy="32" rx="16" ry="12" fill="${cloudShadow}"/>`;
  const cloudFront = `<path d="M20 54c-7.5 0-13.5-6-13.5-13.5S12.5 27 20 27c1-7.5 7.5-13 16-13 8.5 0 15.5 6 16.5 14 6.5.5 11.5 6 11.5 12.5S57.5 54 51 54H20z" fill="${cloudFill}" stroke="${cloudStroke}" stroke-width="1.6"/>`;
  switch (kind) {
    case "clear":
      return wrap(`<circle cx="40" cy="40" r="17" fill="${sunCore}" stroke="${sun}" stroke-width="1"/>
        ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
          .map((a) => {
            const rad = (a * Math.PI) / 180,
              r1 = 21,
              r2 = 29;
            const x1 = 40 + r1 * Math.cos(rad),
              y1 = 40 + r1 * Math.sin(rad);
            const x2 = 40 + r2 * Math.cos(rad),
              y2 = 40 + r2 * Math.sin(rad);
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${sun}" stroke-width="3.4" stroke-linecap="round"/>`;
          })
          .join("")}`);
    case "partly":
      return wrap(`<circle cx="52" cy="24" r="14" fill="${sunCore}" stroke="${sun}" stroke-width="1"/>
        <g transform="translate(-6,8)">${cloudBack}${cloudFront}</g>`);
    case "cloudy":
      return wrap(`<circle cx="52" cy="22" r="10" fill="${sky}"/>
        <g transform="translate(0,8)">${cloudBack}${cloudFront}</g>`);
    case "fog":
      return wrap(`<g transform="translate(0,0)">${cloudFront}</g>
        ${[58, 66, 72].map((y, i) => `<line x1="12" y1="${y}" x2="68" y2="${y}" stroke="${cloudStroke}" stroke-width="3.4" stroke-linecap="round" opacity="${i === 1 ? 0.95 : 0.6}"/>`).join("")}`);
    case "drizzle":
      return wrap(`<g transform="translate(0,4)">${cloudBack}${cloudFront}</g>
        ${[26, 40, 54].map((x) => `<line x1="${x}" y1="58" x2="${x - 4}" y2="67" stroke="${rain}" stroke-width="3.4" stroke-linecap="round"/>`).join("")}`);
    case "rain":
      return wrap(`<g transform="translate(0,2)">${cloudBack}${cloudFront}</g>
        ${[22, 34, 46, 58].map((x, i) => `<line x1="${x}" y1="58" x2="${x - 5}" y2="71" stroke="${rain}" stroke-width="3.8" stroke-linecap="round" opacity="${i % 2 ? 0.75 : 1}"/>`).join("")}`);
    case "showers":
      return wrap(`<circle cx="54" cy="22" r="12" fill="${sunCore}" stroke="${sun}" stroke-width="1"/>
        <g transform="translate(-6,6)">${cloudBack}${cloudFront}</g>
        ${[24, 36, 48].map((x, i) => `<line x1="${x}" y1="59" x2="${x - 5}" y2="70" stroke="${rain}" stroke-width="3.8" stroke-linecap="round" opacity="${i === 1 ? 0.75 : 1}"/>`).join("")}`);
    case "snow":
      return wrap(`<g transform="translate(0,2)">${cloudBack}${cloudFront}</g>
        ${[26, 40, 54].map((x) => `<g stroke="${snow}" stroke-width="3" stroke-linecap="round"><line x1="${x}" y1="59" x2="${x}" y2="71"/><line x1="${x - 6}" y1="65" x2="${x + 6}" y2="65"/><line x1="${x - 4.5}" y1="60.5" x2="${x + 4.5}" y2="69.5"/><line x1="${x - 4.5}" y1="69.5" x2="${x + 4.5}" y2="60.5"/></g>`).join("")}`);
    case "thunder":
      return wrap(`<g transform="translate(0,2)">${cloudBack}${cloudFront}</g>
        <path d="M44 56l-11 16h8l-5 14 14-18h-8l7-12z" fill="${bolt}"/>`);
    default:
      return wrap(
        `<g transform="translate(0,8)">${cloudBack}${cloudFront}</g>`,
      );
  }
}

function setStatus(msg) {
  statusline.textContent = msg || "";
}

async function geocode(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = await res.json();
  if (!data.results || data.results.length === 0)
    throw new Error("City not found");
  return data.results[0];
}

async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=6`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Forecast request failed");
  return res.json();
}

function dayLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}

async function runSearch(city) {
  if (!city || !city.trim()) {
    setStatus("Type a city name to search.");
    return;
  }
  searchBtn.disabled = true;
  setStatus("Searching…");
  try {
    const place = await geocode(city.trim());
    const wx = await fetchWeather(place.latitude, place.longitude);
    renderResult(place, wx);
    setStatus("");
  } catch (err) {
    setStatus(
      err.message === "City not found"
        ? `No results for "${city}". Try a different spelling.`
        : "Could not reach the weather service. Please try again.",
    );
  } finally {
    searchBtn.disabled = false;
  }
}

function renderResult(place, wx) {
  emptyState.style.display = "none";
  main.classList.add("ready");

  const cur = wx.current;
  const info = wxInfo(cur.weather_code);
  const now = new Date();
  const weekday = now.toLocaleDateString("en-GB", { weekday: "long" });
  const hh = now.getHours();
  const mm = String(now.getMinutes()).padStart(2, "0");

  document.getElementById("cityName").textContent = place.name;
  document.getElementById("subline1").textContent =
    `${weekday} ${hh}:${mm}, ${info.label}`;
  document.getElementById("subline2").innerHTML =
    `Humidity: <b>${Math.round(cur.relative_humidity_2m)}%</b>, Wind: <b>${Math.round(cur.wind_speed_10m * 100) / 100}km/h</b>`;

  document.getElementById("mainIcon").innerHTML = iconSVG(info.icon, 76);
  document.getElementById("tempNum").innerHTML =
    `${Math.round(cur.temperature_2m)}<sup>°C</sup>`;

  const strip = document.getElementById("forecastStrip");
  strip.innerHTML = "";
  const days = wx.daily.time.slice(0, 5);
  days.forEach((dt, i) => {
    const code = wx.daily.weather_code[i];
    const hi = Math.round(wx.daily.temperature_2m_max[i]);
    const lo = Math.round(wx.daily.temperature_2m_min[i]);
    const dinfo = wxInfo(code);
    const el = document.createElement("div");
    el.className = "fday";
    el.innerHTML = `
      <div class="dname">${dayLabel(dt)}</div>
      <div class="icon">${iconSVG(dinfo.icon, 56)}</div>
      <div class="temps"><span class="hi">${hi}°</span><span class="lo">${lo}°</span></div>
    `;
    strip.appendChild(el);
  });
}

searchBtn.addEventListener("click", () => runSearch(cityInput.value));
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch(cityInput.value);
});

// Load a default city on first paint
cityInput.value = "Paris";
runSearch("Paris");
