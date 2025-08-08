import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { compileScene, AppState } from '../compiler';
import fs from 'fs';
import path from 'path';

// Mock the compileScene function
jest.mock('../compiler', () => ({
  ...jest.requireActual('../compiler'),
  compileScene: jest.fn(),
}));

const app = express();
app.use(cors());
app.use(json());

app.post('/api/compile', (req, res) => {
  const sceneState: AppState = req.body;
  const compiledCode = compileScene(sceneState);
  const outputPath = path.join(__dirname, 'output', 'CompiledScene.tsx');

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, compiledCode);

  res.json({
    message: 'Scene compiled successfully!',
    filePath: outputPath,
    code: compiledCode,
  });
});

describe('POST /api/compile', () => {
  it('should compile the scene and return a success message', async () => {
    const mockState: AppState = {
      gameObjects: [{ id: 1, name: 'Test', x: 0, y: 0, scripts: [] }],
      selectedObjectId: null,
      scripts: [],
    };
    const mockCompiledCode = 'compiled code';
    (compileScene as jest.Mock).mockReturnValue(mockCompiledCode);

    const response = await request(app)
      .post('/api/compile')
      .send(mockState);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Scene compiled successfully!');
    expect(response.body.code).toBe(mockCompiledCode);
    expect(compileScene).toHaveBeenCalledWith(mockState);
  });
});
