
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // Chỉ chấp nhận POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, aspectRatio = "4:3" } = req.body;

        // 1. Xác định Credentials (Ưu tiên Env Var cho Vercel)
        let credentials;
        let projectId;

        if (process.env.GOOGLE_CREDENTIALS) {
            try {
                credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
                projectId = credentials.project_id;
            } catch (e) {
                console.error("Failed to parse GOOGLE_CREDENTIALS env var", e);
            }
        }

        // Nếu không có Env Var, tìm file key (Local Dev)
        let keyPath;
        if (!credentials) {
            keyPath = path.join(process.cwd(), 'service-account.json');
            // Tự động tìm ở thư mục cha (Local)
            if (!fs.existsSync(keyPath)) {
                const parentPath = path.join(process.cwd(), '..', 'service-account.json');
                if (fs.existsSync(parentPath)) {
                    keyPath = parentPath;
                }
            }
        }

        if (!credentials && (!keyPath || !fs.existsSync(keyPath))) {
            throw new Error('Service Account Key not found (Env: GOOGLE_CREDENTIALS or file: service-account.json)');
        }

        // 2. Authenticate với Google
        const auth = new GoogleAuth({
            credentials, // Dùng object nếu có (từ Env)
            keyFile: !credentials ? keyPath : undefined, // Dùng file nếu không có Env
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        const token = accessToken.token;

        // Lấy Project ID nếu chưa có
        if (!projectId && keyPath) {
            const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
            projectId = keyData.project_id;
        }
        const location = 'us-central1'; // Mặc định cho Imagen

        // 3. Gọi Imagen 3 API (Vertex AI)
        // Model: imagen-3.0-generate-001
        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [
                    { prompt: prompt }
                ],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: aspectRatio,
                    // Có thể thêm negativePrompt nếu cần
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Vertex AI Error:", errorText);
            throw new Error(`Vertex AI API Error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        // 4. Trả về ảnh Base64
        // Cấu trúc response: { predictions: [ { bytesBase64Encoded: "..." } ] }
        const imageBase64 = data.predictions?.[0]?.bytesBase64Encoded;

        if (!imageBase64) {
            throw new Error("No image generated from Vertex AI");
        }

        res.status(200).json({ image: `data:image/png;base64,${imageBase64}` });

    } catch (error) {
        console.error("Handler Error:", error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
