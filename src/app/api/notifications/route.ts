import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export interface Notification {
  id: string;
  type: "grade" | "announcement" | "system" | "reminder";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  role?: string;
  targetRole?: string;
}

// In-memory store (resets on server restart — replace with DB when ready)
const inMemoryNotifications: Notification[] = [];

// Mock fallback notifications
function generateMockNotifications(role: string): Notification[] {
  const now = new Date();
  const base: Notification[] = [
    {
      id: "n1",
      type: "grade",
      title: "New Grades Posted",
      message: "Mathematics quarter grades have been updated by your teacher.",
      timestamp: new Date(now.getTime() - 10 * 60000).toISOString(),
      read: false,
      priority: "high",
    },
    {
      id: "n2",
      type: "announcement",
      title: "School Announcement",
      message: "Final exams schedule has been published. Check the academic calendar.",
      timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(),
      read: false,
      priority: "medium",
    },
    {
      id: "n3",
      type: "system",
      title: "System Update",
      message: "The grading platform has been updated with new analytics features.",
      timestamp: new Date(now.getTime() - 24 * 3600000).toISOString(),
      read: true,
      priority: "low",
    },
    {
      id: "n4",
      type: "reminder",
      title: "Grade Submission Reminder",
      message: "Please submit all pending grades before end of this week.",
      timestamp: new Date(now.getTime() - 3 * 3600000).toISOString(),
      read: false,
      priority: "high",
    },
  ];

  if (role === "Student") return base.filter((n) => ["grade", "announcement", "system"].includes(n.type));
  if (role === "Teacher") return base.filter((n) => ["announcement", "system", "reminder"].includes(n.type));
  return base;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Try to get from real backend first
  const API = process.env.NEXT_PUBLIC_API_URL || "https://evaschool.runasp.net/api";
  try {
    const res = await fetch(`${API}/notifications`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      // Merge with any in-memory notifications
      const merged = [...inMemoryNotifications, ...(data.notifications ?? [])];
      return NextResponse.json({ notifications: merged, unreadCount: merged.filter((n) => !n.read).length });
    }
  } catch {
    // Fall through to mock data
  }

  // Return in-memory + mock data
  const mockRole = token.startsWith("ey")
    ? "Admin" // JWT tokens likely admin/teacher, parse properly in prod
    : token === "student"
    ? "Student"
    : token === "teacher"
    ? "Teacher"
    : "Admin";
  const mockNotifs = generateMockNotifications(mockRole);
  const merged = [...inMemoryNotifications, ...mockNotifs];
  return NextResponse.json({ notifications: merged, unreadCount: merged.filter((n) => !n.read).length });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as Partial<Notification>;

  if (!body.title || !body.message) {
    return NextResponse.json({ message: "title and message are required" }, { status: 400 });
  }

  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type: body.type ?? "system",
    title: body.title,
    message: body.message,
    timestamp: new Date().toISOString(),
    read: false,
    priority: body.priority ?? "medium",
    targetRole: body.targetRole,
  };

  // Store in memory (cap at 50)
  inMemoryNotifications.unshift(notification);
  if (inMemoryNotifications.length > 50) inMemoryNotifications.pop();

  // Also try to push to backend
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (token) {
    const API = process.env.NEXT_PUBLIC_API_URL || "https://evaschool.runasp.net/api";
    fetch(`${API}/notifications`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, notification });
}

export async function PATCH(request: Request) {
  const { id, read } = await request.json().catch(() => ({}));

  if (!id) {
    return NextResponse.json({ message: "Notification ID required" }, { status: 400 });
  }

  // Update in-memory
  const notif = inMemoryNotifications.find((n) => n.id === id);
  if (notif) notif.read = read;

  // Try backend
  const API = process.env.NEXT_PUBLIC_API_URL || "https://evaschool.runasp.net/api";
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const res = await fetch(`${API}/notifications/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    if (res.ok) return NextResponse.json({ success: true });
  } catch {
    // Fall through
  }

  return NextResponse.json({ success: true, id, read });
}
