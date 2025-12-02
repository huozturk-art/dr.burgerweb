import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename to avoid overwrites (optional, but good practice)
        // For now, we'll keep the original name but maybe prepend a timestamp if needed.
        // Let's just use the original name for simplicity as per user request context, 
        // but sanitizing it is good.
        const filename = file.name.replace(/\s+/g, "-");
        const uploadDir = path.join(process.cwd(), "public/images/products");
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            url: `/images/products/${filename}`
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}
