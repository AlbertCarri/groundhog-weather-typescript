import "./globals.css";

export const metadata = {
  title: "Groundhog Weather",
  description: "App del clima de todo el mundo",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta property="og:title" content="Groundhog Weather" />
        <meta
          property="og:description"
          content="App del clima de todo el mundo"
        />
        <meta
          property="og:image"
          content="https://groundhog-weather.vercel.app/web.jpg"
        />
        <meta property="og:type" content="website" />
      </head>
      <body>{children}</body>
    </html>
  );
}
