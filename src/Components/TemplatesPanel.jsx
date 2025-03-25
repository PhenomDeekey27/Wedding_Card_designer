import React, { useEffect, useState } from 'react';
import { FaLayerGroup, FaSave } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import * as fabric from "fabric"; // v6
import uploadToCloudinary from '../utils/ImageUpload';

const TemplatesPanel = ({ canvas , bgFile }) => {
  const [templatesModal, setTemplatesModal] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);



  // Default templates - each contains JSON representation of a fabric canvas
  const defaultTemplates = [
    
  ];

 

const applyTemplate = (template) => {
  if (!canvas) return;



  // Get template dimensions
  const templateWidth = template.canvasJson.width || canvas.getWidth();
  const templateHeight = template.canvasJson.height || canvas.getHeight();

  // Resize canvas to fit template dimensions
  canvas.setWidth(templateWidth);
  canvas.setHeight(templateHeight);
  canvas.calcOffset(); // Recalculate offsets immediately

  // Check if background image is available in the template
  if (template.canvasJson.backgroundImage?.src) {
    fabric.Image.fromURL(template.canvasJson.backgroundImage.src, (img) => {
      img.set({
        scaleX: template.canvasJson.backgroundImage.scaleX || 1,
        scaleY: template.canvasJson.backgroundImage.scaleY || 1,
        top: template.canvasJson.backgroundImage.top || 0,
        left: template.canvasJson.backgroundImage.left || 0,
        selectable: true, // Make it movable and editable
        evented: true, // Enable interactions
        hasControls: true, // Allow resizing/rotation
        lockUniScaling: true, // Optional: keep aspect ratio while scaling
      });

      // Add the image as a normal object at the bottom
      canvas.add(img);
      canvas.sendToBack(img); // Send background image to back
      canvas.renderAll();
   
    });
  }

  // Load the rest of the template AFTER background is applied
  canvas.loadFromJSON(template.canvasJson, () => {
    

    // Force re-render after applying the template
    setTimeout(() => {
      canvas.renderAll(); // Force immediate re-render
      canvas.calcOffset(); // Recalculate canvas offsets
      canvas.requestRenderAll(); // Extra safety to re-render everything
    }, 50);

    // Close the template modal
    setTemplatesModal(false);
  });
};


  const saveAsTemplate = async() => {
    if (!canvas) return;

    let bgUrl=null

    if (bgFile) {
      bgUrl = await uploadToCloudinary(bgFile);
      if (!bgUrl) {
        alert("❌ Failed to upload background. Please try again.");
        return;
      }
    }

  
    // Create a name for the template
    const templateName = prompt("Enter a name for this template:", "My Custom Template");
    if (!templateName) return;
  
    // Get canvas JSON and dimensions
    const canvasJson = canvas.toJSON();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    canvasJson.src=bgUrl

  
    // Include dimensions in the JSON
    const templateWithDimensions = {
      ...canvasJson,
      width: canvasWidth,
      height: canvasHeight,
    };
  
    // Create thumbnail from current canvas
    const thumbnailDataUrl = canvas.toDataURL({
      format: 'png',
      quality: 0.5,
      multiplier: 0.3, // Scale down for thumbnail
    });

  
    // Create new template object
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      thumbnail: thumbnailDataUrl,
      canvasJson: templateWithDimensions,
      backgroundUrl:bgUrl
    };


  
    // Update state first
    setCustomTemplates((prev) => {
      const updatedTemplates = [...prev, newTemplate];
  
      // Save updated templates to localStorage
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates));
      return updatedTemplates;
    });
  
    alert(`Template "${templateName}" saved successfully!`);
    // Clear bgFile after upload

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
      <div className="flex flex-row md:flex-col gap-4">
        <button
          onClick={() => setTemplatesModal(true)}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="templates"
        >
          <FaLayerGroup />
          <Tooltip id="templates" positionStrategy="fixed">Templates</Tooltip>
        </button>
        
        <button
          onClick={saveAsTemplate}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="saveTemplate"
        >
          <FaSave />
          <Tooltip id="saveTemplate" positionStrategy="fixed">Save as Template</Tooltip>
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