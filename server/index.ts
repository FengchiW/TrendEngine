import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { compileScene, AppState } from './compiler';
import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

const app = express();
const port = 3001;

// Enable CORS for all routes to allow the frontend to communicate with this server.
app.use(cors());
// Use the body-parser middleware to parse JSON request bodies.
app.use(json());

/**
 * @swagger
 * /api/compile:
 *   post:
 *     summary: Compile a scene
 *     description: Compiles the given scene state and returns the compiled code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scene:
 *                 type: object
 *     responses:
 *       200:
 *         description: Scene compiled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filePath:
 *                   type: string
 *                 code:
 *                   type: string
 */
app.post('/api/compile', (req, res) => {
  // Get the scene state from the request body.
  const sceneState: AppState = req.body;
  // Compile the scene state into a .tsx string.
  const compiledCode = compileScene(sceneState);
  // Define the output path for the compiled file.
  const outputPath = path.join(__dirname, 'output', 'CompiledScene.tsx');

  // Ensure the output directory exists.
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  // Write the compiled code to the file.
  fs.writeFileSync(outputPath, compiledCode);

  // Send a success response with the file path and the compiled code.
  res.json({
    message: 'Scene compiled successfully!',
    filePath: outputPath,
    code: compiledCode,
  });
});

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Returns a list of all project names.
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Failed to read projects directory
 */
app.get('/api/projects', (req, res) => {
  const projectsPath = path.join(__dirname, '..', 'projects');
  if (!fs.existsSync(projectsPath)) {
    fs.mkdirSync(projectsPath, { recursive: true });
  }
  fs.readdir(projectsPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read projects directory.' });
    }

    const projects = files
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => fs.existsSync(path.join(projectsPath, dirent.name, 'package.json')))
      .map(dirent => dirent.name);

    res.json(projects);
  });
});

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new Phaser project with the given name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *                 description: The name of the project to create.
 *     responses:
 *       200:
 *         description: Project created successfully
 *       400:
 *         description: Project name is required
 *       500:
 *         description: Failed to create project
 */
app.post('/api/projects', (req, res) => {
  const { projectName } = req.body;

  if (!projectName) {
    return res.status(400).json({ message: 'Project name is required.' });
  }

  const projectsPath = path.join(__dirname, '..', 'projects');
  const projectPath = path.join(projectsPath, projectName);
  const templatePath = path.join(__dirname, '..', 'templates', 'phaser-template');

  if (fs.existsSync(projectPath)) {
    return res.status(400).json({ message: 'Project already exists.' });
  }

  if (!fs.existsSync(templatePath)) {
    return res.status(500).json({ message: 'Template not found.' });
  }

  try {
    fs.cpSync(templatePath, projectPath, { recursive: true });

    // Create a default .scene file
    const sceneDir = path.join(projectPath, 'src', 'game', 'scenes');
    fs.mkdirSync(sceneDir, { recursive: true });
    const sceneFilePath = path.join(sceneDir, 'Game.scene');
    const defaultSceneContent = {
      gameObjects: [],
      selectedObjectId: null,
      scripts: [],
    };
    fs.writeFileSync(sceneFilePath, JSON.stringify(defaultSceneContent, null, 2));

    res.json({ message: `Project ${projectName} created successfully!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create project.' });
  }
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Start the server.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
