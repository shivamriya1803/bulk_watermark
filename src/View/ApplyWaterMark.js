import React, { useState, useEffect } from 'react';
import Jimp from 'jimp';
import JSZip from 'jszip';
import saveAs from 'file-saver';

const ApplyWatermarkPage = ({ location }) => {
  const [folder, setFolder] = useState(null);
  const [watermarkedImages, setWatermarkedImages] = useState([]);

  useEffect(() => {
    const { state } = location;
    if (state && state.images) {
      setFolder(state.images);
      applyWatermarkToImages(state.images);
    }
  }, [location]);

  const applyWatermarkToImages = async (folder) => {
    try {
      console.log("FOLDER", folder)
      const watermarkedImages = await Promise.all(folder.map(async (imageDataUrl, index) => {
        const image = await Jimp.read(Buffer.from(imageDataUrl.split(',')[1], 'base64'));
  
        // Load font for watermark text
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  
        // Apply watermark text at desired positions
        image.print(font, 10, 10, 'Watermark Top Left');
        image.print(font, image.getWidth() / 2 - 100, image.getHeight() / 2 - 16, 'Watermark Center');
        image.print(font, image.getWidth() - 250, image.getHeight() - 50, 'Watermark Bottom Right');
  
        // Convert the watermarked image to base64 string
        return image.getBase64Async(Jimp.MIME_JPEG);
      }));
      console.log(watermarkedImages);
      setWatermarkedImages(watermarkedImages);
    } catch (error) {
      console.error('Error applying watermark:', error);
    }
  };

  const processImage = async (image) => {
    const img = await Jimp.read(image);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

    img.print(font, 10, 10, 'Dynamic Text Top Left');
    img.print(font, img.getWidth() / 2 - 100, img.getHeight() / 2 - 16, 'Dynamic Text Center');
    img.print(font, img.getWidth() - 250, img.getHeight() - 50, 'Dynamic Text Bottom Right');

    return img.getBufferAsync(Jimp.MIME_JPEG);
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
