import React, { useState, useEffect } from 'react';
import Jimp from 'jimp';
import JSZip from 'jszip';
import saveAs from 'file-saver';

const ApplyWatermarkPage = ({ location }) => {
  const [folder, setFolder] = useState("");
  const [watermarkedImages, setWatermarkedImages] = useState([]);

  useEffect(() => {
    const { state } = location;
    if (state && state.images && state.filetext) {
      setFolder(state.images);
      applyWatermarkToImages({images:state.images,text:state.filetext});
    }
  }, [location]);

  // const applyWatermarkToImages = async (folder) => {
  //   try {
  //     console.log("FOLDER", folder)
  //     const watermarkedImages = await Promise.all(folder.map(async (imageDataUrl, index) => {
  //       const image = await Jimp.read(Buffer.from(imageDataUrl.split(',')[1], 'base64'));
  
  //       // Load font for watermark text
  //       const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  
  //       // Apply watermark text at desired positions
  //       image.print(font, 10, 10, 'Watermark Top Left');
  //       image.print(font, image.getWidth() / 2 - 100, image.getHeight() / 2 - 16, 'Watermark Center');
  //       image.print(font, image.getWidth() - 250, image.getHeight() - 50, 'Watermark Bottom Right');
  
  //       // Convert the watermarked image to base64 string
  //       return image.getBase64Async(Jimp.MIME_JPEG);
  //     }));
  //     console.log(watermarkedImages);
  //     setWatermarkedImages(watermarkedImages);
  //   } catch (error) {
  //     console.error('Error applying watermark:', error);
  //   }
  // };



    const applyWatermarkToImages = ({images,text}) => {
      const watermarked = images.map((imageUrl) => {
        const image = new Image();
        image.src = imageUrl;
  
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
  
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
  
        // Add watermark at center
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        context.font = '30px Arial';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
  
        // Add watermark at top left corner
        context.fillText(text, 50,30);
  
        // Add watermark at bottom right corner
        context.fillText(text, canvas.width-80 , canvas.height-10);
  
        return canvas.toDataURL();
      });
  
      setWatermarkedImages(watermarked);
    };
    

  const downloadImages = async () => {
    try {
      const zip = new JSZip();
      console.log("WaterMArked",watermarkedImages)
      watermarkedImages.forEach((imageDataUrl, index) => {
        // Extract the base64 data and remove the data prefix
        const base64Data = imageDataUrl.split(';base64,')[1];
        // Add the image to the zip folder
        zip.file(`image_${index}.jpeg`, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: 'blob' });

      saveAs(content, 'watermarked_images.zip');
    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };

  return (
    <div>
      <h2>Watermark Applied to Images:</h2>
      <ul>
        {watermarkedImages.map((image, index) => (
          <li key={index}>{image}</li>
        ))}
      </ul>
      <button onClick={downloadImages}>Download Watermarked Images</button>
    </div>
  );
};

export default ApplyWatermarkPage;
