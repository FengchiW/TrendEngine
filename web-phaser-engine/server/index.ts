import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { compileScene, AppState } from './compiler';
import fs from 'fs';
import path from 'path';

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

// Start the server.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
