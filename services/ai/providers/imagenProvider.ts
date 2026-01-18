
// Wrapper gọi Serverless Function (chạy local hoặc Vercel)
export const renderWithImagen = async (prompt: string): Promise<string> => {
    try {
        console.log("🎨 Calling Imagen 3 via Serverless Function...");

        // Gọi API endpoint nội bộ
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                aspectRatio: "4:3"
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to call Imagen API');
        }

        const data = await response.json();
        return data.image; // Trả về base64 string

    } catch (error: any) {
        console.error("❌ Imagen Error:", error);
        throw error;
    }
};
