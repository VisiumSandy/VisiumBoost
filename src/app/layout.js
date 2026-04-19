import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL("https://visium-boost.fr"),
  title: {
    default: "VisiumBoost : obtenez plus d'avis Google avec la gamification",
    template: "%s | VisiumBoost",
  },
  description:
    "VisiumBoost est un outil de gamification des avis Google pour les commerçants locaux. Roue de la fortune, codes anti-fraude, setup en 5 minutes. Essai gratuit 14 jours.",
  keywords: [
    "avis Google", "gamification avis", "roue de la fortune avis Google",
    "augmenter avis Google restaurant", "outil avis clients",
    "booster avis Google", "QR code avis Google",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon.ico",
    apple: "/images/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://visium-boost.fr",
    title: "VisiumBoost : obtenez plus d'avis Google avec la gamification",
    description:
      "Roue de la fortune, codes anti-fraude, dashboard analytics. L'outil de gamification des avis Google pensé pour les commerces locaux.",
    siteName: "VisiumBoost",
    locale: "fr_FR",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VisiumBoost, outil de gamification des avis Google",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisiumBoost : plus d'avis Google grâce à la gamification",
    description:
      "Roue de la fortune, codes anti-fraude, setup en 5 minutes. Essai gratuit 14 jours.",
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
