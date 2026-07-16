import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const accessToken = "td4tg_85QzWiIW069uxUGoTzcg5roAD1YouyHXED1mI";

  if (!accessToken) {
    return NextResponse.json(
      { message: "GYAZO_ACCESS_TOKEN is not configured." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      "https://api.gyazo.com/api/images?page=1&per_page=100",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Could not load images from Gyazo." },
        { status: response.status },
      );
    }

    return NextResponse.json({ images: data });
  } catch {
    return NextResponse.json(
      { message: "Could not load the shared gallery." },
      { status: 500 },
    );
  }
}
