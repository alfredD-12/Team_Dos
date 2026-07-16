import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const accessToken = process.env.GYAZO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { message: "GYAZO_ACCESS_TOKEN is not configured." },
      { status: 500 },
    );
  }

  try {
    const incomingForm = await request.formData();
    const image = incomingForm.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Please provide an image file." },
        { status: 400 },
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "The selected file must be an image." },
        { status: 400 },
      );
    }

    const gyazoForm = new FormData();
    gyazoForm.append("imagedata", image, image.name);
    gyazoForm.append("access_policy", "anyone");
    gyazoForm.append("app", "Team Dos Image Upload");

    const gyazoResponse = await fetch("https://upload.gyazo.com/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: gyazoForm,
    });

    const data = await gyazoResponse.json();

    if (!gyazoResponse.ok) {
      return NextResponse.json(
        { message: data.message || "Gyazo rejected the upload." },
        { status: gyazoResponse.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "The image could not be uploaded." },
      { status: 500 },
    );
  }
}
