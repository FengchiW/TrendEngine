import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';

const ProjectSelection = () => {
  const { projects, fetchProjects, createProject, selectProject } = useContext(AppContext) as AppContextType;
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = () => {
    if (projectName.trim()) {
      createProject(projectName.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-8">Game Engine</h1>
      <div className="bg-gray-700 p-8 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
        <div className="flex">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-gray-800 w-full p-2 mb-4"
            placeholder="Project name"
          />
          <button
            onClick={handleCreateProject}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 ml-2"
          >
            Create
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Project</h2>
          <ul>
            {projects.map((project) => (
              <li
                key={project}
                className="p-2 hover:bg-gray-600 cursor-pointer"
                onClick={() => selectProject(project)}
              >
                {project}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelection;
