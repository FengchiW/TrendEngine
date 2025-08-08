import { createContext, useState } from 'react';

/**
 * Represents a single game object in the scene.
 */
export interface GameObject {
  id: number;
  name: string;
  x: number;
  y: number;
  scripts: string[];
}

/**
 * Represents the entire state of the application.
 */
export interface Project {
  name: string;
}

/**
 * Represents the entire state of the application.
 */
export interface AppState {
  project: Project | null;
  projects: string[];
  gameObjects: GameObject[];
  selectedObjectId: number | null;
  scripts: string[];
}

/**
 * Defines the shape of the context, including the state and the functions to update it.
 */
export interface AppContextType extends AppState {
  fetchProjects: () => void;
  addGameObject: (name: string) => void;
  selectGameObject: (id: number) => void;
  updateGameObjectPosition: (id: number, x: number, y: number) => void;
  addScriptToGameObject: (id: number, script: string) => void;
  addScript: (name: string) => void;
  createProject: (name: string) => void;
}

// Create the React context.
export const AppContext = createContext<AppContextType | null>(null);

/**
 * The provider component that wraps the application and provides the context.
 */
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>({
    project: null,
    projects: [],
    gameObjects: [],
    selectedObjectId: null,
    scripts: [],
  });

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/projects');
      const projects = await response.json();
      setState((prevState) => ({ ...prevState, projects }));
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const createProject = async (name: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName: name }),
      });
      if (response.ok) {
        setState((prevState) => ({
          ...prevState,
          project: { name },
          gameObjects: [],
          selectedObjectId: null,
          scripts: [],
        }));
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const addGameObject = (name: string) => {
    setState((prevState) => ({
      ...prevState,
      gameObjects: [
        ...prevState.gameObjects,
        { id: Date.now(), name, x: 0, y: 0, scripts: [] },
      ],
    }));
  };

  const selectGameObject = (id: number) => {
    setState((prevState) => ({ ...prevState, selectedObjectId: id }));
  };

  const updateGameObjectPosition = (id: number, x: number, y: number) => {
    setState((prevState) => ({
      ...prevState,
      gameObjects: prevState.gameObjects.map((obj) =>
        obj.id === id ? { ...obj, x, y } : obj
      ),
    }));
  };

  const addScriptToGameObject = (id: number, script: string) => {
    setState((prevState) => ({
      ...prevState,
      gameObjects: prevState.gameObjects.map((obj) =>
        obj.id === id ? { ...obj, scripts: [...obj.scripts, script] } : obj
      ),
    }));
  };

  const addScript = (name: string) => {
    setState((prevState) => ({
      ...prevState,
      scripts: [...prevState.scripts, name],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        fetchProjects,
        addGameObject,
        selectGameObject,
        updateGameObjectPosition,
        addScriptToGameObject,
        addScript,
        createProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
