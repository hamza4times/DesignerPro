import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ShapeType = 'rect' | 'circle' | 'triangle' | 'image' | 'text';

export interface CanvasElement {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rotation: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string; // for images
  filter?: 'none' | 'grayscale' | 'noise' | 'pixelate' | 'sepia';
  opacity?: number;
}

interface CanvasState {
  elements: CanvasElement[];
  selectedId: string | null;
  history: CanvasElement[][];
  historyStep: number;
  
  // Actions
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (id: string, attrs: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  
  // Initialize state
  setElements: (elements: CanvasElement[]) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  elements: [],
  selectedId: null,
  history: [[]],
  historyStep: 0,

  addElement: (element) => set((state) => {
    const newElement = { ...element, id: uuidv4() };
    const newElements = [...state.elements, newElement];
    const newHistory = state.history.slice(0, state.historyStep + 1);
    
    return {
      elements: newElements,
      selectedId: newElement.id,
      history: [...newHistory, newElements],
      historyStep: newHistory.length,
    };
  }),

  updateElement: (id, attrs) => set((state) => {
    const newElements = state.elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...attrs };
      }
      return el;
    });
    
    // Simple way to handle history: only push to history when interaction ends
    // For real performance, we should debounce history or push on dragEnd
    return { elements: newElements };
  }),

  deleteElement: (id) => set((state) => {
    const newElements = state.elements.filter((el) => el.id !== id);
    const newHistory = state.history.slice(0, state.historyStep + 1);
    return {
      elements: newElements,
      selectedId: null,
      history: [...newHistory, newElements],
      historyStep: newHistory.length,
    };
  }),

  selectElement: (id) => set({ selectedId: id }),

  bringToFront: (id) => set((state) => {
    const el = state.elements.find(e => e.id === id);
    if (!el) return state;
    const newElements = [...state.elements.filter(e => e.id !== id), el];
    return { elements: newElements };
  }),

  sendToBack: (id) => set((state) => {
    const el = state.elements.find(e => e.id === id);
    if (!el) return state;
    const newElements = [el, ...state.elements.filter(e => e.id !== id)];
    return { elements: newElements };
  }),

  undo: () => set((state) => {
    if (state.historyStep === 0) return state;
    const prevStep = state.historyStep - 1;
    return {
      elements: state.history[prevStep],
      historyStep: prevStep,
      selectedId: null,
    };
  }),

  redo: () => set((state) => {
    if (state.historyStep === state.history.length - 1) return state;
    const nextStep = state.historyStep + 1;
    return {
      elements: state.history[nextStep],
      historyStep: nextStep,
      selectedId: null,
    };
  }),

  setElements: (elements) => set({ elements, history: [elements], historyStep: 0, selectedId: null }),
}));
