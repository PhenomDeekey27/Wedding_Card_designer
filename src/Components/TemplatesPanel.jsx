import React, { useEffect, useState } from 'react';
import { FaLayerGroup, FaSave } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const TemplatesPanel = ({ canvas }) => {
  const [templatesModal, setTemplatesModal] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);

  // Default templates - each contains JSON representation of a fabric canvas
  const defaultTemplates = [
    {
      id: 'template1',
      name: 'Wedding Invitation',
      thumbnail: '/template-thumbnails/wedding.png',
      canvasJson: {
        objects: [
          {
            type: 'rect',
            width: 400,
            height: 300,
            fill: '#f5f5dc',
            left: 200,
            top: 150
          },
          {
            type: 'i-text',
            text: 'You Are Invited',
            fontSize: 36,
            fontFamily: 'Times New Roman',
            fill: '#4b0082',
            left: 200,
            top: 100
          },
          {
            type: 'i-text',
            text: 'Jane & John',
            fontSize: 28,
            fontFamily: 'Georgia',
            fill: '#4b0082',
            left: 200,
            top: 150
          }
        ],
        background: '#ffffff'
      }
    },
    {
      id: 'template2',
      name: 'Birthday Party',
      thumbnail: '/template-thumbnails/birthday.png',
      canvasJson: {
        objects: [
          {
            type: 'rect',
            width: 400,
            height: 300,
            fill: '#ffebcd',
            left: 200,
            top: 150
          },
          {
            type: 'i-text',
            text: 'Birthday Celebration!',
            fontSize: 32,
            fontFamily: 'Arial',
            fill: '#ff4500',
            left: 200,
            top: 100
          }
        ],
        background: '#ffffff'
      }
    },
    {
      id: 'template3',
      name: 'Baby Shower',
      thumbnail: '/template-thumbnails/babyshower.png',
      canvasJson: {
        objects: [
          {
            type: 'rect',
            width: 400,
            height: 300,
            fill: '#e6e6fa',
            left: 200,
            top: 150
          },
          {
            type: 'i-text',
            text: 'Baby Shower',
            fontSize: 36,
            fontFamily: 'Verdana',
            fill: '#9370db',
            left: 200,
            top: 100
          }
        ],
        background: '#ffffff'
      }
    },
    {
      id: 'template4',
      name: 'Anniversary',
      thumbnail: '/template-thumbnails/anniversary.png',
      canvasJson: {
        objects: [
          {
            type: 'rect',
            width: 400,
            height: 300,
            fill: '#faf0e6',
            left: 200,
            top: 150
          },
          {
            type: 'i-text',
            text: 'Happy Anniversary',
            fontSize: 36,
            fontFamily: 'Georgia',
            fill: '#8b0000',
            left: 200,
            top: 100
          }
        ],
        background: '#ffffff'
      }
    },
  ];

 

  const applyTemplate = (template) => {
    if (!canvas) return;
  
    console.log('Loading template:', template);
  
    // Clear the canvas before applying a new template
    canvas.clear();
  
    // Load the template JSON
    canvas.loadFromJSON(template.canvasJson, () => {
      console.log('Template loaded successfully');
  
      // Canvas dimensions
      const canvasWidth = canvas.width || 800;
      const canvasHeight = canvas.height || 600;
  
      // Get bounding box of loaded objects
      const objects = canvas.getObjects();
      const boundingRect = canvas.getObjectsBoundingBox();
  
      const templateWidth = boundingRect.width || canvasWidth;
      const templateHeight = boundingRect.height || canvasHeight;
  
      // Calculate scale factor to fit template to canvas
      const scaleX = canvasWidth / templateWidth;
      const scaleY = canvasHeight / templateHeight;
      const scaleFactor = Math.min(scaleX, scaleY);
  
      // Apply scaling and reposition objects
      objects.forEach((obj) => {
        obj.scaleX *= scaleFactor;
        obj.scaleY *= scaleFactor;
        obj.left *= scaleFactor;
        obj.top *= scaleFactor;
        obj.setCoords();
      });
  
      // Set canvas background correctly
      canvas.setBackgroundColor(template.canvasJson.background || '#ffffff', canvas.renderAll.bind(canvas));
  
      // Render and update canvas
      canvas.renderAll();
      setTemplatesModal(false);
    });
  };
  
  
  const saveAsTemplate = () => {
    if (!canvas) return;
    
    // Create a name for the template
    const templateName = prompt("Enter a name for this template:", "My Custom Template");
    if (!templateName) return;
    
    // Get canvas JSON
    const canvasJson = canvas.toJSON();
    
    // Create thumbnail from current canvas
    const thumbnailDataUrl = canvas.toDataURL({
      format: 'png',
      quality: 0.5,
      multiplier: 0.3 // Scale down for thumbnail
    });
    
    // Create new template object
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      thumbnail: thumbnailDataUrl,
      canvasJson: canvasJson
    };
    
    // Add to custom templates
    setCustomTemplates(prev => [...prev, newTemplate]);
    
    // Save to localStorage for persistence
    const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    savedTemplates.push(newTemplate);
    localStorage.setItem('customTemplates', JSON.stringify(savedTemplates));
    
    alert(`Template "${templateName}" saved successfully!`);
  };
  
  const deleteTemplate = (templateId) => {
    // Remove from state
    setCustomTemplates(prev => prev.filter(template => template.id !== templateId));
    
    // Remove from localStorage
    const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    const updatedTemplates = savedTemplates.filter(template => template.id !== templateId);
    localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));
  };
  
  // Load custom templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    setCustomTemplates(savedTemplates);
  }, []);

  return (
    <>
      {/* Template Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setTemplatesModal(true)}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="templates"
        >
          <FaLayerGroup />
          <Tooltip id="templates">Templates</Tooltip>
        </button>
        
        <button
          onClick={saveAsTemplate}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="saveTemplate"
        >
          <FaSave />
          <Tooltip id="saveTemplate">Save as Template</Tooltip>
        </button>
      </div>

      {/* Templates Modal */}
      {templatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Templates</h2>
              <button 
                onClick={() => setTemplatesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Default Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {defaultTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className="border rounded-lg p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => applyTemplate(template)}
                  >
                    <div className="bg-gray-200 h-32 mb-2 flex items-center justify-center overflow-hidden">
                      {template.thumbnail ? (
                        <img 
                          src={template.thumbnail} 
                          alt={template.name} 
                          className="max-h-full max-w-full object-contain" 
                        />
                      ) : (
                        <div className="text-gray-500">[Preview]</div>
                      )}
                    </div>
                    <p className="text-center font-medium">{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {customTemplates.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Your Templates</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {customTemplates.map((template) => (
                    <div 
                      key={template.id}
                      className="relative border rounded-lg p-2 cursor-pointer hover:bg-gray-100"
                    >
                      <div 
                        className="bg-gray-200 h-32 mb-2 flex items-center justify-center overflow-hidden"
                        onClick={() => applyTemplate(template)}
                      >
                        {template.thumbnail ? (
                          <img 
                            src={template.thumbnail} 
                            alt={template.name} 
                            className="max-h-full max-w-full object-contain" 
                          />
                        ) : (
                          <div className="text-gray-500">[Preview]</div>
                        )}
                      </div>
                      <p className="text-center font-medium">{template.name}</p>
                      <button 
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete template "${template.name}"?`)) {
                            deleteTemplate(template.id);
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TemplatesPanel;