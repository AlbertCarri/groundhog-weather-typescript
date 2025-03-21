"use cliente";

import { useEffect, useState, JSX } from "react";
import { getWeather } from "@/utils/getWeather";

interface Props {
  coord: number[];
}

interface WeatherD {
  name: string;
  dt: number;
  timezone: number;
  sys: { country: string; sunrise: number; sunset: number };
  weather: [{ icon: string }];
  main: { temp: number; pressure: number; humidity: number };
  visibility: number;
  wind: { speed: number; deg: number };
  rain?: string;
  snow?: string;
}

interface ForecastD {
  list: [
    {
      dt: number;
      main: { temp_max: number; temp_min: number; humidity: number };
      weather: [{ icon: string }];
      wind: { speed: number; deg: number };
    }
  ];
}

interface Country {
  iso2: string;
  nameES: string;
}

const GMT_minus_3: number = 10800;

// Grados a Puntos cardinales
const WindDirection = (x: number) => {
  if ((x >= 0 && x <= 19) || (x >= 250 && x <= 360)) return "Norte";
  if (x >= 20 && x <= 39) return "Norte/Nordeste";
  if (x >= 40 && x <= 59) return "Nordeste";
  if (x >= 60 && x <= 79) return "Este/Nordeste";
  if (x >= 80 && x <= 109) return "Este";
  if (x >= 110 && x <= 129) return "Este/Sudeste";
  if (x >= 130 && x <= 149) return "Sudeste";
  if (x >= 150 && x <= 169) return "Sur/Sudeste";
  if (x >= 170 && x <= 199) return "Sur";
  if (x >= 200 && x <= 219) return "Sur/Sudoeste";
  if (x >= 220 && x <= 239) return "Sudoeste";
  if (x >= 240 && x <= 259) return "Oeste/Sudoeste";
  if (x >= 260 && x <= 289) return "Oeste";
  if (x >= 290 && x <= 309) return "Oeste/Noreste";
  if (x >= 310 && x <= 329) return "Noreste";
  if (x >= 330 && x <= 349) return "Norte/Noreste";
  return;
};

//Tiempo en formato unix a hora y fecha standard
const unixToTime = (unix: number, timezone: number): string => {
  const time = new Date((unix + GMT_minus_3 + timezone) * 1000);
  return time.toLocaleString("en-GB");
};

//Nombre del día en español
const dayName = (unix: number, timezone: number): string => {
  const fecha = new Date((unix + timezone) * 1000); // Convertimos de segundos a milisegundos
  const opciones: Intl.DateTimeFormatOptions = { weekday: "long" }; // Configuración para obtener solo el día
  return fecha.toLocaleDateString("es-ES", opciones).toUpperCase(); // Formato en español
};

