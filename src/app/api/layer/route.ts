import { RootFilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@lib/mongodb";
import { upsertDocument } from "@lib/repository";
import { LayerDocument, LayerModel } from "@models/layer";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || undefined;

  try {
    const query: RootFilterQuery<LayerDocument> = {};
    if (name) query.name = name;
    console.log("api -> GET layer -> query", query);

    await connectDB();
    const data = await LayerModel.find(query);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("api -> GET layer -> error getting layer data:", error);
    return NextResponse.json({ error: "Error getting layer data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // console.log("api -> POST data");

  try {
    const url = new URL(request.url);
    const upsert = url.searchParams.get("upsert") === "true";
    const data: LayerDocument = await request.json();
    console.log("api -> POST layer -> data", data);
    const result = await upsertDocument(LayerModel, data, ["name"], upsert);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("api -> POST layer -> error", error);

    // Return error response
    return NextResponse.json(
      // @ts-expect-error ignore error payload properties
      { error: "Error saving layer", message: error.message },
      { status: 500 },
    );
  }
}
