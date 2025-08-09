import { useContext } from 'react';
import Toolbar from './components/Toolbar';
import HierarchyPanel from './components/HierarchyPanel';
import SceneView from './components/SceneView';
import InspectorPanel from './components/InspectorPanel';
import ProjectPanel from './components/ProjectPanel';
import { AppContext, AppContextType } from './contexts/AppContext';
import ProjectSelection from './components/ProjectSelection';
import SceneToolbar from './components/SceneToolbar';
import AssetsToolbar from './components/AssetsToolbar';

function App() {
  const { project } = useContext(AppContext) as AppContextType;

  if (!project) {
    return <ProjectSelection />;
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <Toolbar />
      <div className="flex flex-grow">
        <div className="w-1/5 min-w-[200px] flex flex-col">
          <HierarchyPanel />
          <ProjectPanel />
          <SceneToolbar />
        </div>
        <div className="w-3/5">
          <SceneView />
        </div>
        <div className="w-1/5 min-w-[200px]">
          <InspectorPanel />
        </div>
      </div>
      <AssetsToolbar />
    </div>
  );
}

export default App;
