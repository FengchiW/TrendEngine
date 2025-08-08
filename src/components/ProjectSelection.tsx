import { useContext, useState } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';

const ProjectSelection = () => {
  const { createProject } = useContext(AppContext) as AppContextType;
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = () => {
    if (projectName.trim()) {
      createProject(projectName.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-8">Game Engine</h1>
      <div className="bg-gray-700 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-gray-800 w-full p-2 mb-4"
          placeholder="Project name"
        />
        <button
          onClick={handleCreateProject}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Create Project
        </button>
      </div>
    </div>
  );
};

export default ProjectSelection;
