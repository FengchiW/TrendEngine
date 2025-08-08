import { useContext } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';

const HierarchyPanel = () => {
  const { gameObjects, addGameObject, selectGameObject, selectedObjectId } = useContext(AppContext) as AppContextType;

  return (
    <div className="bg-gray-700 p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Hierarchy</h2>
        <button
          onClick={() => addGameObject('New GameObject')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          +
        </button>
      </div>
      <ul>
        {gameObjects.map((obj) => (
          <li
            key={obj.id}
            onClick={() => selectGameObject(obj.id)}
            className={`p-1 hover:bg-gray-600 cursor-pointer ${
              selectedObjectId === obj.id ? 'bg-blue-600' : ''
            }`}
          >
            {obj.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HierarchyPanel;
