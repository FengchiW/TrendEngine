import { useContext, useState } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';

const ProjectPanel = () => {
  const { scripts, addScript } = useContext(AppContext) as AppContextType;
  const [newScriptName, setNewScriptName] = useState('');

  const handleAddScript = () => {
    if (newScriptName.trim()) {
      addScript(newScriptName.trim() + '.ts');
      setNewScriptName('');
    }
  };

  return (
    <div className="bg-gray-700 p-2 mt-2">
      <h2 className="text-lg font-bold mb-2">Project</h2>
      <div>
        <h3 className="text-md font-bold">Scripts</h3>
        <ul>
          {scripts.map((script) => (
            <li key={script} className="p-1 hover:bg-gray-600 cursor-pointer">
              {script}
            </li>
          ))}
        </ul>
        <div className="flex mt-2">
          <input
            type="text"
            value={newScriptName}
            onChange={(e) => setNewScriptName(e.target.value)}
            className="bg-gray-800 w-full p-1"
            placeholder="New script name"
          />
          <button
            onClick={handleAddScript}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-1"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPanel;
