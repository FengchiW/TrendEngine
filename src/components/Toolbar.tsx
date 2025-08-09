import { useContext, useState } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';
import Modal from './Modal';
import SceneToolbar from './SceneToolbar';
import AssetsToolbar from './AssetsToolbar';

/**
 * The toolbar component at the top of the editor.
 * Contains buttons for creating new scenes and building the project.
 */
const Toolbar = () => {
  const appState = useContext(AppContext) as AppContextType;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [compiledCode, setCompiledCode] = useState('');
  const [showSceneToolbar, setShowSceneToolbar] = useState(false);
  const [showAssetsToolbar, setShowAssetsToolbar] = useState(false);

  /**
   * Handles the "Build Project" button click.
   * Sends the current scene state to the backend for compilation.
   */
  const handleBuild = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appState),
      });
      const data = await response.json();
      setCompiledCode(data.code);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to compile scene:', error);
      alert('Failed to compile scene. Is the server running?');
    }
  };

  return (
    <>
      <div className="bg-gray-700 p-2 flex gap-2" role="toolbar">
        <button
          onClick={() => setShowSceneToolbar(!showSceneToolbar)}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Scene
        </button>
        <button
          onClick={() => setShowAssetsToolbar(!showAssetsToolbar)}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Assets
        </button>
        <button
          onClick={handleBuild}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Build Project
        </button>
      </div>
      {showSceneToolbar && <SceneToolbar />}
      {showAssetsToolbar && <AssetsToolbar />}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Compiled Scene Code"
      >
        <pre className="text-sm whitespace-pre-wrap">{compiledCode}</pre>
      </Modal>
    </>
  );
};

export default Toolbar;
