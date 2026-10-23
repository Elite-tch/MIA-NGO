import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dibwnfwk9";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "blog_upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file is too large. Max file size is 10MB." },
        { status: 400 }
      );
    }

    // 1. Upload to Cloudinary using unsigned upload preset
    try {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", UPLOAD_PRESET);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      if (cloudinaryRes.ok) {
        const cData = await cloudinaryRes.json();
        if (cData.secure_url) {
          return NextResponse.json({
            success: true,
            url: cData.secure_url,
            public_id: cData.public_id,
          });
        }
      }
    } catch (cErr) {
      console.warn("Cloudinary upload failed, falling back to local file storage:", cErr);
    }

    // 2. Fallback to local storage if Cloudinary upload was unsuccessful
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^\w.-]/g, "-")
      .replace(/-+/g, "-");
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image file" }, { status: 500 });
  }
}
