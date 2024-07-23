import { getServerSideConfig } from "@/app/config/server";
import { ModelProvider } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { requestOpenai } from "../../common";
import { AppRouteHandlerFnContext } from "next-auth/lib/types";
import { NextAuthRequest } from "next-auth/lib";
import { apiAuth } from "../../auth";
import { auth } from "@/app/lib/auth";

async function handle(
  req: NextAuthRequest,
  { params }: AppRouteHandlerFnContext,
) {
  console.log("[Azure Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const authResult = await apiAuth(req, ModelProvider.GPT);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    return await requestOpenai(req);
  } catch (e) {
    console.error("[Azure] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = auth(handle);
export const POST = auth(handle);

export const runtime = "edge";
export const preferredRegion = [
  "arn1",
  "bom1",
  "cdg1",
  "cle1",
  "cpt1",
  "dub1",
  "fra1",
  "gru1",
  "hnd1",
  "iad1",
  "icn1",
  "kix1",
  "lhr1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
];
