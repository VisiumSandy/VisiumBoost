import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL("https://visium-boost.fr"),
  title: "VisiumBoost — Boostez vos avis Google",
  description:
    "La roue de la fortune gamifiée qui transforme vos clients en ambassadeurs Google. Configurez en 5 minutes, récoltez des avis à vie.",
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon.ico",
    apple: "/images/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://visium-boost.fr",
    title: "VisiumBoost — Boostez vos avis Google",
    description:
      "La roue de la fortune gamifiée qui transforme vos clients en ambassadeurs Google. Configurez en 5 minutes, récoltez des avis à vie.",
    siteName: "VisiumBoost",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VisiumBoost — Boostez vos avis Google",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisiumBoost — Boostez vos avis Google",
    description:
      "La roue de la fortune gamifiée qui transforme vos clients en ambassadeurs Google. Configurez en 5 minutes, récoltez des avis à vie.",
    images: ["/images/og-image.png"],
    site: "@visiumboost",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Special+Gothic+Expanded+One&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@400;500&family=Calistoga&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
