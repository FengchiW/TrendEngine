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

const recursivelyListFiles = (dir: string, baseDir: string): string[] => {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const fileList = dirents.flatMap((dirent) => {
      const resolvedPath = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return recursivelyListFiles(resolvedPath, baseDir);
      }
      return path.relative(baseDir, resolvedPath);
    });
    return fileList;
  };

app.get('/api/projects/:projectName/assets', (req, res) => {
    const { projectName } = req.params;
    const assetsPath = path.join(__dirname, '..', 'projects', projectName, 'public', 'assets');

    if (!fs.existsSync(assetsPath)) {
        return res.status(404).json({ message: 'Assets directory not found.' });
    }

    try {
        const assetFiles = recursivelyListFiles(assetsPath, assetsPath);
        res.json(assetFiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to list assets.' });
    }
});

app.get('/api/projects/:projectName/scenes', (req, res) => {
    const { projectName } = req.params;
    const scenesPath = path.join(__dirname, '..', 'projects', projectName, 'src', 'game', 'scenes');

    if (!fs.existsSync(scenesPath)) {
        return res.status(404).json({ message: 'Scenes directory not found.' });
    }

    try {
        const sceneFiles = fs.readdirSync(scenesPath)
        .filter(file => file.endsWith('.scene'));
        res.json(sceneFiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to list scenes.' });
    }
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

describe('GET /api/projects/:projectName/assets', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return a list of assets', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        const readdirSyncMock = jest.spyOn(fs, 'readdirSync');

        readdirSyncMock.mockImplementationOnce((dir) => {
            return [
                { name: 'images', isDirectory: () => true, isFile: () => false },
                { name: 'sounds', isDirectory: () => true, isFile: () => false },
            ] as any;
        });

        readdirSyncMock.mockImplementationOnce((dir) => {
            return [{ name: 'player.png', isDirectory: () => false, isFile: () => true }] as any;
        });

        readdirSyncMock.mockImplementationOnce((dir) => {
            return [{ name: 'music.mp3', isDirectory: () => false, isFile: () => true }] as any;
        });

        const response = await request(app).get('/api/projects/test-project/assets');

        expect(response.status).toBe(200);
        const expected = [ 'images/player.png', 'sounds/music.mp3' ].sort();
        const actual = response.body.map((p: string) => p.replace(/\\/g, '/')).sort();
        expect(actual).toEqual(expected);
    });

    it('should return 404 if assets directory does not exist', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        const response = await request(app).get('/api/projects/test-project/assets');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Assets directory not found.');
    });
});

describe('GET /api/projects/:projectName/scenes', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return a list of scenes', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readdirSync').mockReturnValue(['level1.scene', 'level2.scene', 'not-a-scene.txt'] as any);

        const response = await request(app).get('/api/projects/test-project/scenes');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(['level1.scene', 'level2.scene']);
    });

    it('should return 404 if scenes directory does not exist', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        const response = await request(app).get('/api/projects/test-project/scenes');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Scenes directory not found.');
    });
});
