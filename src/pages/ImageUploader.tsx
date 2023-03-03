import React, { useState } from 'react';
import FourCameraPhotosTo3DModel from '../utils/FourCameraPhotosTo3DModel';
import ThreeObjectToBlob from '../utils/ThreeObjectToBlob';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

function App() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = e.target.files;
    if (!files) return;
  
    const newFiles: File[] = Array.from(files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files) {
      return;
    }
    setProcessing(true);
    const object3D = await FourCameraPhotosTo3DModel([
      files[0],
      files[1],
      files[2],
      files[3]
    ]);
    setProcessing(false);
    const gltfBlob =await ThreeObjectToBlob(object3D, GLTFExporter);
    setDownloadUrl(URL.createObjectURL(gltfBlob));
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-10">Four Camera Photos to 3D Model Converter</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-5">
          <label htmlFor="front" className="block text-lg font-bold mb-1">
            Front Photo
          </label>
          <input
            type="file"
            id="front"
            accept="image/*"
            required
            onChange={handleFileSelect}
            className="border border-gray-400 rounded p-2"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="right" className="block text-lg font-bold mb-1">
            Right Photo
          </label>
          <input
            type="file"
            id="right"
            accept="image/*"
            required
            onChange={handleFileSelect}
            className="border border-gray-400 rounded p-2"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="back" className="block text-lg font-bold mb-1">
            Back Photo
          </label>
          <input
            type="file"
            id="back"
            accept="image/*"
            required
            onChange={handleFileSelect}
            className="border border-gray-400 rounded p-2"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="left" className="block text-lg font-bold mb-1">
            Left Photo
          </label>
          <input
            type="file"
            id="left"
            accept="image/*"
            required
            onChange={handleFileSelect}
            className="border border-gray-400 rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded font-bold"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Convert to 3D Model'}
        </button>
      </form>
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="3DModel.glb"
          className="block mt-10 font-bold text-xl"
        >
          Download 3D Model
        </a>
      )}
    </div>
  );
}

export default App;