import * as fabric from "fabric"; // v6
import { useEffect, useRef, useState } from "react";
import { IoText } from "react-icons/io5";
import { FaShapes } from "react-icons/fa";
import { LuCircleDashed } from "react-icons/lu";
import { AiFillPicture } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { PiRectangleDashed } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa";

import CircleControls from "../utils/CircleControls";
import { addCircle, addRect, addText , addTriangle } from "../utils/canvasUtils";
import RectControls from "../utils/RectControls";
import TextControls from "../utils/TextControls";
import { IoTriangle } from "react-icons/io5";
import TriangleControls from "../utils/TriangleControls";


const Toolbar = ({ canvas }) => {
  if (!canvas) {
    return null; 
  }

  const picRef = useRef(null);

  const [SelectedObject, setSelectedObject] = useState(null);

  // for fonts

  const [TextModal, setTextModal] = useState(false);

  const [rectModal, setrectModal] = useState(false);
  const [circleModal, setcircleModal] = useState(false);

  const [TriangleModal, setTriangleModal] = useState(false)

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
  

   
    if (object.type == "rect") setrectModal(!rectModal);

    if (object.type === "i-text") {
      setTextModal(true);
    } else if (object.type === "circle") {
      setcircleModal(!circleModal);
    }else if(object.type ==="triangle"){
      setTriangleModal(!TriangleModal)
    }

    // Now update the selected object
    setSelectedObject(object);
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

  const removeSelectedObject = () => {
    if (SelectedObject) {
      canvas.remove(SelectedObject);
      setSelectedObject(null);

      canvas.renderAll();
    }
  };

  const downloadCanvasAsImage = () => {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0, 
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "wedding-invite.png"; 
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
          <Tooltip id="customShape" positionStrategy="fixed">
            Custom Shapes
          </Tooltip>
        </button>

        <div
          id="shape-dropdown"
          className="z-10 hidden bg-indigo-200 divide-y p-2 divide-gray-100 rounded-lg shadow-sm w-fit flex flex-wrap gap-2"
        >
          <button
            className="bg-indigo-700 text-white
         hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-8 h-8
         cursor-pointer"
          >
            <PiRectangleDashed
              onClick={() => addRect(canvas)}
            ></PiRectangleDashed>
          </button>
          <button
            className="bg-indigo-700 text-white
         hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-8 h-8
         cursor-pointer"
          >
            <LuCircleDashed onClick={() => addCircle(canvas)}></LuCircleDashed>
          </button>
          <button
            className="bg-indigo-700 text-white
         hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-8 h-8
         cursor-pointer"
          >
            <IoTriangle onClick={() => addTriangle(canvas)}></IoTriangle>
          </button>
        </div>

        <button
          onClick={() => addText(canvas)}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="text"
        >
          <IoText />
          <Tooltip id="text" positionStrategy="fixed">
            Add text
          </Tooltip>
        </button>
        <button
          onClick={() => picRef.current.click()}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="picture"
        >
          <AiFillPicture />
          <Tooltip id="picture" positionStrategy="fixed">
            Upload Image
          </Tooltip>
        </button>
        <button
          onClick={removeSelectedObject}
          className="bg-red-600 text-white p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="removeObject"
        >
          <MdDelete></MdDelete>
          <Tooltip id="removeObject" positionStrategy="fixed">
            Remove Selected Object
          </Tooltip>
        </button>
        <button
          onClick={() => downloadCanvasAsImage()}
          className="bg-indigo-700 text-white font-bold hover:bg-indigo-600 p-2 rounded flex items-center justify-center w-12 h-12"
          data-tooltip-id="Download"
        >
          <FaDownload></FaDownload>
          <Tooltip id="Download" positionStrategy="fixed">
            Download
          </Tooltip>
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
        <RectControls
          rectModal={rectModal}
          canvas={canvas}
          setrectModal={setrectModal}
          SelectedObject={SelectedObject}
        ></RectControls>
      )}

      {/* text controls */}

      {SelectedObject && SelectedObject.type === "i-text" && TextModal && (
        <TextControls
          SelectedObject={SelectedObject}
          TextModal={TextModal}
          setTextModal={setTextModal}
          canvas={canvas}
        ></TextControls>
      )}

      {SelectedObject && SelectedObject.type === "circle" && circleModal && (
        <CircleControls
          SelectedObject={SelectedObject}
          setcircleModal={setcircleModal}
          circleModal={circleModal}
        ></CircleControls>
      )}

      {SelectedObject && SelectedObject.type === "triangle" && TriangleModal && (
          <TriangleControls
          TriangleModal={TriangleModal}
          setTriangleModal={setTriangleModal}
          SelectedObject={SelectedObject}
          canvas={canvas}
          ></TriangleControls>
      )}
    </div>
  );
};

export default Toolbar;
