import { useContext } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';

const SceneView = () => {
  const { gameObjects, updateGameObjectPosition, selectGameObject } = useContext(AppContext) as AppContextType;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData('gameObjectId', id.toString());
    selectGameObject(id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('gameObjectId'), 10);
    const sceneView = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - sceneView.left;
    const y = e.clientY - sceneView.top;
    updateGameObjectPosition(id, x, y);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="bg-gray-800 flex-grow p-4 relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="bg-black w-full h-full border border-gray-600 relative">
        {gameObjects.map((obj) => (
          <div
            key={obj.id}
            draggable
            onDragStart={(e) => handleDragStart(e, obj.id)}
            style={{
              position: 'absolute',
              left: obj.x,
              top: obj.y,
              cursor: 'move',
              padding: '8px',
              backgroundColor: 'red',
            }}
          >
            {obj.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SceneView;
