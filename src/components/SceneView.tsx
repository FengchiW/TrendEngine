import React, { useEffect, useRef, useContext } from 'react';
import Phaser from 'phaser';
import { AppContext, AppContextType } from '../contexts/AppContext';

const SceneView = () => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const { gameObjects, updateGameObjectPosition, selectGameObject } = useContext(AppContext) as AppContextType;
  const game = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameContainer.current || game.current) {
      return;
    }

    const scene = new Phaser.Scene({
      key: 'main',
    });

    scene.create = function() {
      this.data.set('gameObjects', gameObjects);

      const updateObjects = () => {
        this.children.removeAll();
        const currentgameObjects = this.data.get('gameObjects');
        currentgameObjects.forEach((obj: any) => {
          const sprite = this.add.text(obj.x, obj.y, obj.name, { color: '#ffffff' }).setInteractive();
          sprite.name = obj.id.toString();
          this.input.setDraggable(sprite);
        });
      };

      updateObjects();

      this.events.on('updateObjects', updateObjects, this);

      this.input.on('dragstart', (_pointer: any, gameObject: { name: string; }) => {
        selectGameObject(parseInt(gameObject.name));
      });

      this.input.on('drag', (_pointer: any, gameObject: { x: any; y: any; }, dragX: any, dragY: any) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });

      this.input.on('dragend', (_pointer: any, gameObject: { name: string; x: number; y: number; }) => {
        updateGameObjectPosition(parseInt(gameObject.name), gameObject.x, gameObject.y);
      });
    };

    const config = {
      type: Phaser.AUTO,
      width: gameContainer.current.clientWidth,
      height: gameContainer.current.clientHeight,
      parent: gameContainer.current,
      scene: scene,
      backgroundColor: '#2d2d2d',
    };

    game.current = new Phaser.Game(config);

    return () => {
      game.current?.destroy(true);
      game.current = null;
    };
  }, [gameObjects, selectGameObject, updateGameObjectPosition]);

  return (
    <div className="bg-gray-800 flex-grow p-4 relative">
      <div ref={gameContainer} className="bg-black w-full h-full border border-gray-600" />
    </div>
  );
};

export default SceneView;
