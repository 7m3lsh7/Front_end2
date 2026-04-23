import { NextResponse } from "next/server";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LoginBody;
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 }
    );
  }

  const sanitizedUsername = String(username).trim();
  const sanitizedPassword = String(password).trim();

  if (sanitizedUsername.length > 100 || sanitizedPassword.length > 200) {
    return NextResponse.json({ message: "Invalid input length" }, { status: 400 });
  }

  let role: "Student" | "Teacher" | "Admin" | null = null;
  if (sanitizedUsername === "student" && sanitizedPassword === "1234") role = "Student";
  if (sanitizedUsername === "teacher" && sanitizedPassword === "1234") role = "Teacher";
  if (sanitizedUsername === "admin" && sanitizedPassword === "1234") role = "Admin";

  if (!role) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ role }, { status: 200 });
  response.cookies.set("access_token", sanitizedUsername, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
