import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { optimizeWithGemini, simulateModelExecution } from './server/geminiService';
import { generateOptimizedPrompts } from './server/optimizerEngine';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.post('/api/optimize', async (req, res) => {
    try {
      const { rawPrompt, objectiveMode, tacticalAggression } = req.body;
      if (!rawPrompt || typeof rawPrompt !== 'string') {
        return res.status(400).json({ error: 'rawPrompt is required' });
      }

      const result = await optimizeWithGemini(
        rawPrompt,
        objectiveMode || 'precision',
        Number(tacticalAggression) || 2
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/optimize:', error);
      // Fallback to algorithmic generator so user never sees a hard crash
      try {
        const fallback = generateOptimizedPrompts({
          rawPrompt: req.body.rawPrompt || '',
          objectiveMode: req.body.objectiveMode || 'precision',
          tacticalAggression: Number(req.body.tacticalAggression) || 2,
        });
        res.json(fallback);
      } catch (err) {
        res.status(500).json({ error: 'Failed to process prompt optimization' });
      }
    }
  });

  app.post('/api/simulate', async (req, res) => {
    try {
      const { systemPrompt, userPrompt, temperature, modelId } = req.body;
      if (!userPrompt || typeof userPrompt !== 'string') {
        return res.status(400).json({ error: 'userPrompt is required' });
      }

      const result = await simulateModelExecution({
        systemPrompt,
        userPrompt,
        temperature: typeof temperature === 'number' ? temperature : 0.2,
        modelId,
      });

      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/simulate:', error);
      res.status(500).json({ error: error.message || 'Simulation failed' });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prompt Tactics Studio Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });

  process.on('SIGTERM', () => {
    server.close();
  });
  process.on('SIGINT', () => {
    server.close();
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