export default function RenderWeather({ coord }: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<WeatherD | null>(null);
  const [forecast, setForecast] = useState<ForecastD | null>(null);
  const [timeHere, setTimeHere] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    async function weather() {
      const { data, forecast } = await getWeather(coord[0], coord[1]);
      const time = data
        ? new Date((data.dt + GMT_minus_3 + data.timezone) * 1000)
        : null;

      setTimeHere(time ? time.toLocaleString("es").replace(",", "") : "");
      setWeatherData(data);
      setForecast(forecast);
      fetch("/countries.json")
        .then((resp) => resp.json())
        .then((dataW) => {
          const iso3166: Country[] = dataW;
          const countryCode: string = data ? data.sys.country : "";
          const country = iso3166.find((c) => c.iso2 === countryCode);
          setCountry(country ? country.nameES : "Código no encontrado");
        })
        .catch((error) => console.error("error:", error));
      setLoading(false);
    }
    weather();
  }, [coord]);

  /* Waiting data from apis 
     weatherData is the weather now
     forecast is the weather next 7 days
     */
  if (loading)
    return (
      <p className="text-center">
        <svg
          className="animate-spin w-32 h-32 mx-auto"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g strokeWidth="0"></g>
          <g strokeLinecap="round" strokeLinejoin="round"></g>
          <g>
            <path
              d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
              fill="#154680"
            ></path>
          </g>
        </svg>
        Loading...........
      </p>
    );

  return (
    <div className="flex lg:flex-row flex-col lg:mx-auto mx-auto lg:p-8 p-1 mt-8">
      {/* The weather now */}
      {weatherData && (
        <div className="flex-col md:w-[600px] md:h-[600px] w-[320px] h-[300px] mx-auto justify-center rounded-xl">
          <div className=" bg-slate-800 py-4 px-4 text-center">
            <p className="lg:text-xl text-md mb-2 uppercase">
              {weatherData?.name}, {country}
            </p>
            <p className="lg:text-2xl text-lg">
              Hora: {timeHere.substring(10, 20)}
              <span className="lg:ml-8 ml-8">
                {" "}
                {weatherData ? dayName(weatherData.dt, 0) : "undefined"}{" "}
                {timeHere.substring(0, 10)}
              </span>
            </p>
          </div>
          <div className="relative">
            <img
              className="absolute w-full "
              src={`/Groundhog/${weatherData?.weather[0].icon}.jpg`}
              alt="icono"
            />
            <img
              className="absolute w-16 h-16 sm:mt-2 mt-0 lg:ml-4 ml-2"
              src={`/Iconos Clima/${weatherData.weather[0].icon}.png`}
              alt="icono"
            />
            <p className="absolute md:text-4xl text-2xl md:mt-4 mt-12 md:ml-24 ml-8 drop-shadow">
              {((weatherData ? weatherData.main.temp : 0) - 273.15).toFixed(1)}
              ºC
            </p>
            <p className="absolute md:text-xl text-sm md:mt-16 mt-20 ml-4 drop-shadow">
              Presión: {weatherData.main.pressure.toFixed(1)}mb
            </p>
            <p className="absolute md:text-xl text-sm md:mt-24 mt-24 ml-4 drop-shadow">
              Humedad: {weatherData?.main.humidity.toFixed(1)}%
            </p>
            <p className="absolute md:text-xl text-sm md:mt-32 mt-28 ml-4 drop-shadow">
              Visibilidad: {weatherData.visibility / 1000}Km
            </p>
            <p className="absolute md:text-xl text-sm md:mt-40 mt-32 ml-4 drop-shadow">
              Viento: {Math.floor(weatherData.wind.speed * 3.6)}Km/h
            </p>
            <p className="absolute md:text-xl text-sm md:mt-48 mt-36 ml-4 drop-shadow">
              Dirección: {WindDirection(weatherData.wind.deg)}
            </p>
            <div className="absolute right-4 top-2 drop-shadow">
              <p className="md:text-xl text-sm md:mt-2 mt-0">
                Amanece:{" "}
                {unixToTime(
                  weatherData.sys.sunrise,
                  weatherData.timezone
                ).substring(11, 20)}
                Hs
              </p>
              <p className="md:text-xl text-sm md:mt-2 mt-0">
                Atardece:{" "}
                {unixToTime(
                  weatherData.sys.sunset,
                  weatherData.timezone
                ).substring(11, 20)}
                Hs
              </p>
              <p className="md:text-2xl text-sm">
                {weatherData.rain
                  ? "Lluvias : " +
                    Object.keys(weatherData.rain) +
                    ":" +
                    Object.values(weatherData.rain) +
                    "mm/h"
                  : ""}
              </p>
              <p className="md:text-2xl text-sm">
                {weatherData.snow
                  ? "Nevadas : " +
                    Object.keys(weatherData.snow) +
                    ":" +
                    Object.values(weatherData.snow) +
                    "mm/h"
                  : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pronóstico extendido 4 días */}
      {forecast && weatherData && (
        <div className="lg:w-1/2 w-full lg:ml-16 flex-col lg:max-h-[680px] max-h-[320px] p-4 lg:mt-0 md:mt-28 mt-44 bg-slate-600 bg-opacity-60 rounded-lg overflow-scroll scroll-smooth snap-y scrollbar-hide">
          {forecast.list.map((forecastData, index: number) => (
            <div
              key={index}
              className="flex flex-row h-24 snap-start items-center border-b-2 border-gray-800"
            >
              <div className="w-36 text-center">
                <p className="text-sm">
                  {dayName(weatherData.dt, 0) ===
                  dayName(forecastData.dt, weatherData.timezone + 10800)
                    ? "HOY"
                    : dayName(forecastData.dt, weatherData.timezone + 10800)}
                </p>
                <p className="lg:text-sm text-sm ">
                  {unixToTime(forecastData.dt, weatherData.timezone).substring(
                    11,
                    20
                  )}
                </p>
              </div>
              <div className="lg:-mt-2 mt-0">
                <img
                  className="min-w-8 min-h-8 -ml-2"
                  src={`/Iconos Clima/${forecastData.weather[0].icon}.png`}
                  alt="iconweather"
                />
                <p className="lg:hidden text-md ml-2">
                  {(forecastData.main.temp_max - 273.15).toFixed(1)}ºC
                </p>
              </div>
              <div>
                <p className="hidden lg:block text-md ml-6 ">
                  {(forecastData.main.temp_min - 273.15).toFixed(1)}ºC
                </p>
              </div>
              <div>
                <p className="lg:text-sm text-sm lg:ml-4 ml-2">
                  Humedad: {forecastData.main.humidity}%
                </p>
              </div>
              <div>
                <p className="lg:text-sm text-sm ml-4">
                  Vientos: {forecastData.wind.speed}km/h
                </p>
                <p className="lg:hidden sm:text-lg text-sm ml-1">
                  {WindDirection(forecastData.wind.deg)}
                </p>
              </div>
              <div>
                <p className="hidden lg:block lg:text-sm text-sm ml-1">
                  {" "}
                  del {WindDirection(forecastData.wind.deg)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
