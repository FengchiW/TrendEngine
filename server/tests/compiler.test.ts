import { compileScene, AppState } from '../compiler';

describe('compileScene', () => {
  it('should compile a simple scene with one game object and no scripts', () => {
    const state: AppState = {
      gameObjects: [
        { id: 1, name: 'Player', x: 100, y: 200, scripts: [] },
      ],
      selectedObjectId: null,
      scripts: [],
    };

    const expectedCode = `
import Phaser from 'phaser';
import React from 'react';


class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  preload() {
    // Preload assets here
    this.load.image('player', 'assets/player.png'); // Example asset
  }

  create() {
    const sprite = this.add.sprite(100, 200, 'player'); // Replace 'player' with actual asset key
    sprite.name = 'Player';
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

    expect(compileScene(state)).toBe(expectedCode);
  });

  it('should compile a scene with multiple game objects and scripts', () => {
    const state: AppState = {
      gameObjects: [
        { id: 1, name: 'Player', x: 100, y: 200, scripts: ['PlayerScript.ts'] },
        { id: 2, name: 'Enemy', x: 300, y: 400, scripts: ['EnemyScript.ts'] },
      ],
      selectedObjectId: null,
      scripts: ['PlayerScript.ts', 'EnemyScript.ts'],
    };

    const expectedCode = `
import Phaser from 'phaser';
import React from 'react';
import PlayerScript from './PlayerScript';
import EnemyScript from './EnemyScript';

class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  preload() {
    // Preload assets here
    this.load.image('player', 'assets/player.png'); // Example asset
  }

  create() {
    const sprite = this.add.sprite(100, 200, 'player'); // Replace 'player' with actual asset key
    sprite.name = 'Player';
    sprite.scripts = [new PlayerScript()];
    const sprite = this.add.sprite(300, 400, 'player'); // Replace 'player' with actual asset key
    sprite.name = 'Enemy';
    sprite.scripts = [new EnemyScript()];
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
    expect(compileScene(state)).toBe(expectedCode);
  });

  it('should handle game objects with multiple scripts', () => {
    const state: AppState = {
        gameObjects: [
            { id: 1, name: 'Player', x: 100, y: 200, scripts: ['PlayerScript.ts', 'PowerUpScript.ts'] },
        ],
        selectedObjectId: null,
        scripts: ['PlayerScript.ts', 'PowerUpScript.ts'],
    };

    const expectedCode = `
import Phaser from 'phaser';
import React from 'react';
import PlayerScript from './PlayerScript';
import PowerUpScript from './PowerUpScript';

class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  preload() {
    // Preload assets here
    this.load.image('player', 'assets/player.png'); // Example asset
  }

  create() {
    const sprite = this.add.sprite(100, 200, 'player'); // Replace 'player' with actual asset key
    sprite.name = 'Player';
    sprite.scripts = [new PlayerScript(), new PowerUpScript()];
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

    expect(compileScene(state)).toBe(expectedCode);
  });

});
