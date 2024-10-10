import { NextResponse } from "next/server";
import { getNftImagePath } from "@lib/server/utils";
import { EpochType } from "@customTypes/index.ts";
import dayjs from "dayjs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const epochType = (searchParams.get("epochType") as EpochType) || EpochType.Minute;
  const date = searchParams.get("date") || dayjs().format("YYYY-MM-DD HH:mm");
  console.log("api -> GET nft -> epochType", epochType, "date", date);

  try {
    const nftImagePath = getNftImagePath(epochType, date);
    return NextResponse.json({ nft: nftImagePath }, { status: 200 });
  } catch (error) {
    console.error("Error fetching NFT:", error);
    return NextResponse.json({ error: "Error fetching NFT" }, { status: 500 });
  }
}
