import React from 'react';
import { Trash2, BringToFront, SendToBack } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';
import { Panel } from './ui/Panel';
import { Button } from './ui/Button';

export const PropertiesPanel: React.FC = () => {
  const selectedId = useCanvasStore((state) => state.selectedId);
  const elements = useCanvasStore((state) => state.elements);
  const updateElement = useCanvasStore((state) => state.updateElement);
  const deleteElement = useCanvasStore((state) => state.deleteElement);
  const bringToFront = useCanvasStore((state) => state.bringToFront);
  const sendToBack = useCanvasStore((state) => state.sendToBack);

  const selectedElement = elements.find((el) => el.id === selectedId);

  if (!selectedElement) {
    return null; /* Return null if nothing is selected or maybe a placeholder */
  }

  const handleColorChange = (type: 'fill' | 'stroke', color: string) => {
    updateElement(selectedElement.id, { [type]: color });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement(selectedElement.id, { text: e.target.value });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateElement(selectedElement.id, { filter: e.target.value as any });
  };

  return (
    <Panel 
      style={{ 
        width: '300px', 
        position: 'absolute',
        right: '20px',
        top: '100px',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        zIndex: 10
      }}
    >
      <h2 style={{ fontSize: '20px' }}>Properties</h2>

      {selectedElement.type === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>Text Content</label>
          <input 
            type="text" 
            value={selectedElement.text || ''} 
            onChange={handleTextChange} 
          />
        </div>
      )}

      {['rect', 'circle', 'triangle', 'text'].includes(selectedElement.type) && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Fill Color</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['var(--primary)', 'var(--secondary)', 'var(--tertiary)', 'var(--accent)', '#000000', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange('fill', color)}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: color,
                    border: 'var(--border-thin)',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Stroke Width: {selectedElement.strokeWidth}</label>
            <input 
              type="range" 
              min="0" max="20" 
              value={selectedElement.strokeWidth || 0}
              onChange={(e) => updateElement(selectedElement.id, { strokeWidth: parseInt(e.target.value) })}
            />
          </div>
        </>
      )}

      {selectedElement.type === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>Filter</label>
          <select 
            value={selectedElement.filter || 'none'} 
            onChange={handleFilterChange}
          >
            <option value="none">None</option>
            <option value="grayscale">Grayscale</option>
            <option value="noise">Brutal Noise</option>
            <option value="pixelate">Pixelate</option>
            <option value="sepia">Sepia Grunge</option>
          </select>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontWeight: 'bold' }}>Layering</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="neutral" onClick={() => bringToFront(selectedElement.id)} style={{ flex: 1 }}>
            <BringToFront size={18} /> Front
          </Button>
          <Button variant="neutral" onClick={() => sendToBack(selectedElement.id)} style={{ flex: 1 }}>
            <SendToBack size={18} /> Back
          </Button>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: 'var(--border-thick)' }}>
        <Button 
          variant="accent" 
          onClick={() => deleteElement(selectedElement.id)}
          style={{ width: '100%' }}
        >
          <Trash2 size={18} /> Delete Element
        </Button>
      </div>

    </Panel>
  );
};
