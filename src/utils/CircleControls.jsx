import React, { useEffect,useState } from "react";

const CircleControls = ({ SelectedObject ,setcircleModal , circleModal }) => {
  const [radius, setRadius] = useState(SelectedObject?.radius || 50);
  const [strokeWidth, setStrokeWidth] = useState(
    SelectedObject?.strokeWidth || 1
  );
  const [strokeColor, setStrokeColor] = useState(
    SelectedObject?.stroke || "#000000"
  );
  const [opacity, setOpacity] = useState(SelectedObject?.opacity || 1);
  const [angle, setAngle] = useState(SelectedObject?.angle || 0);
  const [circleColor, setcircleColor] = useState(null);

  // Handle Radius Change for Circle
  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value, 10);
    setRadius(newRadius);
    if (SelectedObject) {
      SelectedObject.set({ radius: newRadius });
      SelectedObject.canvas.renderAll();
    }
  };

  // Handle Stroke Width Change for Circle
  const handleStrokeWidthChange = (e) => {
    const newStrokeWidth = parseInt(e.target.value, 10);
    setStrokeWidth(newStrokeWidth);
    if (SelectedObject) {
      SelectedObject.set({ strokeWidth: newStrokeWidth });
      SelectedObject.canvas.renderAll();
    }
  };

  // Handle Stroke Color Change for Circle
  const handleStrokeColorChange = (e) => {
    const newStrokeColor = e.target.value;
    setStrokeColor(newStrokeColor);
    if (SelectedObject) {
      SelectedObject.set({ stroke: newStrokeColor });
      SelectedObject.canvas.renderAll();
    }
  };

  // Handle Fill Color Change for Circle
  const CircleColorChange = (e) => {
    const newColor = e.target.value;
    setcircleColor(newColor);
    if (SelectedObject) {
      SelectedObject.set({ fill: newColor });
      SelectedObject.canvas.renderAll();
    }
  };

  // Handle Opacity Change for Circle
  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacity(newOpacity);
    if (SelectedObject) {
      SelectedObject.set({ opacity: newOpacity });
      SelectedObject.canvas.renderAll();
    }
  };

  // Handle Rotation/Angle Change for Circle
  const handleAngleChange = (e) => {
    const newAngle = parseInt(e.target.value, 10);
    setAngle(newAngle);
    if (SelectedObject) {
      SelectedObject.set({ angle: newAngle });
      SelectedObject.canvas.renderAll();
    }
  };

  useEffect(() => {
    if (SelectedObject?.type === "circle") {
  
      setRadius(SelectedObject?.radius || 50);
      setStrokeWidth(SelectedObject?.strokeWidth || 1);
      setStrokeColor(SelectedObject?.stroke || "#000000");
      setOpacity(SelectedObject?.opacity || 1);
      setAngle(SelectedObject?.angle || 0);
    }
  }, [SelectedObject]);



  return (

    <div>
      {
        circleModal && 
        <div
        id="circle-modal"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setcircleModal(!circleModal)}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center flex flex-col gap-4">
    
            
              <div className="flex items-center justify-around">
                <label htmlFor="Radius">Radius</label>
                <input
                  type="number"
                  value={radius || ""}
                  onChange={handleRadiusChange}
                  className="w-12 bg-[#F6F1DE] text-black rounded-md p-2"
                />
              </div>
              <div className="flex items-center justify-around">
                <label htmlFor="Stroke">Stroke Width</label>
                <input
                  type="number"
                  value={strokeWidth || ""}
                  onChange={handleStrokeWidthChange}
                  className="w-12 bg-[#F6F1DE] text-black rounded-md p-2"
                />
              </div>
              <div className="flex items-center justify-around">
                <label htmlFor="StrokeColor">Stroke Color</label>
                <input
                  type="color"
                  value={strokeColor || "#000000"}
                  onChange={handleStrokeColorChange}
                  className="w-12"
                />
              </div>
              <div className="flex items-center justify-around">
                <label htmlFor="Color">Fill Color</label>
                <input
                  type="color"
                  value={circleColor || "#000000"}
                  onChange={CircleColorChange}
                  className="w-12"
                />
              </div>
              <div className="flex items-center justify-around">
                <label htmlFor="Opacity">Opacity</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opacity || 1}
                  onChange={handleOpacityChange}
                  className="w-12 bg-[#F6F1DE] text-black rounded-md p-2"
                />
              </div>
              <div className="flex items-center justify-around">
                <label htmlFor="Angle">Rotation (°)</label>
                <input
                  type="number"
                  value={angle || 0}
                  onChange={handleAngleChange}
                  className="w-12 bg-[#F6F1DE] text-black rounded-md p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      }

    </div>
  
   
  );
};

export default CircleControls;
