import React, { useRef, useEffect, useState } from 'react';
import { Shape, Rect, Circle, Text, Image as KonvaImage, Transformer, RegularPolygon } from 'react-konva';
import useImage from 'use-image';
import { useCanvasStore, type CanvasElement } from '../../store/useCanvasStore';
import Konva from 'konva';

interface Props {
  element: CanvasElement;
  isSelected: boolean;
}

export const EditableElement: React.FC<Props> = ({ element, isSelected }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  
  const selectElement = useCanvasStore((state) => state.selectElement);
  const updateElement = useCanvasStore((state) => state.updateElement);
  
  // Custom image loading hook for Konva
  const [image] = useImage(element.src || '');

  // Attach transformer
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Apply filters to image when loaded
  useEffect(() => {
    if (image && shapeRef.current && element.type === 'image') {
      applyFilter();
    }
  }, [image, element.filter]);

  const applyFilter = () => {
    const node = shapeRef.current;
    if (!node) return;
    
    // Clear filters
    node.filters([]);
    
    if (element.filter === 'grayscale') {
      node.filters([Konva.Filters.Grayscale]);
    } else if (element.filter === 'noise') {
      node.filters([Konva.Filters.Noise]);
      node.noise(0.5); // heavy noise for brutalism
    } else if (element.filter === 'pixelate') {
      node.filters([Konva.Filters.Pixelate]);
      node.pixelSize(10);
    } else if (element.filter === 'sepia') {
      node.filters([Konva.Filters.Sepia]);
    }
    
    node.cache();
  };

  const handleDragEnd = (e: any) => {
    updateElement(element.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    updateElement(element.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(element.type === 'text' ? 5 : 5, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };

  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    fill: element.fill,
    stroke: element.stroke,
    strokeWidth: element.strokeWidth,
    rotation: element.rotation || 0,
    draggable: true,
    opacity: element.opacity || 1,
    onClick: () => selectElement(element.id),
    onTap: () => selectElement(element.id),
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    ref: shapeRef,
  };

  const renderShape = () => {
    switch (element.type) {
      case 'rect':
        return <Rect {...commonProps} />;
      case 'circle':
        // Konva circles use radius, but we store width/height
        return (
          <Circle 
            {...commonProps} 
            radius={element.width / 2} 
            offset={{ x: -element.width / 2, y: -element.width / 2 }} // normalize Origin
          />
        );
      case 'triangle':
        return (
          <RegularPolygon
            {...commonProps}
            sides={3}
            radius={element.width / 2}
            offset={{ x: -element.width / 2, y: -element.width / 2 }}
          />
        );
      case 'text':
        return (
          <Text
            {...commonProps}
            text={element.text || 'TEXT'}
            fontSize={element.fontSize || 32}
            fontFamily={element.fontFamily || 'Space Mono'}
            fontStyle="bold"
            align="left"
            verticalAlign="middle"
          />
        );
      case 'image':
        return image ? (
          <KonvaImage
            {...commonProps}
            image={image}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          anchorStroke="black"
          anchorFill="var(--primary)"
          anchorSize={12}
          borderStroke="black"
          borderStrokeWidth={3}
          borderDash={[6, 4]}
        />
      )}
    </>
  );
};
