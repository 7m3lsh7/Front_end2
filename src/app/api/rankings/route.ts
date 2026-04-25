import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export interface StudentRanking {
  rank: number;
  studentId: string;
  name: string;
  className: string;
  average: number;
  totalGrades: number;
  trend: "up" | "down" | "stable";
  badge?: "gold" | "silver" | "bronze";
}

function buildMockRankings(classId?: string, year?: string): StudentRanking[] {
  const names = [
    "Ahmed Al-Rashidi", "Fatima Al-Zahra", "Omar Hassan",
    "Nora Al-Salem", "Khalid Ibrahim", "Sara Mahmoud",
    "Yousef Al-Amin", "Mariam Khalil", "Ali Al-Farsi", "Hind Al-Nasser",
  ];

  return names.map((name, i) => ({
    rank: i + 1,
    studentId: `STU-${1000 + i}`,
    name,
    className: classId ?? `Class 10-${String.fromCharCode(65 + (i % 3))}`,
    average: Math.round(95 - i * 2.8 + Math.random() * 2),
    totalGrades: Math.floor(20 + Math.random() * 10),
    trend: (["up", "stable", "down", "up", "up", "stable", "down", "up", "stable", "up"] as const)[i],
    badge: i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : undefined,
  }));
}

// ─── GET /api/rankings?year=&classId=&limit= ──────────────────────────────────
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const year    = searchParams.get("year")    ?? "2024-2025";
  const classId = searchParams.get("classId") ?? undefined;
  const limit   = parseInt(searchParams.get("limit") ?? "10");

  const API = process.env.NEXT_PUBLIC_API_URL ?? "https://evaschool.runasp.net/api";

  try {
    const params = new URLSearchParams({ year, limit: String(limit) });
    if (classId) params.set("classId", classId);

    const upstream = await fetch(`${API}/rankings?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (upstream.ok) {
      const data = await upstream.json();
      return NextResponse.json(data);
    }
  } catch {
    // fall through
  }

  const rankings = buildMockRankings(classId, year).slice(0, limit);
  return NextResponse.json({ rankings, total: rankings.length, year, classId: classId ?? "all" });
}
