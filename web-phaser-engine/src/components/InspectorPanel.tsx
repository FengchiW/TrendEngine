import { useContext } from 'react';
import { AppContext, AppContextType, GameObject } from '../contexts/AppContext';

const InspectorPanel = () => {
  const {
    gameObjects,
    selectedObjectId,
    scripts,
    addScriptToGameObject,
  } = useContext(AppContext) as AppContextType;

  const selectedObject = gameObjects.find((obj) => obj.id === selectedObjectId);

  if (!selectedObject) {
    return (
      <div className="bg-gray-700 p-2">
        <h2 className="text-lg font-bold mb-2">Inspector</h2>
        <p>No object selected</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 p-2">
      <h2 className="text-lg font-bold mb-2">Inspector</h2>
      <div>
        <label className="block">Object Name</label>
        <input
          type="text"
          className="bg-gray-800 w-full p-1"
          defaultValue={selectedObject.name}
        />
      </div>
      <div className="mt-2">
        <label className="block">Position</label>
        <div className="flex gap-2">
          <input
            type="number"
            className="bg-gray-800 w-full p-1"
            defaultValue={selectedObject.x}
          />
          <input
            type="number"
            className="bg-gray-800 w-full p-1"
            defaultValue={selectedObject.y}
          />
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-md font-bold">Attached Scripts</h3>
        <ul>
          {selectedObject.scripts.map((script) => (
            <li key={script}>{script}</li>
          ))}
        </ul>
        <select
          className="bg-gray-800 w-full p-1 mt-1"
          onChange={(e) => addScriptToGameObject(selectedObject.id, e.target.value)}
        >
          <option>Add Script...</option>
          {scripts.map((script) => (
            <option key={script} value={script}>
              {script}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InspectorPanel;
