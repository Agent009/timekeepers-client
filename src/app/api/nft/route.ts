import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { EpochType } from "@customTypes/index";
import { generateImagePath } from "@lib/server/utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const epochType = (searchParams.get("epochType") as EpochType) || EpochType.Minute;
  const date = searchParams.get("date") || dayjs().format("YYYY-MM-DD HH:mm");
  console.log("api -> GET nft -> epochType", epochType, "date", date);

  try {
    const nftImagePath = generateImagePath(epochType, date);
    return NextResponse.json({ nft: nftImagePath }, { status: 200 });
  } catch (error) {
    console.error("Error fetching NFT:", error);
    return NextResponse.json({ error: "Error fetching NFT" }, { status: 500 });
  }
}
