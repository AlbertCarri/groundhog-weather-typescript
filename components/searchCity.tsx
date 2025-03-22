"use client";

import { getCitys } from "@/utils/getCitys";
import { useState } from "react";
import RenderWeather from "./renderWeather";
import { countries, CountryCode } from "@/utils/countries";

interface CityRes {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export default function SearchCity() {
  const [coord, setCoord] = useState<number[]>([-34.21, -58.93]);
  const [city, setCity] = useState<string>("");
  const [citys, setCitys] = useState<CityRes[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const searchLatLon = (lat: number, lon: number) => {
    setCoord([lat, lon]);
    setCity("");
    setModal(false);
  };

  const modalCity = async () => {
    const response = await getCitys(city);
    setCitys(response);
    setModal(true);
  };

  return (
    <div>
      <nav className="w-full flex justify-center mt-4 px-8">
        <input
          className="w-48 p-4 text-xl text-gray-100 border-1 border-zinc-100 rounded-lg shadow-inner"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Entre la ciudad"
          onKeyDown={(e) => {
            if (e.key === "Enter") modalCity();
          }}
        />
        <button className="btn-buscar p-4 ml-4" onClick={modalCity}>
          BUSCAR
        </button>
      </nav>
      {modal && (
        <div
          className="modal w-full flex lg:justify-center z-10"
          onClick={() => setModal(false)}
        >
          <div className="modal-container flex flex-col lg:p-12 lg:w-2/5 z-20 my-auto mx-auto">
            {[...Array(citys.length).keys()].map((i) => (
              <button
                className="btn-city lg:p-4 py-4 mx-auto lg:mb-4 mb-2 lg:w-[400px] w-[360px]"
                key={i}
                type="button"
                onClick={() => searchLatLon(citys[i].lat, citys[i].lon)}
              >
                {citys[i].name} ,{" "}
                {citys[i].country in countries
                  ? countries[citys[i].country as keyof typeof countries]
                  : "País desconocido"}
                {citys[i].state ? " , " : " "}
                {citys[i].state}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <RenderWeather coord={coord} />
      </div>
      <footer className="w-full m-0 p-4 mt-8 bg-neutral-950">
        <div>
          <div className="flex flex-row text-center md:text-xl text-xs">
            <div className="basis-1/3">
              <b>Desarrollador:</b>
              <p>Alberto Carrizo</p>
            </div>
            <div className="basis-1/3">
              <b>Desarrollado en:</b>
              <p>TypeScript - NEXT.js</p>
              <p>& Tailwind</p>
            </div>
            <div className="basis-1/3 flex flex-col md:justify-around">
              <a
                href="https://www.linkedin.com/in/alberto-edelmiro-carrizo-7639a186/"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                <img
                  src="/linkedin.png"
                  alt="logo"
                  width={32}
                  height={32}
                  className="mx-auto object-scale-down mb-2"
                />
              </a>
              <a
                href="https://github.com/AlbertCarri"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                <img
                  src="/github.png"
                  alt="logo"
                  width={32}
                  height={32}
                  className="mx-auto object-scale-down"
                />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>
              Powered by{" "}
              <a
                href="https://openweathermap.org/"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                OpenWeatherMap
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
