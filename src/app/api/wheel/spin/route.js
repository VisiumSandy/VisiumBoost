import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { rewards, code } = await request.json();

    if (!rewards || !Array.isArray(rewards) || rewards.length === 0) {
      return NextResponse.json(
        { success: false, error: "Récompenses manquantes" },
        { status: 400 }
      );
    }

    // Verify total probability = 100
    const totalProb = rewards.reduce((sum, r) => sum + (r.prob || 0), 0);
    if (Math.abs(totalProb - 100) > 0.1) {
      return NextResponse.json(
        { success: false, error: "Les probabilités doivent totaliser 100%" },
        { status: 400 }
      );
    }

    // ─── In production: validate code first ─────────────
    // if (code) {
    //   const { data } = await supabase
    //     .from('codes')
    //     .select('*')
    //     .eq('code', code)
    //     .eq('used', false)
    //     .single();
    //
    //   if (!data) {
    //     return NextResponse.json(
    //       { success: false, error: "Code invalide ou déjà utilisé" },
    //       { status: 400 }
    //     );
    //   }
    //
    //   // Mark code as used
    //   await supabase
    //     .from('codes')
    //     .update({ used: true, used_at: new Date().toISOString() })
    //     .eq('id', data.id);
    // }

    // Weighted random selection (server-side = tamper-proof)
    const rand = Math.random() * 100;
    let acc = 0;
    let winnerIndex = 0;

    for (let i = 0; i < rewards.length; i++) {
      acc += rewards[i].prob;
      if (rand <= acc) {
        winnerIndex = i;
        break;
      }
    }

    const winner = rewards[winnerIndex];

    // ─── In production: log the win ─────────────────────
    // await supabase.from('spins').insert({
    //   reward_name: winner.name,
    //   reward_index: winnerIndex,
    //   code: code || null,
    //   created_at: new Date().toISOString(),
    // });

    return NextResponse.json({
      success: true,
      winner: {
        index: winnerIndex,
        name: winner.name,
        prob: winner.prob,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
