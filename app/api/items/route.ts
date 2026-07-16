import { NextRequest, NextResponse } from "next/server";

type Item = {
  id: number;
  name: string;
  category: string;
  description: string;
  createdAt: string;
};

const items: Item[] = [
  {
    id: 1,
    name: "Design System Starter",
    category: "Design",
    description: "Reusable foundations for consistent product interfaces.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "API Launch Checklist",
    category: "Engineering",
    description: "A practical checklist for shipping reliable API changes.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Customer Research Notes",
    category: "Research",
    description: "Organized insights gathered from customer interviews.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const result = query
    ? items.filter((item) =>
        [item.name, item.category, item.description].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
    : items;

  return NextResponse.json({ items: result, total: result.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (!name || !category || !description) {
    return NextResponse.json(
      { message: "Name, category, and description are required." },
      { status: 400 },
    );
  }

  const item: Item = {
    id: Date.now(),
    name,
    category,
    description,
    createdAt: new Date().toISOString(),
  };

  items.unshift(item);
  return NextResponse.json({ item }, { status: 201 });
}
