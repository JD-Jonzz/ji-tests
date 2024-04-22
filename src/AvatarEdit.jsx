import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";

const AvatarEdit = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scaleValue, setScaleValue] = useState(1);

  const [avatarReady, setAvatarReady] = useState();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleScaleChange = (e) => {
    const scale = parseFloat(e.target.value);
    setScaleValue(scale);
  };

  const handleUpload = () => {
    if (editor && selectedImage) {
      const canvas = editor.getImageScaledToCanvas();
      const resizedImage = canvas.toDataURL();
      setAvatarReady(resizedImage);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: '20px' }}>
        <input type="file" onChange={handleImageChange} />
        {selectedImage && (
          <>
            <AvatarEditor
              ref={(editor) => setEditor(editor)}
              image={selectedImage}
              width={300}
              height={300}
              scale={scaleValue}
              border={50}
              borderRadius={300}
              color={[81, 203, 243, 0.6]}
              style={{ borderRadius: "30px" }}
            />
            <input
              type="range"
              value={scaleValue}
              min="1"
              max="20"
              step="0.01"
              onChange={handleScaleChange}
            />
            <button onClick={handleUpload}>Upload</button>
          </>
        )}
      </div>
      {avatarReady && <img src={avatarReady} alt="" />}
    </div>
  );
};

export default AvatarEdit;
