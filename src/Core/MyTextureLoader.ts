import { Mesh, MeshBasicMaterial, MeshLambertMaterial } from "three";
import { Vector2 } from "three";
import { FrontSide } from "three";
import { DoubleSide } from "three";
import { BackSide } from "three";
import { Texture } from "three";
import { TextureLoader } from "three";

export enum BlockType {
  DirtWithGrass,
  ClassicDirt,
  Sky,
}

const textureLoader = new TextureLoader();

const cubeTexture = (path, ext, side = FrontSide) => {
  const textures = "north south up down west east".split(" ").map((dir) => {
    console.log(`${path}/${dir}${ext}`);
    const texture = textureLoader.load(`${path}/${dir}${ext}`);
    if (dir == "up") {
      texture.rotation += Math.PI / 2;
      texture.center = new Vector2(0.5, 0.5);
    }
    if (dir == "down") {
      texture.rotation += (3 * Math.PI) / 2;
      texture.center = new Vector2(0.5, 0.5);
    }

    const mesh = new MeshLambertMaterial({ map: texture, side });
    // mesh.side = BackSide;
    return mesh;
  });

  return textures;
};

const MyTextures: Map<BlockType, MeshBasicMaterial[]> = new Map();

MyTextures.set(
  BlockType.ClassicDirt,
  cubeTexture("textures/block/dirt-without-grass", ".bmp", FrontSide)
);

MyTextures.set(
  BlockType.DirtWithGrass,
  cubeTexture("textures/block/dirtv2", ".png", FrontSide)
);

MyTextures.set(
  BlockType.Sky,
  cubeTexture("/textures/skybox/clouds1", ".bmp", BackSide)
);

export default MyTextures;
