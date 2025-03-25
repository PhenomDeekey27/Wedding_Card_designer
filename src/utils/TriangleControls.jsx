import React from "react";
import { useState, useEffect } from "react";

const TriangleControls = ({
  SelectedObject,
  canvas,
  TriangleModal,
  setTriangleModal,
}) => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [Color, setColor] = useState(null);

  useEffect(() => {
    if (SelectedObject?.type === "triangle") {
      setWidth(Math.round(SelectedObject.width * SelectedObject.scaleX));
      setHeight(Math.round(SelectedObject.height * SelectedObject.scaleY));
      setColor(SelectedObject.fill);
    }
  }, [SelectedObject]);

  const handleHeightChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && SelectedObject?.type === "triangle" && value >= 0) {
      SelectedObject.set({ height: value, scaleY: 1 });
      canvas.renderAll();
      setHeight(value);
    }
  };
  
  const handleWidthChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && SelectedObject?.type === "triangle" && value >= 0) {
      SelectedObject.set({ width: value, scaleX: 1 });
      canvas.renderAll();
      setWidth(value);
    }
  };
  

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColor(value);
    if (SelectedObject) {
      SelectedObject.set({ fill: value });
      canvas.renderAll();
    }
  };

  return (
    <div>
      <div
        id="tri-modal"
        tabIndex="-1"
        className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => setTriangleModal(!TriangleModal)}
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
                <label htmlFor="Width">Width</label>
                <input
                  type="number"
                  value={width || ""}
                  onChange={handleWidthChange}
                  className="w-12 bg-[#F6F1DE] text-black rounded-md p-2"
                />
              </div>
              <div className="flex items-center justify-around">
                <label htmlFor="Height">Height</label>
                <input
                  type="number"
                  value={height || ""}
                  onChange={handleHeightChange}
                  className="w-12 bg-[#F6F1DE] text-black rounded-md p-2"
                />
              </div>
              <div className="flex items-center justify-around">
                <label htmlFor="Color">Color</label>
                <input
                  type="color"
                  value={Color || "#000000"}
                  onChange={handleColorChange}
                  className="w-12 "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriangleControls;
