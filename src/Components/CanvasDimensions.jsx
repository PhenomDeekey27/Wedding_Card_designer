

import React, { useEffect, useState } from "react";
import * as fabric from "fabric"; // v6
import { FaSquare } from "react-icons/fa";
import { BiRectangle } from "react-icons/bi";
import { FaCropSimple } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

const CanvasDimensions = ({ canvas }) => {
  const [canvasWidth, setCanvasWidth] = useState(640);
  const [canvasHeight, setCanvasHeight] = useState(360);
  const [toggleVisiblity, setToggleVisiblity] = useState(false);

  // Templates with aspect ratios
  const templates = [
    {
      name: "Landscape (16:9)",
      ratio: 16 / 9,
      icon: <BiRectangle size={24} />,
    },
    {
      name: "Square (1:1)",
      ratio: 1,
      icon: <FaSquare size={20} />,
    },
  ];
  // Update Canvas Dimensions
  useEffect(() => {
    // Function to set initial responsive canvas size
    const updateCanvasSize = () => {
      if (!canvas) return;

      const screenWidth = window.innerWidth * 0.8; // 90% of screen width
      const screenHeight = window.innerHeight * 0.8; // 80% of screen height

      setCanvasWidth(screenWidth);
      setCanvasHeight(screenHeight);

      canvas.setDimensions({ width: screenWidth, height: screenHeight });
      scaleAndCenterImage(canvas);
      canvas.renderAll();
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [canvas]);


  //handles image size according to canvas width and height

  // Helper to scale and fit image to canvas dimensions
  
  const scaleAndCenterImage = (canvas) => {
    const objects = canvas.getObjects();
  
    objects.forEach((obj) => {
      // Check if the object is the background or main image
      if (obj.type === "image" && obj.background) {
        // Scale to fit canvas dimensions
        const scaleX = canvas.width / obj.width;
        const scaleY = canvas.height / obj.height;
        const scale = Math.min(scaleX, scaleY);
  
        obj.scale(scale);
  
        // Center the image after resizing
        obj.set({
          left: (canvas.width - obj.width * scale) / 2,
          top: (canvas.height - obj.height * scale) / 2,
          selectable: false, // Keep background image unselectable
          evented: false, // Disable interaction with background
        });
  
        obj.setCoords();
      }
    });
  
    canvas.renderAll();
  };
  



  // Handle Custom Input Changes
  const handleWidthChange = (e) => {
    const value = Math.max(100, parseInt(e.target.value, 10) || 100);

    setCanvasWidth(value);
    if (canvas) {
      canvas.setWidth(value);
      scaleAndCenterImage(canvas);
      canvas.renderAll();
    }
  };

  const handleHeightChange = (e) => {
    const value = Math.max(100, parseInt(e.target.value, 10) || 100);
    setCanvasHeight(value);
    if (canvas) {
      canvas.setHeight(value);
      scaleAndCenterImage(canvas);
      canvas.renderAll();
    }
  };

  // Apply template while keeping it responsive
  const applyTemplate = (template) => {
    if (!canvas) return;

    const screenWidth = window.innerWidth * 0.9; // 90% of screen width
    const screenHeight = window.innerHeight * 0.8; // 80% of screen height

    let width, height;
    if (screenWidth / screenHeight > template.ratio) {
      height = screenHeight;
      width = height * template.ratio;
    } else {
      width = screenWidth;
      height = width / template.ratio;
    }

    setCanvasWidth(width);
    setCanvasHeight(height);
    canvas.setDimensions({ width, height });
    scaleAndCenterImage(canvas);
    canvas.renderAll();
  };

  return (
    <div className="">
      {/* Predefined Templates */}
      <div className="flex md:flex-col gap-4 justify-center">
        {templates.map((template, index) => (
          <button
            key={index}
            className="bg-indigo-700 hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
            title={template.name}
            onClick={() => applyTemplate(template)}
            data-tooltip-id={template.name}
          >
            {template.icon}
            <Tooltip id={template.name} place="top" delayShow={0}>
              {template.name}
            </Tooltip>
          </button>
        ))}

        
      <button
        className="bg-indigo-700 hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
        onClick={() =>
          document.getElementById("modal").classList.toggle("hidden")
        }
        data-tooltip-id="custom-canvas"
      >
        <FaCropSimple />
        <Tooltip id="custom-canvas" place="top" delayShow={0}>
          Custom Dimensions
        </Tooltip>
      </button>

      </div>


      <div
        id="modal"
        tabindex="-1"
        class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div class="relative p-4 w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="modal"
              onClick={() =>
                document.getElementById("modal").classList.toggle("hidden")
              }
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
            <div class="p-4 md:p-5 text-center">
              <div className="bg-gray-700 text-white p-4 mt-2 rounded-md w-full max-w-xs mx-auto md:mx-0">
                <div className="mt-2">
                  <label className="block text-sm">Canvas Width</label>
                  <input
                    type="number"
                    value={canvasWidth}
                    onChange={handleWidthChange}
                    className="w-full border p-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm">Canvas Height</label>
                  <input
                    type="number"
                    value={canvasHeight}
                    onChange={handleHeightChange}
                    className="w-full border p-2 rounded bg-gray-800 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasDimensions;
