
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Plugin để mock API local (Proxy)
const localApiPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use('/api/generate-image', async (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { prompt, aspectRatio = "4:3" } = JSON.parse(body);

            // Import động để tránh crash nếu chưa cài module
            const { GoogleAuth } = await import('google-auth-library');

            let keyPath = path.join(process.cwd(), 'service-account.json');

            // Tự động tìm ở thư mục cha nếu không thấy ở thư mục gốc
            if (!fs.existsSync(keyPath)) {
              const parentPath = path.join(process.cwd(), '..', 'service-account.json');
              if (fs.existsSync(parentPath)) {
                console.log("Found key in parent directory:", parentPath);
                keyPath = parentPath;
              } else {
                throw new Error('Service Account Key not found in project or parent directory (service-account.json)');
              }
            }

            const auth = new GoogleAuth({
              keyFile: keyPath,
              scopes: ['https://www.googleapis.com/auth/cloud-platform'],
            });

            const client = await auth.getClient();
            const accessToken = await client.getAccessToken();

            const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
            const projectId = keyData.project_id;
            const location = 'us-central1';

            // Model Imagen 3
            const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;

            const googleRes = await fetch(url, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                instances: [{ prompt }],
                parameters: { sampleCount: 1, aspectRatio: aspectRatio }
              })
            });

            if (!googleRes.ok) {
              const errorText = await googleRes.text();
              throw new Error(`Vertex AI Error: ${errorText}`);
            }

            const data = await googleRes.json();
            const imageBase64 = data.predictions?.[0]?.bytesBase64Encoded;

            if (!imageBase64) throw new Error("No image generated");

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ image: `data:image/png;base64,${imageBase64}` }));

          } catch (error: any) {
            console.error("Local API Error:", error);
            const status = error.code === 'MODULE_NOT_FOUND' ? 500 : 500;
            const msg = error.code === 'MODULE_NOT_FOUND'
              ? "Missing google-auth-library. Run: npm install google-auth-library"
              : error.message;

            res.statusCode = status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: msg }));
          }
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), localApiPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
