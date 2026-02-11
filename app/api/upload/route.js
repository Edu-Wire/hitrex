import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file uploaded" },
                { status: 400 }
            );
        }

        const imageUrl = await uploadImage(file, "trekking-adventure/hero-slides");

        return NextResponse.json({ success: true, url: imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, error: "Upload failed: " + error.message },
            { status: 500 }
        );
    }
}
