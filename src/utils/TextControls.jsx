import React,{useState} from "react";


const TextControls = ({ TextModal, setTextModal ,SelectedObject , canvas}) => {
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontFamily, setFontFamily] = useState("Arial");
  
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


  return (
    <div>
      <div
        id="text-modal"
        tabIndex="-1"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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
    </div>
  );
};

export default TextControls;
