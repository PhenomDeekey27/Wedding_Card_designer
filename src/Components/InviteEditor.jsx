import React from "react";
import * as fabric from "fabric"; // v6
import { useState, useRef, useEffect } from "react";
import Toolbar from "./Toolbar";
import Background from "./Background";
import "react-tooltip/dist/react-tooltip.css";
import CanvasDimensions from "./CanvasDimensions";
import TemplatesPanel from "./TemplatesPanel";

const InviteEditor = () => {
  const CanvasRef = useRef(null);
  const [Canvas, setCanvas] = useState(null);
  const [handleEmptycanvas, sethandleEmptycanvas] = useState(false);
  const [collapse, setCollapse] = useState(false);

  const updateCanvasSize = (canvas) => {
    if (!canvas) return;

    // Get available screen width and height
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Sidebar width (if expanded)
    const sidebarWidth = collapse ? 64 : Math.min(screenWidth * 0.2, 256); // Adjust width based on sidebar

    // Set canvas width & height based on screen size
    const maxCanvasWidth = Math.min(
      screenWidth - sidebarWidth - 20,
      (90 * screenWidth) / 100
    );
    const maxCanvasHeight = Math.min(
      screenHeight * 0.8,
      (90 * screenHeight) / 100
    );

    // Update canvas size
    canvas.setDimensions({
      width: maxCanvasWidth,
      height: maxCanvasHeight,
    });

    canvas.requestRenderAll();
  };

  useEffect(() => {
    if (CanvasRef.current) {
      const initCanvas = new fabric.Canvas(CanvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.preserveObjectStacking = true;
      initCanvas.selection = false; // Disable selection box on empty clicks


      initCanvas.requestRenderAll();
      // Set initial size
      updateCanvasSize(initCanvas);
      setCanvas(initCanvas);

     
      // Resize event listener
      const handleResize = () => updateCanvasSize(initCanvas);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        initCanvas.dispose();
      };
    }



    if (window.innerWidth < 768) {
      setCollapse(true);
    }
  }, []);

  return (
    <div className="flex h-screen w-full flex-col-reverse md:flex-row">
      {/* Sidebar (Fixed Controls) */}

      <div
         className={`bg-gray-900 text-white p-4 flex gap-4
          flex-row 
          md:flex-col 
          w-full md:w-auto 
           md:h-full
          overflow-y-auto md:overflow-visible
        md:overflow-x-auto
          fixed bottom-0 left-0 right-0 z-50 md:relative
        `}
      style={{
        scrollbarWidth: "none", // Hide scrollbar for better UX
        WebkitOverflowScrolling: "touch", // Smooth scrolling on mobile
      }}
      >
        <Background
          canvas={Canvas}
          handleEmptycanvas={handleEmptycanvas}
          sethandleEmptycanvas={sethandleEmptycanvas}
        />
        <CanvasDimensions canvas={Canvas} />
        {Canvas && <Toolbar canvas={Canvas} />}
        <TemplatesPanel canvas={Canvas}></TemplatesPanel>
      </div>

      {/* Main Canvas Area */}

      <div
        className={`flex-1 flex md:items-center justify-center transition-all duration-300 p-4 ${
    window.innerWidth < 768 ? "pt-4" : "pt-0"
  }`}
  style={{
    marginTop: window.innerWidth < 768 ? "8px" : "0px", // Margin on mobile
    width: "100%",
    height: "100%",
  }}
      >
        <canvas
          ref={CanvasRef}
         
        ></canvas>
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default InviteEditor;
