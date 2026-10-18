import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sora = localFont({
  src: "../../node_modules/@fontsource-variable/sora/files/sora-latin-wght-normal.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-sora",
});

const workSans = localFont({
  src: "../../node_modules/@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "SENIALON · Radar de contenidos",
  description:
    "Un espacio editorial para revisar publicaciones de IA, temas y evidencia.",
  robots: { index: false, follow: false },
};

// Private workspace pages must render at request time, including the base shell.
export const dynamic = "force-dynamic";

const direction = `<!--
THESIS: Una mesa editorial centrada en la ejecución y sus fuentes; sin resultados supuestos.
OWN-WORLD: DESIGN.md: grafito, naranja contenido, Sora en títulos y Work Sans en lectura; logos Fluido originales.
STORY: El operador comprende el corpus y el recorrido, y reconoce que la recolección aún no está habilitada.
FIRST VIEWPORT: Navegación lateral de 224 px, cabecera de contexto, título de ejecuciones y estado inicial; corpus consultable debajo.
FORM: Implementación acotada del diseño ya confirmado. Clave senialon-fe-1-2; sin selección de identidad nueva.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${sora.variable} ${workSans.variable}`}>
      <body>
        <template
          id="senialon-fe-1-2"
          dangerouslySetInnerHTML={{ __html: direction }}
        />
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
