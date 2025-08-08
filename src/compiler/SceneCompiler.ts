import { AppState } from '../contexts/AppContext';

export const compileScene = (state: AppState): string => {
  const { gameObjects } = state;

  const scriptImports = gameObjects
    .flatMap((obj) => obj.scripts)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((script) => `import ${script.replace('.ts', '')} from './${script.replace('.ts', '')}';`)
    .join('\n');

  const gameObjectsCreation = gameObjects
    .map((obj) => {
      let scriptAttachment = '';
      if (obj.scripts.length > 0) {
        const scriptInstances = obj.scripts.map(script => `new ${script.replace('.ts', '')}()`).join(', ');
        scriptAttachment = `\n    sprite.scripts = [${scriptInstances}];`;
      }
      return `    const sprite = this.add.sprite(${obj.x}, ${obj.y}, 'player'); // Replace 'player' with actual asset key
    sprite.name = '${obj.name}';${scriptAttachment}`;
    })
    .join('\n');

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
