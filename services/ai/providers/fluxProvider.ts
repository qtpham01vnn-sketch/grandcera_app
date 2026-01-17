
// ============================================
// HÀM RENDER FLUX (POLLINATIONS API - FREE)
// ============================================
export const renderWithFlux = async (prompt: string): Promise<string> => {
    const width = 1200;
    const height = 800;
    const seed = Math.floor(Math.random() * 1000000);

    // Làm sạch prompt: Bỏ xuống dòng, bỏ ký tự lạ, giới hạn 400 ký tự để tránh URL quá dài
    const cleanPrompt = prompt
        .replace(/\n/g, " ")
        .replace(/[#*\[\]{}()]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 400);

    // Endpoint mới của Pollinations.ai (2025)
    // Sử dụng model flux cho chất lượng tốt
    const fluxUrl = `https://pollinations.ai/p/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;

    console.log("🎨 Flux URL:", fluxUrl);
    console.log("📏 Prompt length:", cleanPrompt.length);

    // Trả về URL - browser sẽ tự fetch ảnh khi render img tag
    return fluxUrl;
};
