import { NextResponse } from "next/server";
import { RootFilterQuery } from "mongoose";
import { EpochData } from "@customTypes/index";
import Epoch, { EpochDocument } from "@models/Epoch";
// import { readData, writeData } from "@lib/server/utils";

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

    // @ts-expect-error ignore
    const data = await Epoch.find(query);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ error: "Error reading data" }, { status: 500 });
  }
}

export async function POST(request) {
  // console.log("api -> POST data");

  try {
    const newEntry: EpochData = await request.json();
    console.log("api -> POST data -> newEntry", newEntry);
    // const writeDataResponse = writeData(newEntry);
    const epochEntry = new Epoch(newEntry);
    const writeDataResponse = await epochEntry.save();
    return NextResponse.json(writeDataResponse, { status: 200 });
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
