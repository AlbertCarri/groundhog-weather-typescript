export default function Footer() {
  return (
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
  );
}
