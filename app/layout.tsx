import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sol De Tangay Field Vip",
  description:
    "Field privado en Chimbote para tus momentos importantes: pedidas, picnics, cumpleaños, aniversarios, reuniones familiares y eventos. Un solo evento por día. Coordinador dedicado. A 30 minutos del centro."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#11170d"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
