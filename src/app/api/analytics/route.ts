import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SubjectStat {
  subject: string;
  average: number;
  highest: number;
  lowest: number;
  passRate: number;
  color: string;
}

interface AnalyticsOverview {
  totalStudents: number;
  averageGrade: number;
  passRate: number;
  topPerformers: number;
  subjectStats: SubjectStat[];
  classRankings: {
    rank: number;
    className: string;
    average: number;
    students: number;
    trend: "up" | "down" | "stable";
  }[];
  gradeDistribution: { label: string; count: number; color: string }[];
  monthlyTrend: { month: string; average: number }[];
}

// ─── Mock builder (used when backend is unavailable) ─────────────────────────
function buildMock(year: string): AnalyticsOverview {
  return {
    totalStudents: 487,
    averageGrade: 78.4,
    passRate: 91.2,
    topPerformers: 64,
    subjectStats: [
      { subject: "Mathematics", average: 74, highest: 98, lowest: 42, passRate: 88, color: "#FFC600" },
      { subject: "Science",     average: 81, highest: 100, lowest: 55, passRate: 94, color: "#4CAF50" },
      { subject: "English",     average: 79, highest: 97,  lowest: 48, passRate: 92, color: "#2196F3" },
      { subject: "History",     average: 83, highest: 99,  lowest: 60, passRate: 96, color: "#9C27B0" },
      { subject: "Arabic",      average: 76, highest: 95,  lowest: 40, passRate: 87, color: "#FF5722" },
      { subject: "PE",          average: 90, highest: 100, lowest: 70, passRate: 99, color: "#00BCD4" },
    ],
    classRankings: [
      { rank: 1, className: "Class 10-A", average: 88.5, students: 32, trend: "up" },
      { rank: 2, className: "Class 11-B", average: 85.2, students: 30, trend: "up" },
      { rank: 3, className: "Class 10-C", average: 82.7, students: 31, trend: "stable" },
      { rank: 4, className: "Class 9-A",  average: 79.3, students: 28, trend: "down" },
      { rank: 5, className: "Class 11-A", average: 77.8, students: 33, trend: "up" },
    ],
    gradeDistribution: [
      { label: "A+ (90-100)", count: 64,  color: "#4CAF50" },
      { label: "A  (80-89)",  count: 127, color: "#8BC34A" },
      { label: "B  (70-79)",  count: 158, color: "#FFC600" },
      { label: "C  (60-69)",  count: 89,  color: "#FF9800" },
      { label: "D  (50-59)",  count: 35,  color: "#FF5722" },
      { label: "F  (0-49)",   count: 14,  color: "#F44336" },
    ],
    monthlyTrend: [
      { month: "Sep", average: 73 },
      { month: "Oct", average: 75 },
      { month: "Nov", average: 74 },
      { month: "Dec", average: 78 },
      { month: "Jan", average: 77 },
      { month: "Feb", average: 80 },
      { month: "Mar", average: 79 },
      { month: "Apr", average: 82 },
    ],
  };
}

// ─── GET /api/analytics?year=2024-2025 ────────────────────────────────────────
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const year = request.nextUrl.searchParams.get("year") ?? "2024-2025";
  const API  = process.env.NEXT_PUBLIC_API_URL ?? "https://evaschool.runasp.net/api";

  // ── Proxy to real backend ──────────────────────────────────────────────────
  try {
    const upstream = await fetch(
      `${API}/analytics/overview?year=${encodeURIComponent(year)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (upstream.ok) {
      const data = await upstream.json();
      return NextResponse.json(data);
    }
  } catch {
    // fall through to mock
  }

  // ── Fallback: generated mock ───────────────────────────────────────────────
  return NextResponse.json(buildMock(year));
}
