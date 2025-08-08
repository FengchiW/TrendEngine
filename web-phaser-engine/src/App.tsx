import Toolbar from './components/Toolbar';
import HierarchyPanel from './components/HierarchyPanel';
import SceneView from './components/SceneView';
import InspectorPanel from './components/InspectorPanel';
import ProjectPanel from './components/ProjectPanel';

function App() {
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <Toolbar />
      <div className="flex flex-grow">
        <div className="w-1/5 min-w-[200px] flex flex-col">
          <HierarchyPanel />
          <ProjectPanel />
        </div>
        <div className="w-3/5">
          <SceneView />
        </div>
        <div className="w-1/5 min-w-[200px]">
          <InspectorPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
