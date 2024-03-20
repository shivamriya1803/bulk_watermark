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
      
      const watermarked = []
      for (let index = 0; index < images.length; index++) {
        let imageUrl = images[index];
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
        context.fillText(text, canvas.width * 0.50, canvas.height * 0.55);
        console.log("Width",canvas.width)
        console.log("Height",canvas.height)
        // eslint-disable-next-line eqeqeq
          continue
        }
        // Add watermark at top left corner
        const leftTopX = canvas.width * 0.15; // 15% from left
        const leftTopY = canvas.height * 0.05; // 5% from top
        context.fillText(text, leftTopX, leftTopY);

        // Add watermark at bottom right corner
        const rightBottomX = canvas.width * 0.80; // 90% from left
        const rightBottomY = canvas.height * 0.95; // 90% from top
        context.fillText(text, rightBottomX, rightBottomY);
        watermarked.push(canvas.toDataURL())
      }
  
      setWatermarkedImages(watermarked);
    };
    

  const downloadImages = async () => {
    try {
      const zip = new JSZip();
      console.log("WaterMArked",watermarkedImages)
      for (let index = 0; index < watermarkedImages.length; index++) {
        const element = watermarkedImages[index];
        const base64Data = element.split(';base64,')[1];
        // Add the image to the zip folder
        zip.file(`image_${index+1}.jpeg`, base64Data, { base64: true });
      }
      // watermarkedImages.forEach((imageDataUrl, index) => {
      //   // Extract the base64 data and remove the data prefix
        
      // });

      const content = await zip.generateAsync({ type: 'blob' });

      saveAs(content, 'watermarked_images.zip');
    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };

  return (
    <div style={{marginTop:"70%"}}>
      <h2 style={{color: '#ffffff',fontWeight: '400', fontSize:"45px"}}>Watermark Images:</h2>
      <ol>
        {watermarkedImages.map((image, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <li key={index}><a style={{textDecoration:"none",fontSize: "24px",color: 'white',fontWeight: "500"}} href={image}> image_{index+1} </a> </li>
        ))}
      </ol>
      <button onClick={downloadImages}>Download Watermarked Images</button>
    </div>
  );
};

export default ApplyWatermarkPage;
