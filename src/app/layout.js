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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
