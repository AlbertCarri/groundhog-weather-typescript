"use server";

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

export async function getWeather(
  lat: number,
  lon: number
): Promise<{
  data: WeatherD | null;
  forecast: ForecastD | null;
  error?: string;
}> {
  const apiKey = process.env.API_KEY;
  if (!apiKey)
    return { data: null, forecast: null, error: "API key no encontrada" };

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
      ),
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error(
        `Error en la API: ${weatherRes.statusText} / ${forecastRes.statusText}`
      );
    }

    const [data, forecast]: [WeatherD, ForecastD] = await Promise.all([
      weatherRes.json(),
      forecastRes.json(),
    ]);

    return { data, forecast };
  } catch (error) {
    console.error("Error obteniendo datos del clima:", error);
    return { data: null, forecast: null, error: (error as Error).message };
  }
}
