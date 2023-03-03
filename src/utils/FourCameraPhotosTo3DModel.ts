import * as THREE from 'three';

export default async function FourCameraPhotosTo3DModel(
  photos: File[]
): Promise<THREE.Object3D> {
  
  const promiseLoaders: Promise<HTMLImageElement[]>[] = photos.map(
    async (photo) => {
      const image = new Image();
      const blob = new Blob([photo], { type: photo.type });
      const url = URL.createObjectURL(blob);
      image.src = url;
      return new Promise<HTMLImageElement[]>((resolve) => {
        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve([image]);
        };
      });
    }
  );  const loadedImages: HTMLImageElement[][] = await Promise.all(
    promiseLoaders
  );
  const texturePromises: Promise<THREE.Texture>[] = loadedImages.map(
    async (loadedImage) => {
      const [image] = loadedImage;
      const texture = new THREE.Texture(image);
      return new Promise<THREE.Texture>((resolve) => {
        texture.needsUpdate = true;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 0;
        texture.image = image;
        texture.onload = () => {
          resolve(texture);
        };
      });
    }
  );
  const textures = await Promise.all(texturePromises);

  const geometry = new THREE.PlaneGeometry(1, 1);
  const materials = textures.map(
    (texture) => new THREE.MeshBasicMaterial({ map: texture })
  );
  const group = new THREE.Group();
  const meshes = materials.map((material) => new THREE.Mesh(geometry, material));

  // ４つの写真を平面に貼り付けたものを１つにまとめた Mesh を作成
  const meshesToCombine = [
    meshes[0], // FRONT
    new THREE.Mesh(
      geometry,
      materials[1] // RIGHT
    ),
    new THREE.Mesh(
      geometry,
      materials[2] // BACK
    ),
    new THREE.Mesh(
      geometry,
      materials[3] // LEFT
    ),
  ];
  const combined = new THREE.Mesh();
  combined.geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(
    meshesToCombine.map((mesh) => mesh.geometry) as THREE.BufferGeometry[],
    false
  );
  combined.material = materials[0];
  group.add(combined);

  return group;
}