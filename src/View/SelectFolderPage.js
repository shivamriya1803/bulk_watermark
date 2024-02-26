import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
const SelectFolderPage = () => {
  const history = useHistory();
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [fileText, setFileText] = useState([]);

  
  const selectFolder = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFilesSelected = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const images = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          images.push(e.target.result);
          if (images.length === files.length) {
            console.log("Length", images.length)
            // Redirect to ApplyWatermarkPage and pass the selected images as state
            history.push('/apply-watermark', { images: images, filetext:fileText });
          }
        };
        reader.readAsDataURL(file);
      }
      setSelectedImages(images);
    }
  };
  
  return (
    <div>
      <input type="text" placeholder='Text for WaterMark' id="waterMarkText" onChange={(event)=>{setFileText(event.target.value)}}></input>
      <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFilesSelected} multiple />
      <button onClick={selectFolder}>Select Images</button>
    </div>
  );
};

export default SelectFolderPage;
