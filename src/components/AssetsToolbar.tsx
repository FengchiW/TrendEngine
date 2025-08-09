import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../contexts/AppContext';

const AssetsToolbar = () => {
  const { project } = useContext(AppContext) as AppContextType;
  const [assets, setAssets] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      fetch(`http://localhost:3001/api/projects/${project.name}/assets`)
        .then((res) => res.json())
        .then((data) => setAssets(data))
        .catch((err) => console.error('Failed to fetch assets:', err));
    }
  }, [project]);

  return (
    <div className="bg-gray-800 p-2">
      <h2 className="text-lg font-bold mb-2">Assets</h2>
      <ul>
        {assets &&
          assets.map((asset) => <li key={asset}>{asset}</li>)}
      </ul>
    </div>
  );
};

export default AssetsToolbar;
