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
}

// Mock notifications — replace with DB query when backend is ready
function generateNotifications(role: string): Notification[] {
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

  // Filter by role relevance
  if (role === "Student") {
    return base.filter((n) => ["grade", "announcement", "system"].includes(n.type));
  }
  if (role === "Teacher") {
    return base.filter((n) => ["announcement", "system", "reminder"].includes(n.type));
  }
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
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fall through to mock data
  }

  // Return mock data with role-based filtering
  const role = token === "student" ? "Student" : token === "teacher" ? "Teacher" : "Admin";
  const notifications = generateNotifications(role);
  return NextResponse.json({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
}

export async function PATCH(request: Request) {
  const { id, read } = await request.json().catch(() => ({}));

  if (!id) {
    return NextResponse.json({ message: "Notification ID required" }, { status: 400 });
  }

  // In real app: update in DB
  const API = process.env.NEXT_PUBLIC_API_URL || "https://evaschool.runasp.net/api";
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const res = await fetch(`${API}/notifications/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read }),
    });
    if (res.ok) return NextResponse.json({ success: true });
  } catch {
    // Fall through
  }

  return NextResponse.json({ success: true, id, read });
}
