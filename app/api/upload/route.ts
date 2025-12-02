import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name.replace(/\s+/g, "-")}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('products')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json({ success: false, message: "Upload failed: " + uploadError.message }, { status: 500 });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('products')
            .getPublicUrl(filename);

        return NextResponse.json({
            success: true,
            url: publicUrl
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}
