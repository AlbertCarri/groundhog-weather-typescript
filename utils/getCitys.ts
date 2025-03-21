"use server";

interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export async function getCitys(city: string): Promise<City[]> {
  const apiKey = process.env.API_KEY;
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=15&appid=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error(
        `Error en la API: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data: City[] = await response.json();

    console.log("Datos recibidos------->", "city", city, "DATA:::::", data);
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return [];
  }
}
