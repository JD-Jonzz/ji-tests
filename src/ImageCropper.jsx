import { useState } from "react";
import Cropper from "react-easy-crop";

const ImageCropper = () => {
    const [selectedImageURL, setSelectedImageURL] = useState("");
    const [selectedImage, setSelectedImage] = useState();
    const [demontions, setDemontions] = useState();
  
    function handleImageImport(e) {
      console.log(e.target.files);
      if (e.target.files.length) {
        setSelectedImageURL(URL.createObjectURL(e.target.files[0]));
        setSelectedImage(e.target.files[0]);
      }
    }
  
    getImageParams(selectedImage).then(({ width, height }) => {
      setDemontions({ width, height });
    });
  
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
  
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({
      width: 300,
      height: 300,
    });
    const [croppedImage, setCroppedImage] = useState(null);
  
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
      console.log("****** croppedArea", croppedArea);
      console.log("****** croppedAreaPixels", {
        x: croppedAreaPixels.x,
        y: croppedAreaPixels.y,
        width: 300,
        height: 300,
      });
      setCroppedAreaPixels(croppedAreaPixels);
    };
  
    const showCroppedImage = async () => {
      try {
        const croppedImage = await getCroppedImg(
          selectedImageURL,
          croppedAreaPixels
        );
        setCroppedImage(croppedImage);
      } catch (e) {
        console.error(e);
      }
    };
  
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            paddingTop: "40px",
            paddingBottom: "20px",
          }}
        >
          <div>
            <input
              type="file"
              onChange={handleImageImport}
              accept=".jpg, .jpeg, .png"
            />
            <h1>
              size: {parseFloat(selectedImage?.size / (1024 * 1024)).toFixed(2)}Mb
            </h1>
            <i>{selectedImage?.size}</i>
            <h1>
              demontions: {demontions?.width}x{demontions?.height}
            </h1>
          </div>
          {selectedImageURL && (
            <img
              src={selectedImageURL}
              width={80}
              height={80}
              className="rounded-full"
              alt=""
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <div
          style={{
            position: "relative",
            width: 500,
            height: 500,
            background: "#333",
          }}
        >
          <Cropper
            image={selectedImageURL}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            maxZoom={20}
            // cropSize={{ width: 300, height: 300 }}
            // onCropAreaChange={(croppedArea, croppedAreaPixels) =>
            //   console.log("****** ++", croppedArea, croppedAreaPixels)
            // }
            // initialCroppedAreaPercentages={{
            //   x: 25,
            //   y: 25,
            //   width: 300,
            //   height: 300,
            // }}
          />
        </div>
  
        <input
          type="range"
          min={1}
          max={20}
          value={zoom}
          step={0.01}
          onChange={(e) => setZoom(e.target.value)}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <h1>
            {croppedAreaPixels?.width}x{croppedAreaPixels?.height}
          </h1>
        </div>
        <button onClick={showCroppedImage}>Show Cropped</button>
  
        {croppedImage && (
          <div>
            <img src={croppedImage} alt="" />
          </div>
        )}
  
        
      </div>
    );
  }
  
  export default ImageCropper;
  
  const getImageParams = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        let image = new Image();
        image.src = e.target.result;
        await image.decode();
        resolve({ width: image.width, height: image.height });
      };
      reader.readAsDataURL(file);
    });
  };
  
  export const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });
  
  export function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180;
  }
  
  /**
   * Returns the new bounding area of a rotated rectangle.
   */
  export function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation);
  
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  }
  
  export async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    if (!ctx) {
      return null;
    }
  
    const rotRad = getRadianAngle(rotation);
  
    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );
  
    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;
  
    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);
  
    // draw rotated image
    ctx.drawImage(image, 0, 0);
  
    const croppedCanvas = document.createElement("canvas");
  
    const croppedCtx = croppedCanvas.getContext("2d");
  
    if (!croppedCtx) {
      return null;
    }
  
    // Set the size of the cropped canvas
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;
  
    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  
    // As Base64 string
    // return croppedCanvas.toDataURL('image/jpeg');
  
    // As a blob
    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob((file) => {
        resolve(URL.createObjectURL(file));
      }, "image/jpeg");
    });
  }
  