import { RootFilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { EpochData, EpochType } from "@customTypes/index";
import { connectDB } from "@lib/mongodb";
import { upsertDocument } from "@lib/repository";
// import { readData, writeData } from "@lib/server/utils";
import EpochModel, { EpochDocument } from "@models/epoch";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const rarity = searchParams.get("rarity") || undefined;
  const type = searchParams.get("type") || undefined;
  const state = searchParams.get("state") || undefined;
  const status = searchParams.get("status") || undefined;

  try {
    // const data = readData(startDate, endDate, rarity, type, state, status);
    const query: RootFilterQuery<EpochDocument> = {};
    if (startDate) query.isoDate = { $gte: new Date(startDate) };
    if (endDate) query.isoDate = { $lte: new Date(endDate) };
    if (rarity) query.rarity = rarity;
    if (type) query.type = type;
    if (state) query.state = state;
    if (status) query.status = status;
    console.log("api -> GET data -> query", query);

    await connectDB();
    // @ts-expect-error ignore
    const data = await EpochModel.find(query);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("api -> GET data -> error reading data:", error);
    return NextResponse.json({ error: "Error reading data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // console.log("api -> POST data");

  try {
    const url = new URL(request.url);
    const upsert = url.searchParams.get("upsert") === "true";
    const data: EpochData = await request.json();
    console.log("api -> POST data -> data", data);
    const dateFieldToCheck = data.type === EpochType.Minute ? "ymdhmDate" : "ymdDate";
    const result = await upsertDocument(EpochModel, data, ["type", "value", dateFieldToCheck], upsert);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("api -> POST data -> error", error);

    // Return error response
    return NextResponse.json(
      // @ts-expect-error ignore error payload properties
      { error: "Error saving data", message: error.message },
      { status: 500 },
    );
  }
}
