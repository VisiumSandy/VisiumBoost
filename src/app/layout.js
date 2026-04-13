import "@/styles/globals.css";

export const metadata = {
  title: "zReview — Boostez vos avis Google",
  description:
    "La roue de la fortune gamifiée qui transforme vos clients en ambassadeurs Google. Configurez en 5 minutes, récoltez des avis à vie.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Calistoga:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
