import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { DesignCanvas } from '../components/canvas/DesignCanvas';

function App() {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Handle window resizing for responsive canvas container
  useEffect(() => {
    const handleResize = () => {
      // rough estimation for available space: window width - sidebar width (300) - margins
      const availableWidth = window.innerWidth - 300 - 48; // 24px padding on each side
      const availableHeight = window.innerHeight - 140; // top header/margins
      
      // Let's cap the max size to a standard size, but responsive if smaller
      setCanvasSize({
        width: Math.min(1080, availableWidth),
        height: Math.min(1080, availableHeight) // 1:1 format for Instagram by default
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        <header style={{ 
          height: 'var(--header-height)', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: 'var(--border-thick)',
          paddingBottom: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '36px', margin: 0, textShadow: '2px 2px 0 var(--primary)' }}>
              DESIGNER PRO
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>Unrefined. Bold. Brutal.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontWeight: 'bold' }}>{canvasSize.width}x{canvasSize.height}</span>
          </div>
        </header>

        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflow: 'auto', // Allow scrolling if canvas is bigger than screen
        }}>
          <DesignCanvas width={canvasSize.width} height={canvasSize.height} />
        </div>
        
        <PropertiesPanel />
      </main>
    </div>
  );
}

export default App;
