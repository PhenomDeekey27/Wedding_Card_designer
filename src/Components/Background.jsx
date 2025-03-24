import React, { useState, useEffect } from "react";
import { TbBackground } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import { useRef } from "react";
import * as fabric from "fabric"; // v6
const Background = ({ canvas, handleEmptycanvas, sethandleEmptycanvas }) => {
  const [showColors, setShowColors] = useState(false);
  const fileInputRef = useRef(null); // Ref for hidden input
  const [isCanvasSelected, setIsCanvasSelected] = useState(false); // Track selection
  const backgroundButtonRef = useRef(null);

  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F5B041",
    "#9B59B6",
    "#2ECC71",
  ]; // 6 Random Colors

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (event) => {
      if (event.selected && event.selected.length > 0) {
        console.log("Selected Object:", event.selected[0]);
        setIsCanvasSelected(true);
        canvas.wrapperEl.style.border = "none"; // Remove border when selecting object
      }
    };

    const handleDeselection = () => {
      console.log("Canvas deselected");
      setIsCanvasSelected(false);
    };

    const handleCanvasClick = () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) {
        console.log("Canvas clicked (no object selected)");
        setIsCanvasSelected(false);
        sethandleEmptycanvas((prev) => !prev);
        backgroundButtonRef.current.click();
      }
    };

    // Add event listeners
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:cleared", handleDeselection);
    canvas.on("mouse:down", handleCanvasClick);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:cleared", handleDeselection);
      canvas.off("mouse:down", handleCanvasClick);
    };
  }, [canvas]);

  const applyBackgroundColor = (e) => {
    if (!canvas) return;

    console.log(e.target.value, "color");

    canvas.backgroundImage = null;

    canvas.backgroundColor = e.target.value;
    canvas.renderAll();
    console.log(`Background color changed to ${e.target.value}`);
  };

const handleBgChange = (e) => {
  console.log("File chosen");

  if (!canvas) return; // Ensure Fabric.js canvas is initialized

  const file = e.target.files[0];
  if (!file) return; // If no file is selected, exit

  const reader = new FileReader();
  reader.onload = (event) => {
    const imageUrl = event.target.result; // Get base64 image URL

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      console.log("Image loaded successfully!");

      // Create a fabric image
      const fabricImage = new fabric.Image(image, {
        originX: "left",
        originY: "top",
      });

      // Get canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate aspect ratio and scale correctly
      const scaleX = canvasWidth / fabricImage.width;
      const scaleY = canvasHeight / fabricImage.height;
      const scale = Math.max(scaleX, scaleY); // Scale to cover the canvas

      // Set the image to fill the canvas while maintaining aspect ratio
      fabricImage.set({
        scaleX: scale,
        scaleY: scale,
        left: (canvasWidth - fabricImage.width * scale) / 2,
        top: (canvasHeight - fabricImage.height * scale) / 2,
      });

      // Clear any existing background image
      canvas.backgroundImage = null;

      // Set the image as the background manually
      canvas.set("backgroundImage", fabricImage);
      canvas.renderAll();

      console.log("Background image set and scaled to fit canvas perfectly!");
    };

    image.onerror = () => {
      console.error("Failed to load image.");
    };
  };

  reader.readAsDataURL(file); // Convert file to base64
};

  const removeBackground = (e) => {
    if (!canvas) return;
    canvas.backgroundColor = "#ffffff";
    canvas.backgroundImage = null;
    canvas.renderAll();
  };


  const scaleAndCenterImage = () => {
    if (!canvas || !canvas.backgroundImage) return;
  
    const fabricImage = canvas.backgroundImage;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    // Calculate aspect ratio and scale correctly
    const scaleX = canvasWidth / fabricImage.width;
    const scaleY = canvasHeight / fabricImage.height;
    const scale = Math.max(scaleX, scaleY); // Maintain aspect ratio and cover canvas
  
    // Align and scale the background correctly after resizing
    fabricImage.set({
      scaleX: scale,
      scaleY: scale,
      left: (canvasWidth - fabricImage.width * scale) / 2,
      top: (canvasHeight - fabricImage.height * scale) / 2,
    });
  
    canvas.renderAll();
  };

  useEffect(() => {
    if (!canvas) return;
  
    const handleResize = () => {
      canvas.setWidth(window.innerWidth * 0.8); // Adjust width
      canvas.setHeight(window.innerHeight * 0.6); // Adjust height
      scaleAndCenterImage(); // Realign background after resize
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvas]);
  
  

  return (
    <div>
    
      {/* //current One */}

      <button
        data-modal-target="popup-modal"
        data-modal-toggle="popup-modal"
        className="bg-indigo-700 hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
         data-tooltip-id="background-tooltip"
       
        type="button"
        onClick={() =>
          document.getElementById("background").classList.toggle("hidden")
        }
      >
       <TbBackground
          id="background-icon"
          data-tooltip-id="background-tooltip"
        />
        <Tooltip id="background-tooltip" place="top" positionStrategy="fixed" delayShow={0}>
          Background
        </Tooltip>
      </button>

      <div
        id="background"
        tabindex="-1"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="modal"
              onClick={() =>
                document.getElementById("background").classList.toggle("hidden")
              }
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>Background</div>
                <div className="font-medium truncate">Choose Background</div>
              </div>

              <div className="relative">
                <button
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="dropdown"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("color-dropdown")
                      .classList.toggle("hidden")
                  }
                >
                  Solid Colors
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>

                <div
                  id="color-dropdown"
                  className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm mx-auto w-44 items-center justify-center dark:bg-gray-700"
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200 flex flex-wrap mx-auto items-center justify-center"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    {colors.map((color, index) => (
                      <li>
                        <input
                          type="color"
                          value={color}
                          key={index}
                          onClick={applyBackgroundColor}
                          onChange={applyBackgroundColor}
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative">
                  <button
                    className="bg-none p-2 border-0 cursor-pointer hover:bg-gray-500 w-full rounded-md"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleBgChange}
                  />
                </div>
                <div className="relative">
                  
                    <button
                      className="bg-none p-2 border-0 cursor-pointer
               hover:bg-gray-500 w-full rounded-md"
                      onClick={removeBackground}
                    >
                      Remove Background
                    </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Background;
