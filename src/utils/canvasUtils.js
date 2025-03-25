import * as fabric from "fabric"; // v6

export const addRect = (canvas) => {
  const rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 100,
    height: 60,
    fill: "red",
  });
  canvas.add(rect);
  canvas.renderAll();
};

export const addCircle = (canvas) => {
  const circle = new fabric.Circle({
    radius: 30,
    fill: "green",
    left: 120,
    top: 120,
  });
  canvas.add(circle);
  canvas.renderAll();
};

export const addText = (canvas, text = "Enter Bride and Groom Name") => {
  const newText = new fabric.IText(text, {
    left: 150,
    top: 150,
    fill: "black",
    fontSize: 20,
  });
  canvas.add(newText);
  canvas.renderAll();
};

export const addTriangle=(canvas)=>{

  const tri = new fabric.Triangle(
    {
      width: 40, height: 40, fill: 'blue', left: 50, top: 50
    }
 
    
  )

  canvas.add(tri)
  canvas.renderAll()

}
