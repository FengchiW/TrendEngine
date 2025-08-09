import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';

const SceneToolbar = () => {
  const { project } = useContext(AppContext) as AppContextType;
  const [scenes, setScenes] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      fetch(`http://localhost:3001/api/projects/${project.name}/scenes`)
        .then((res) => res.json())
        .then((data) => setScenes(data))
        .catch((err) => console.error('Failed to fetch scenes:', err));
    }
  }, [project]);

  return (
    <div className="bg-gray-800 p-2">
      <h2 className="text-lg font-bold mb-2">Scenes</h2>
      <ul>
        {scenes &&
          scenes.map((scene) => <li key={scene}>{scene}</li>)}
      </ul>
    </div>
  );
};

export default SceneToolbar;
