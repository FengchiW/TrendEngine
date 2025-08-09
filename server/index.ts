import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { compileScene, AppState } from './compiler';
import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';

const app = express();
const port = 3001;

// Enable CORS for all routes to allow the frontend to communicate with this server.
app.use(cors());
// Use the body-parser middleware to parse JSON request bodies.
app.use(json());

/**
 * API endpoint to compile a scene.
 * Expects a POST request with the scene state in the request body.
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

app.post('/api/projects', (req, res) => {
  const { projectName } = req.body;

  if (!projectName) {
    return res.status(400).json({ message: 'Project name is required.' });
  }

  const projectsPath = path.join(__dirname, '..', 'projects');
  if (!fs.existsSync(projectsPath)) {
    fs.mkdirSync(projectsPath, { recursive: true });
  }

  const child = spawn('npx', ['@phaserjs/create-game@latest', projectName], {
    stdio: 'pipe',
    shell: true, // Use shell to ensure npx is found
    cwd: projectsPath,
  });

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`child process exited with code ${code}`);
      return res.status(500).json({ message: `Failed to create project. Exit code: ${code}` });
    }

    res.json({ message: `Project ${projectName} created successfully!` });
  });

  // 1. Select "Web Bundler"
  setTimeout(() => {
    child.stdin.write('\x1B[B');
    child.stdin.write('\x1B[B');
    child.stdin.write('\x1B[B');
    child.stdin.write('\n');
  }, 1000);

  // 2. Select "Vite"
  setTimeout(() => {
    child.stdin.write('\n');
  }, 2000);

  // 3. Select "Minimal"
  setTimeout(() => {
      child.stdin.write('\x1B[B');
      child.stdin.write('\n');
  }, 3000);

  // 4. Select "TypeScript"
  setTimeout(() => {
    child.stdin.write('\x1B[B');
    child.stdin.write('\n');
  }, 4000);

  // 5. Agree to telemetry
  setTimeout(() => {
    child.stdin.write('Y\n');
  }, 5000);

});

// Start the server.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
