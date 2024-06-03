import { NextRequest, NextResponse } from "next/server";
import { ModelProvider } from "@/app/constant";
import { apiAuth } from "@/app/api/auth";
import { getServerSideConfig } from "@/app/config/server";
import S3FileStorage from "@/app/utils/s3_file_storage";
import { NextAuthRequest } from "next-auth/lib";
import { auth } from "@/app/lib/auth";

function extname(filePath: string) {
  const baseName = filePath.split("/").pop(); // Get the base name of the file

  if (!baseName) return "";

  const dotIndex = baseName.lastIndexOf("."); // Find the last dot in the base name

  // If there's no dot or the dot is the first character (hidden files), return an empty string
  if (dotIndex <= 0) {
    return "";
  }

  // Return the substring from the last dot to the end of the string
  return baseName.slice(dotIndex);
}

async function handle(req: NextAuthRequest) {
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
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileData = await file.arrayBuffer();
    const originalFileName = file?.name;

    if (!fileData) throw new Error("Get file buffer error");
    const buffer = Buffer.from(fileData);
    const fileType = extname(originalFileName).slice(1);
    var fileName = `${Date.now()}.${fileType}`;
    var filePath = "";
    const serverConfig = getServerSideConfig();
    // if (serverConfig.isStoreFileToLocal) {
    //   filePath = await LocalFileStorage.put(fileName, buffer);
    // } else {
    filePath = await S3FileStorage.put(fileName, buffer);
    // }
    return NextResponse.json(
      {
        fileName: fileName,
        filePath: filePath,
      },
      {
        status: 200,
      },
    );
  } catch (e) {
    return NextResponse.json(
      {
        error: true,
        msg: (e as Error).message,
      },
      {
        status: 500,
      },
    );
  }
}

export const POST = auth(handle);

export const runtime = "edge";
