import React, { useRef } from 'react';
import { Square, Circle, Triangle, Type, Image as ImageIcon, Download } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';
import { Panel } from './ui/Panel';
import { Button } from './ui/Button';

export const Sidebar: React.FC = () => {
  const addElement = useCanvasStore((state) => state.addElement);
  

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRect = () => {
    addElement({
      type: 'rect',
      x: 100,
      y: 100,
      width: 150,
      height: 100,
      fill: 'var(--primary)',
      stroke: '#000000',
      strokeWidth: 4,
      rotation: 0,
    });
  };

  const handleAddCircle = () => {
    addElement({
      type: 'circle',
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      fill: 'var(--secondary)',
      stroke: '#000000',
      strokeWidth: 4,
      rotation: 0,
    });
  };

  const handleAddTriangle = () => {
    addElement({
      type: 'triangle',
      x: 300,
      y: 300,
      width: 120,
      height: 120,
      fill: 'var(--tertiary)',
      stroke: '#000000',
      strokeWidth: 4,
      rotation: 0,
    });
  };

  const handleAddText = () => {
    addElement({
      type: 'text',
      x: 150,
      y: 150,
      width: 200,
      height: 50,
      text: 'NEO BRUTAL',
      fill: '#000000',
      rotation: 0,
      fontSize: 48,
      fontFamily: 'Space Mono',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          // Scale down if too large
          const scale = Math.min(1, 600 / img.width);
          addElement({
            type: 'image',
            x: 50,
            y: 50,
            width: img.width * scale,
            height: img.height * scale,
            src: img.src,
            rotation: 0,
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    // We expect the user to integrate actual Konva stage ref, but
    // retrieving via document id and Konva.stages works too.
    // Better yet, pass a custom event or simply access window.Konva
    const konvaStage = (window as any).Konva?.stages[0];
    if (konvaStage) {
      const dataURL = konvaStage.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'neobrutal-design.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Export functionality requires a stage reference. (Implementation note: bind stage ref to global)");
    }
  };

  return (
    <Panel 
      style={{ 
        width: 'var(--sidebar-width)', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        overflowY: 'auto'
      }}
    >
      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Button variant="primary" onClick={handleAddRect} title="Rectangle">
            <Square size={20} /> Rect
          </Button>
          <Button variant="secondary" onClick={handleAddCircle} title="Circle">
            <Circle size={20} /> Circ
          </Button>
          <Button variant="tertiary" onClick={handleAddTriangle} title="Triangle">
            <Triangle size={20} /> Tri
          </Button>
          <Button variant="accent" onClick={handleAddText} title="Text">
            <Type size={20} /> Text
          </Button>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Media</h2>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImageUpload}
        />
        <Button 
          variant="neutral" 
          style={{ width: '100%' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={20} /> Upload Image
        </Button>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Actions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button variant="primary" style={{ width: '100%' }} onClick={handleExport}>
            <Download size={20} /> Export PNG
          </Button>
        </div>
      </div>
    </Panel>
  );
};
