import React from 'react';
import { Stage, Layer } from 'react-konva';
import { useCanvasStore } from '../../store/useCanvasStore';
import { EditableElement } from './EditableElement';

interface Props {
  width: number;
  height: number;
}

export const DesignCanvas: React.FC<Props> = ({ width, height }) => {
  const elements = useCanvasStore((state) => state.elements);
  const selectedId = useCanvasStore((state) => state.selectedId);
  const selectElement = useCanvasStore((state) => state.selectElement);

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectElement(null);
    }
  };

  return (
    <div 
      className="canvas-container"
      style={{ 
        width, 
        height, 
        border: 'var(--border-thick)', 
        boxShadow: 'var(--shadow-lg)',
        backgroundColor: 'white',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Stage
        width={width}
        height={height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        id="konva-stage"
      >
        <Layer>
          {elements.map((el) => (
            <EditableElement
              key={el.id}
              element={el}
              isSelected={el.id === selectedId}
            />
          ))}
        </Layer>
      </Stage>
      
      {/* Grid Overlay for aesthetic purposes */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.5,
          zIndex: 0
        }}
      />
    </div>
  );
};
