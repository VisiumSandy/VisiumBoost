import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Mot de passe trop court (min. 6 caractères)" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Lien invalide ou expiré. Veuillez faire une nouvelle demande." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.updateOne(
      { _id: user._id },
      { password: hashed, resetToken: null, resetTokenExpiry: null }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
