import React, { useEffect, useRef, useContext, useState } from 'react';
import Phaser from 'phaser';

import { AppContext, AppContextType } from '../contexts/AppContext';


const SceneView = () => {
  // Use a state to hold the Phaser scene instance. This is crucial for
  // being able to pass updates from React to Phaser.
  const [phaserScene, setPhaserScene] = useState<Phaser.Scene | null>(null);
  // Use state to hold the dimensions for responsive behavior.
  const [gameDimensions, setGameDimensions] = useState({ width: 0, height: 0 });
  const gameContainer = useRef<HTMLDivElement>(null);
  // Using the actual context from your application
  const { gameObjects, updateGameObjectPosition, selectGameObject } = useContext(AppContext) as AppContextType;
  const game = useRef<Phaser.Game | null>(null);

  // This useEffect hook is responsible for setting up the ResizeObserver ONCE.
  // The empty dependency array ensures it runs only on mount.
  useEffect(() => {
    console.log("useEffect 1 (mount) triggered. Setting up ResizeObserver.");
    if (!gameContainer.current) {
      console.log("gameContainer.current is null, returning from mount effect.");
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === gameContainer.current) {
          const { width, height } = entry.contentRect;
          console.log(`ResizeObserver fired. New dimensions: ${width}x${height}`);
          setGameDimensions({ width, height });
          if (game.current) {
            console.log("Resizing existing game instance.");
            game.current.scale.resize(width, height);
            phaserScene?.scale.refresh();
          }
        }
      }
    });

    resizeObserver.observe(gameContainer.current);

    return () => {
      console.log("useEffect 1 (cleanup) triggered. Disconnecting observer.");
      resizeObserver.disconnect();
      game.current?.destroy(true);
      game.current = null;
    };
  }, []);

  // This useEffect creates the game instance when dimensions are available.
  useEffect(() => {
    console.log("useEffect 2 (game creation) triggered.");
    if (game.current) {
      console.log("Game instance already exists, skipping creation.");
      return;
    }

    // A robust way to get dimensions, using a fallback if they are zero.
    let width = gameDimensions.width;
    let height = gameDimensions.height;

    // Check if both dimensions are valid from the ResizeObserver.
    if (width === 0 || height === 0) {
      console.warn("Container dimensions are 0. Using a fallback size.");
      width = 800;
      height = 600;
    }

    // Now, create the game with the guaranteed valid dimensions.
    console.log(`Attempting to create Phaser game with dimensions: ${width}x${height}`);
    
    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'main' });
      }

      preload() {
        console.log("MainScene preload");
      }

      create() {
        console.log("MainScene create called.");
        this.input.on('dragstart', (_pointer: any, gameObject: { name: string; }) => {
          selectGameObject(parseInt(gameObject.name));
          console.log(`dragstart: Selected object with id ${gameObject.name}`);
        });

        this.input.on('drag', (_pointer: any, gameObject: { x: number; y: number; }, dragX: number, dragY: number) => {
          gameObject.x = dragX;
          gameObject.y = dragY;
        });

        this.input.on('dragend', (_pointer: any, gameObject: { name: string; x: number; y: number; }) => {
          updateGameObjectPosition(parseInt(gameObject.name), gameObject.x, gameObject.y);
          console.log(`dragend: Updated object with id ${gameObject.name} to position ${gameObject.x}, ${gameObject.y}`);
        });

        setPhaserScene(this);
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: width,
      height: height,
      parent: gameContainer.current,
      scene: MainScene,
      backgroundColor: '#2d2d2d',
    };

    game.current = new Phaser.Game(config);
    console.log("Phaser.Game instance created successfully.");
  }, [gameDimensions, selectGameObject, updateGameObjectPosition]);

  // This useEffect hook is responsible for synchronizing the Phaser scene with the
  // React state (gameObjects).
  useEffect(() => {
    console.log("useEffect 3 (state sync) triggered.");
    if (!phaserScene) {
      console.log("phaserScene is not ready, returning from state sync.");
      return;
    }

    console.log(`Syncing with ${gameObjects.length} game objects.`);
    const existingSprites = new Map();
    phaserScene.children.each(child => {
      if (child.name) {
        existingSprites.set(parseInt(child.name), child);
      }
    });

    gameObjects.forEach(obj => {
      const existingSprite = existingSprites.get(obj.id);
      if (existingSprite) {
        existingSprite.setPosition(obj.x, obj.y);
        console.log(`Updating object with id ${obj.id}.`);
        existingSprites.delete(obj.id);
      } else {
        const newSprite = phaserScene.add.text(obj.x, obj.y, obj.name, { color: '#ffffff' }).setInteractive();
        newSprite.name = obj.id.toString();
        phaserScene.input.setDraggable(newSprite);
        console.log(`Creating new object with id ${obj.id}.`);
      }
    });

    existingSprites.forEach(sprite => {
      console.log(`Destroying old object with id ${sprite.name}.`);
      sprite.destroy();
    });
  }, [gameObjects, phaserScene]);

  return (
    <div className="bg-gray-800 flex-grow p-4 relative">
      <div ref={gameContainer} className="bg-black w-full h-full border border-gray-600" />
    </div>
  );
};

export default SceneView;
