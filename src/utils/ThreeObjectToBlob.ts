import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

const ThreeObjectToBlob = async (
  object: THREE.Object3D,
  exporter: typeof GLTFExporter = GLTFExporter
  ): Promise<Blob> => {
    const gltfExporter = new exporter();
    const options = {
    binary: true,
    includeCustomExtensions: true,
  };
  const gltfData = await new Promise<string>((resolve) => {
    gltfExporter.parse(
      object,
       (data) => resolve(JSON.stringify(data)),
       (error) => console.error(error),
       options);
  });
  return new Blob([gltfData], { type: 'model/gltf+json' });
}

export default ThreeObjectToBlob;