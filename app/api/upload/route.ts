import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure distinct filename
        const filename = Date.now() + '-' + file.name.replace(/\s/g, '-');

        // Save to public/uploads
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return the URL relative to the public folder
        const url = `/uploads/${filename}`;

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
