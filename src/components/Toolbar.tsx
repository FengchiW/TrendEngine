import { useContext, useState } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';
import Modal from './Modal';

/**
 * The toolbar component at the top of the editor.
 * Contains buttons for creating new scenes and building the project.
 */
const Toolbar = () => {
  const appState = useContext(AppContext) as AppContextType;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [compiledCode, setCompiledCode] = useState('');

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
          onClick={handleBuild}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Build Project
        </button>
      </div>
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
