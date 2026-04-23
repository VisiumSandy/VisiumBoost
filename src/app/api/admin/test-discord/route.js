import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { discordLog, Colors } from "@/lib/discord";

// GET /api/admin/test-discord — admin only, sends a test message to Discord
export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({
      ok: false,
      error: "DISCORD_WEBHOOK_URL n'est pas défini dans les variables d'environnement",
    }, { status: 500 });
  }

  await discordLog({
    title: "Test webhook Discord",
    color: Colors.green,
    description: "Si tu vois ce message, le webhook fonctionne correctement !",
    fields: [
      { name: "Déclenché par", value: user.email, inline: true },
      { name: "Environnement", value: process.env.NODE_ENV || "unknown", inline: true },
    ],
  });

  return NextResponse.json({
    ok: true,
    message: "Message envoyé — vérifie ton salon Discord",
    webhookConfigured: true,
  });
}
