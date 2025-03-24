import * as fabric from "fabric"; // v6
import { useEffect, useRef, useState } from "react";
import { IoText } from "react-icons/io5";
import { FaShapes } from "react-icons/fa";
import { RiRectangleFill } from "react-icons/ri";
import { AiFillPicture } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { PiRectangleDashed } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa";

const Toolbar = ({ canvas }) => {
  if (!canvas) {
    console.log("Canvas is not initialized yet.");
    return null; // Don't render anything if canvas is not ready
  }

  console.log("Canvas initialized in Toolbar:", canvas); // Debugging

  const picRef = useRef(null);

  const [SelectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [Color, setColor] = useState(null);

  // for fonts
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [TextModal, setTextModal] = useState(false);

  const [rectModal, setrectModal] = useState(false);

  // background Image

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (event) => {
      handleObjectSelection(event.selected?.[0] || event.target);
      console.log("selected", event.selected?.[0]);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
      clearSettings();
    });
    canvas.on("object:modified", handleSelection);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared");
      canvas.off("object:modified", handleSelection);
    };
  }, [canvas]);

  useEffect(() => {
    const imageLoader = document.getElementById("imageLoader");
    if (!imageLoader) return;

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target.result;

        fabric.Image.fromURL(
          data,
          (img) => {
            // Scale down the image if it's too large
            const scaleFactor = Math.min(
              300 / img.width, // Fit width within 300px
              300 / img.height // Fit height within 300px
            );

            img.set({
              left: 150,
              top: 150,
              scaleX: scaleFactor,
              scaleY: scaleFactor,
            });

            canvas.add(img);
            canvas.renderAll(); // Ensure the image is visible
          },
          { crossOrigin: "anonymous" }
        );
      };

      reader.readAsDataURL(file);
    };

    imageLoader.addEventListener("change", handleImageUpload);
    return () => imageLoader.removeEventListener("change", handleImageUpload);
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return;
    console.log(object, "selObj"); // Correctly logs the selected object

    // Check type BEFORE updating state
    if (object.type === "rect") {
      console.log("inside Rect");
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
      setColor(object.fill);
      setrectModal(!rectModal);
    } else if (object.type === "i-text") {
      setTextColor(object.fill);
      setFontSize(object.fontSize);
      setIsBold(object.fontWeight === "bold");
      setIsItalic(object.fontStyle === "italic");
      setFontFamily(object.fontFamily || "Arial");
      setTextModal(true);
    }

    // Now update the selected object
    setSelectedObject(object);
  };

  const clearSettings = () => {
    setColor("");
    setHeight("");
    setWidth("");
  };

  const handleHeightChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && SelectedObject?.type === "rect" && value >= 0) {
      SelectedObject.set({ height: value, scaleY: 1 });
      canvas.renderAll();
      setHeight(value);
    }
  };

  const handleWidthChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && SelectedObject?.type === "rect" && value >= 0) {
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

  const addRect = () => {
    if (canvas) {
      const Rectangle = new fabric.Rect({
        top: 100,
        left: 30,
        width: 100,
        height: 60,
        fill: "red",
      });
      canvas.add(Rectangle);

      canvas.renderAll();
    }
  };
  const addText = () => {
    const text = new fabric.IText("Enter Bride and Groom name", {
      top: 50,
      left: 100,
      fill: "black",
      fontSize: fontSize,
      editable: true,
    });
    canvas.add(text);
  };

  const handleImageChange = (e) => {
    let ImgObj = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(ImgObj);
    reader.onload = (e) => {
      let imageUrl = e.target.result;
      let imageElement = document.createElement("img");
      imageElement.src = imageUrl;
      imageElement.onload = function () {
        let image = new fabric.FabricImage(imageElement);
        image.scaleToHeight(100);
        image.scaleToWidth(100);
        image._controlsVisibility = true;

        canvas.add(image);
        canvas.centerObject(image);
        canvas.setActiveObject(image);
      };
    };
  };

  //for fonts and text

  const handleTextColorChange = (e) => {
    const value = e.target.value;
    setTextColor(value);
    if (SelectedObject?.type === "i-text") {
      SelectedObject.set({ fill: value });
      canvas.renderAll();
    }
  };

  const handleFontSizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setFontSize(value);
      if (SelectedObject?.type === "i-text") {
        SelectedObject.set({ fontSize: value });
        canvas.renderAll();
      }
    }
  };

  const toggleBold = () => {
    const newBoldState = !isBold;
    setIsBold(newBoldState);
    if (SelectedObject?.type === "i-text") {
      SelectedObject.set({ fontWeight: newBoldState ? "bold" : "normal" });
      canvas.renderAll();
    }
  };

  const toggleItalic = () => {
    const newItalicState = !isItalic;
    setIsItalic(newItalicState);
    if (SelectedObject?.type === "i-text") {
      SelectedObject.set({ fontStyle: newItalicState ? "italic" : "normal" });
      canvas.renderAll();
    }
  };

  const handleFontChange = (e) => {
    const newFont = e.target.value;
    setFontFamily(newFont);
    if (SelectedObject?.type === "i-text") {
      SelectedObject.set({ fontFamily: newFont });
      canvas.renderAll();
    }
  };

  const removeSelectedObject = () => {
    if (SelectedObject) {
      canvas.remove(SelectedObject);
      setSelectedObject(null);
      clearSettings();
      canvas.renderAll();
    }
  };

  const downloadCanvasAsImage = () => {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0, // High quality
    });
  
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "wedding-invite.png"; // Name of the downloaded file
    link.click();
  };
  

  return (
    <div className="">
      <div className="flex md:flex-col gap-6">
        {/* // current dropdown */}

        <button
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          className="bg-indigo-700 text-white
         hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
          type="button"
          onClick={() =>
            document.getElementById("shape-dropdown").classList.toggle("hidden")
          }
          data-tooltip-id="customShape"
        >
          <FaShapes />
          <Tooltip id="customShape">Custom Shapes</Tooltip>
        </button>

        <div
          id="shape-dropdown"
          className="z-10 hidden bg-indigo-200 divide-y p-2 divide-gray-100 rounded-lg shadow-sm w-44"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <button
                className="bg-indigo-700 text-white
         hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-8 h-8
         cursor-pointer"
              >
                <PiRectangleDashed onClick={addRect}></PiRectangleDashed>
              </button>
            </li>
          </ul>
        </div>

        <button
          onClick={() => addText()}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
        >
          <IoText />
        </button>
        <button
          onClick={() => picRef.current.click()}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
        >
          <AiFillPicture />
        </button>
        <button
          onClick={removeSelectedObject}
          className="bg-red-600 text-white p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="removeObject"
        >
          <MdDelete></MdDelete>
          <Tooltip id="removeObject">Remove Selected Object</Tooltip>
        </button>
        <button
          onClick={() =>downloadCanvasAsImage()}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
        >
         <FaDownload></FaDownload>
        </button>
        
      </div>

      <input
        type="file"
        placeholder="Upload Image here"
        accept="image/*"
        aria-label="Add Image"
        onChange={handleImageChange}
        ref={picRef}
        className="hidden"
      />

      {SelectedObject && SelectedObject.type === "rect" && rectModal && (
        <div>
          <div
            id="rect-modal"
            tabindex="-1"
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                  onClick={() => setrectModal(!rectModal)}
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
      )}

      {/* text controls */}

      {SelectedObject && SelectedObject.type === "i-text" && TextModal && (
        <div
          id="text-modal"
          tabindex="-1"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 
            hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex 
            justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
                onClick={() => setTextModal(!TextModal)}
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
                <div className="flex flex-col gap-4 w-full mt-12 justify-around">
                  <div className="flex justify-between items-center">
                    <label>Font Size</label>
                    <input
                      type="number"
                      value={fontSize || ""}
                      onChange={handleFontSizeChange}
                      className="w-12 border-2 rounded-md p-1 px-1"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label>Color</label>
                    <input
                      type="color"
                      value={textColor || "#000000"}
                      onChange={handleTextColorChange}
                      className="rounded-full w-8 h-8"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <label>Fonts</label>
                    <select
                      value={fontFamily}
                      onChange={handleFontChange}
                      className="w-30 bg-gray-700"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </div>
                  <div className="flex justify-around items-center w-full gap-4">
                    <button
                      onClick={toggleBold}
                      className={`bg-indigo-700 text-white rounded-md w-full p-2 ${
                        isBold ? "font-bold underline" : "font-normal"
                      }`}
                    >
                      Bold
                    </button>

                    <button
                      onClick={toggleItalic}
                      style={{ fontStyle: isItalic ? "italic" : "normal" }}
                      className={`bg-indigo-700 text-white rounded-md w-full p-2 ${
                        isItalic ? "italics underline" : "font-normal"
                      }`}
                    >
                      Italic
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
