
// ============================================
// HÀM RENDER FLUX (POLLINATIONS API - FREE)
// ============================================
export const renderWithFlux = async (prompt: string) => {
    const width = 1200;
    const height = 800;
    const seed = Math.floor(Math.random() * 1000000);

    // Làm sạch prompt: Bỏ xuống dòng, bỏ ký tự lạ để tránh lỗi 400 URL
    const cleanPrompt = prompt.replace(/\n/g, " ").replace(/[#*]/g, "").substring(0, 1000);

    // Sử dụng endpoint mới nhất và ổn định nhất của Pollinations (Gen v2)
    const fluxUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;

    console.log("🎨 Flux URL:", fluxUrl);
    return fluxUrl;
};
