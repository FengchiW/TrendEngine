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
  gameObjects: GameObject[];
  selectedObjectId: number | null;
  scripts: string[];
}

/**
 * Defines the shape of the context, including the state and the functions to update it.
 */
export interface AppContextType extends AppState {
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
    gameObjects: [],
    selectedObjectId: null,
    scripts: [],
  });

  const createProject = (name: string) => {
    setState((prevState) => ({
      ...prevState,
      project: { name },
      gameObjects: [],
      selectedObjectId: null,
      scripts: [],
    }));
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
