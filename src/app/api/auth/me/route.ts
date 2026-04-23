import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    return NextResponse.json(
      {
        userId: 1,
        role: token === "admin" ? "Admin" : token === "teacher" ? "Teacher" : "Student",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
}
