import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession, getAdminSession } from "@/lib/admin-auth-server";

const getCloudinaryConfig = () => {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME?.trim() ||
    process.env.NEXT_PUBLIC_CLUDENARY_NAME?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
    "";
  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ||
    "";
  const apiKey =
    process.env.CLOUDINARY_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_CLUDENARY?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim() ||
    "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() || "";

  return {
    cloudName,
    uploadPreset,
    apiKey,
    apiSecret,
  };
};

const createSignature = (params: Record<string, string>, apiSecret: string) => {
  const paramString = Object.entries(params)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${paramString}${apiSecret}`)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    const response = NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    clearAdminSession(response);
    return response;
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Image file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Only image files are allowed." }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ message: "Image must be 10 MB or smaller." }, { status: 400 });
  }

  const { cloudName, uploadPreset, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloudName) {
    return NextResponse.json(
      { message: "Missing Cloudinary cloud name in env." },
      { status: 500 },
    );
  }

  const uploadBody = new FormData();
  uploadBody.append("file", file);
  uploadBody.append("folder", "freshbitan/products");

  if (apiKey && apiSecret) {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = createSignature(
      {
        folder: "freshbitan/products",
        timestamp,
      },
      apiSecret,
    );

    uploadBody.append("api_key", apiKey);
    uploadBody.append("timestamp", timestamp);
    uploadBody.append("signature", signature);
  } else if (uploadPreset) {
    uploadBody.append("upload_preset", uploadPreset);
  } else {
    return NextResponse.json(
      {
        message:
          "Missing Cloudinary upload configuration. Add CLOUDINARY_UPLOAD_PRESET or CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
      },
      { status: 500 },
    );
  }

  const cloudinaryResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadBody,
      cache: "no-store",
    },
  );

  const payload = await cloudinaryResponse.json().catch(() => ({
    error: { message: "Cloudinary upload failed." },
  }));

  if (!cloudinaryResponse.ok) {
    const cloudinaryMessage =
      payload?.error?.message || "Could not upload image to Cloudinary.";

    return NextResponse.json(
      {
        message:
          cloudinaryMessage === "Upload preset not found"
            ? "Cloudinary upload preset was not found. Add a valid CLOUDINARY_UPLOAD_PRESET in frontend/.env or provide CLOUDINARY_API_SECRET for signed uploads."
            : cloudinaryMessage,
      },
      { status: cloudinaryResponse.status },
    );
  }

  return NextResponse.json({
    url: payload.secure_url as string,
    publicId: payload.public_id as string,
    width: payload.width as number | undefined,
    height: payload.height as number | undefined,
    originalFilename: payload.original_filename as string | undefined,
  });
}
