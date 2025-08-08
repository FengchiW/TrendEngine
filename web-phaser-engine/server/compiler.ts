// This is a duplicated and simplified version for the backend.
// In a real project, this would be a shared module.

/**
 * Represents a single game object in the scene.
 */
export interface GameObject {
  id: number;
  name: string;
  x: number;
  y: number;
  scripts: string[];
}

/**
 * Represents the entire state of the application.
 */
export interface AppState {
  gameObjects: GameObject[];
  selectedObjectId: number | null;
  scripts: string[];
}

/**
 * Compiles the application state into a runnable .tsx file for a Phaser 3 scene.
 * @param state The application state.
 * @returns A string containing the compiled .tsx code.
 */
export const compileScene = (state: AppState): string => {
  const { gameObjects } = state;

  // Generate import statements for all unique scripts attached to game objects.
  const scriptImports = gameObjects
    .flatMap((obj) => obj.scripts)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((script) => `import ${script.replace('.ts', '')} from './${script.replace('.ts', '')}';`)
    .join('\n');

  // Generate the code to create each game object in the Phaser scene's create() method.
  const gameObjectsCreation = gameObjects
    .map((obj) => {
      let scriptAttachment = '';
      // If the game object has scripts, generate the code to instantiate and attach them.
      if (obj.scripts.length > 0) {
        const scriptInstances = obj.scripts.map(script => `new ${script.replace('.ts', '')}()`).join(', ');
        scriptAttachment = `\n    sprite.scripts = [${scriptInstances}];`;
      }
      return `    const sprite = this.add.sprite(${obj.x}, ${obj.y}, 'player'); // Replace 'player' with actual asset key
    sprite.name = '${obj.name}';${scriptAttachment}`;
    })
    .join('\n');

  // Return the full .tsx file content as a template string.
  return `
import Phaser from 'phaser';
import React from 'react';
${scriptImports}

class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  preload() {
    // Preload assets here
    this.load.image('player', 'assets/player.png'); // Example asset
  }

  create() {
${gameObjectsCreation}
  }
}

const GameComponent = () => {
  const gameContainer = React.useRef(null);

  React.useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainer.current,
      scene: [Level1],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainer} />;
};

export default GameComponent;
`;
};
