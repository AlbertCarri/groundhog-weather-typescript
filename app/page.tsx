import { getWeather } from "@/utils/getWeather";
import SearchCity from "@/components/searchCity";
import { JSX } from "react";
import Footer from "@/components/Footer";

export default function Home():JSX.Element {

  const lat: number = -34.21
  const lon: number = -58.93

  getWeather( lat, lon )

  return (
    <div>
      <SearchCity/>
      <Footer/>
    </div>
  );
}

