/**
 * Useful sources:
 * https://www.khronos.org/opengl/wiki/S3_Texture_Compression
 * https://www.khronos.org/registry/DataFormat/specs/1.1/dataformat.1.1.html#S3TC
 */
const DXT1BlockSize = 8;
const DXT3BlockSize = 16;
const DXT5BlockSize = 16;

const RGBABlockSize = 64;
const BlockWidth = 4;
const BlockHeight = 4;

const AlphaTest = 127;

// const DXTUtils = require("./DXTUtils.js");
const DXTUtils = {
  generateDXT1Lookup(colorValue0, colorValue1, out = null) {
    let color0 = this.getComponentsFromRGB565(colorValue0);
    let color1 = this.getComponentsFromRGB565(colorValue1);

    let lookup = out || new Uint8Array(16);

    if (colorValue0 > colorValue1) {
      // Non transparent mode
      lookup[0] = Math.floor((color0.R) * 255);
      lookup[1] = Math.floor((color0.G) * 255);
      lookup[2] = Math.floor((color0.B) * 255);
      lookup[3] = Math.floor(255);

      lookup[4] = Math.floor((color1.R) * 255);
      lookup[5] = Math.floor((color1.G) * 255);
      lookup[6] = Math.floor((color1.B) * 255);
      lookup[7] = Math.floor(255);

      lookup[8] = Math.floor((color0.R * 2/3 + color1.R * 1/3 ) * 255);
      lookup[9] = Math.floor((color0.G * 2/3 + color1.G * 1/3 ) * 255);
      lookup[10] = Math.floor((color0.B * 2/3 + color1.B * 1/3 ) * 255);
      lookup[11] = Math.floor(255);

      lookup[12] = Math.floor((color0.R * 1/3 + color1.R * 2/3) * 255);
      lookup[13] = Math.floor((color0.G * 1/3 + color1.G * 2/3) * 255);
      lookup[14] = Math.floor((color0.B * 1/3 + color1.B * 2/3) * 255);
      lookup[15] = Math.floor(255);

    } else {
      // transparent mode
      lookup[0] = Math.floor((color0.R) * 255);
      lookup[1] = Math.floor((color0.G) * 255);
      lookup[2] = Math.floor((color0.B) * 255);
      lookup[3] = Math.floor(255);

      lookup[4] = Math.floor((color0.R * 1/2 + color1.R * 1/2 ) * 255);
      lookup[5] = Math.floor((color0.G * 1/2 + color1.G * 1/2 ) * 255);
      lookup[6] = Math.floor((color0.B * 1/2 + color1.B * 1/2 ) * 255);
      lookup[7] = Math.floor(255);

      lookup[8] = Math.floor((color1.R) * 255);
      lookup[9] = Math.floor((color1.G) * 255);
      lookup[10] = Math.floor((color1.B) * 255);
      lookup[11] = Math.floor(255);

      lookup[12] = Math.floor(0);
      lookup[13] = Math.floor(0);
      lookup[14] = Math.floor(0);
      lookup[15] = Math.floor(0);
    }

    return lookup;
  },

  generateDXT5AlphaLookup(alpha0, alpha1, array = null) {
    let alphaLookup = array || new Uint8Array(8);
    alphaLookup[0] = alpha0;
    alphaLookup[1] = alpha1;
    if (alpha0 > alpha1) {
      alphaLookup[2] = Math.round((6 * alpha0 + 1 * alpha1) / 7);
      alphaLookup[3] = Math.round((5 * alpha0 + 2 * alpha1) / 7);
      alphaLookup[4] = Math.round((4 * alpha0 + 3 * alpha1) / 7);
      alphaLookup[5] = Math.round((3 * alpha0 + 4 * alpha1) / 7);
      alphaLookup[6] = Math.round((2 * alpha0 + 5 * alpha1) / 7);
      alphaLookup[7] = Math.round((1 * alpha0 + 6 * alpha1) / 7);
    } else {
      alphaLookup[2] = Math.round((4 * alpha0 + 1 * alpha1) / 5);
      alphaLookup[3] = Math.round((3 * alpha0 + 2 * alpha1) / 5);
      alphaLookup[4] = Math.round((2 * alpha0 + 3 * alpha1) / 5);
      alphaLookup[5] = Math.round((1 * alpha0 + 4 * alpha1) / 5);
      alphaLookup[6] = 0;
      alphaLookup[7] = 255;
    }
    return alphaLookup;
  },

  getError(pixels, block) {
    let error = 0;
    for (let i in pixels) {
      error += Math.abs(pixels[i] - block[i]);
    }
    return error;
  },

  findNearestOnLookup(color, lookup) {
    let minDistance = Infinity;
    let minIndex = 0;

    for (let i = 0; i < lookup.length; i += 4) {
      let deltaR = (color[0] - lookup[i + 0]);
      let deltaG = (color[1] - lookup[i + 1]);
      let deltaB = (color[2] - lookup[i + 2]);
      let deltaA = (color[3] - lookup[i + 3]);
      let distance = deltaR * deltaR + deltaB * deltaB + deltaG * deltaG + deltaA * deltaA;

      if (distance < minDistance) {
        minDistance = distance;
        minIndex = i / 4;
      }
    }

    return minIndex;
  },

  getComponentsFromRGB565(color) {
    return {
      R: ((color & 0b11111000000000000) >> 8) / 0xff,
      G: ((color & 0b00000111011100000) >> 3) / 0xff,
      B: ((color & 0b00000000000011111) << 3) / 0xff
    }
  },

  makeRGB565(r, g, b) {
    return ((r & 0b11111000) << 8) | ((g & 0b11111100) << 3) | ((b & 0b11111000) >> 3);
  },

  shiftColorValue(color, amount) {
    let components = this.getComponentsFromRGB565(color);
    let r = Math.min(Math.max(Math.round(components.r * amount), 0), 1);
    let g = Math.min(Math.max(Math.round(components.r * amount), 0), 1);
    let b = Math.min(Math.max(Math.round(components.r * amount), 0), 1);
    return this.makeRGB565(r, g, b);
  }
}

// Temp buffers. Allocate upfront and reuse for calls to increase performance
const alphaLookupBuffer = new Uint8Array(8);
const colorLookupBuffer = new Uint8Array(16);
const tmpDXT5AlphaBuffer = new Uint8Array(16);

function compressBlockDXT1(pixels, outArray = null, forceNoAlpha = false) {
  let maxR = 0;
  let maxG = 0;
  let maxB = 0;
  let minR = 255;
  let minG = 255;
  let minB = 255;

  let minA = 255;
  let maxA = 0;

  for (let i = 0; i < pixels.length; i+=4) {
    let r = pixels[i + 0];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    let a = pixels[i + 3];
    
    if (a < minA) minA = a;
    if (a > maxA) maxA = a;
    if (a == 0) continue; // Full transparency should not impact color

    if (r > maxR) maxR = r;
    if (g > maxG) maxG = g;
    if (b > maxB) maxB = b;
    if (r < minR) minR = r;
    if (g < minG) minG = g;
    if (b < minB) minB = b;
  }

  let c0 = ((maxR & 0b11111000) << 8) + ((maxG & 0b11111100) << 3) + ((maxB & 0b11111000) >> 3);
  let c1 = ((minR & 0b11111000) << 8) + ((minG & 0b11111100) << 3) + ((minB & 0b11111000) >> 3);

  if (minA < AlphaTest && !forceNoAlpha) {
    let temp = c0;
    c0 = c1;
    c1 = temp;

    if (maxA == 0) {
      c1 = 0xFFFF;
    }
  }

  // Create different palettes and use the one with the least amount of error
  let loopkups = [
    DXTUtils.generateDXT1Lookup(c0, c1, colorLookupBuffer),
    DXTUtils.generateDXT1Lookup(DXTUtils.shiftColorValue(c0, 1.1), DXTUtils.shiftColorValue(c1, 0.9), colorLookupBuffer),
  ];

  let results = [];
  let out = outArray || new Uint8Array(DXT1BlockSize);
  for (let lookup of loopkups) {
    let indices = [];

    let processedColors = [];
    for (let i = 0; i < pixels.length; i+= 4) {
      let index = DXTUtils.findNearestOnLookup([
        pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]
      ], lookup);
      processedColors.push(lookup[index], lookup[index], lookup[index], lookup[index]);
      indices.push(index);
    }

    let error = DXTUtils.getError(pixels, processedColors);
    results.push({
      error,
      indices
    });
  }

  let indices = results.reduce((result, acc) => acc.error < result.error ? acc : result, {error: Infinity}).indices;

  out[0] = c0 & 0x00ff;
  out[1] = (c0 & 0xff00) >> 8;
  out[2] = c1 & 0x00ff;
  out[3] = (c1 & 0xff00) >> 8;

  out[4] = (indices[0] << 6) | (indices[1] << 4) | (indices[2] << 2) | indices[3];
  out[5] = (indices[4] << 6) | (indices[5] << 4) | (indices[6] << 2) | indices[7];
  out[6] = (indices[8] << 6) | (indices[9] << 4) | (indices[10] << 2) | indices[11];
  out[7] = (indices[12] << 6) | (indices[13] << 4) | (indices[14] << 2) | indices[15];

  return out;
}

function compressBlockDXT3(pixels, outArray = null) {
  let out = outArray || new Uint8Array(DXT3BlockSize);
  compressBlockDXT1(pixels, out, true);

  for (let i = 0; i < 4; i++) {
    out[8 + i * 2] = out[i * 2];
    out[9 + i * 2] = out[i * 2 + 1];

    out[i * 2 + 0] = ((pixels[i * 16 + 11] & 0xf0) >> 0) | ((pixels[i * 16 + 15] & 0xf0) >> 4);
    out[i * 2 + 1] = ((pixels[i * 16 + 7] & 0xf0) >> 4) | ((pixels[i * 16 + 3] & 0xf0) >> 0);
  }
  return out;
}

function compressBlockDXT5(pixels, outArray = null) {
  let out = outArray || new Uint8Array(DXT5BlockSize);
  compressBlockDXT1(pixels, out, true);
  let minAlpha = 255;
  let maxAlpha = 0;
  for (let i = 0; i < 16; i++) {
    minAlpha = Math.min(pixels[i * 4 + 3], minAlpha);
    maxAlpha = Math.max(pixels[i * 4 + 3], maxAlpha);
  }

  for (let i = 0; i < 8; i++) {
    out[i + 8] = out[i];
  }

  out[0] = minAlpha;
  out[1] = maxAlpha;
  
  let alphaLookup = DXTUtils.generateDXT5AlphaLookup(minAlpha, maxAlpha, alphaLookupBuffer);

  let alphaIndices = tmpDXT5AlphaBuffer;
  for (let i = 0; i < 16; i++) {
    let srcAlpha = pixels[i * 4 + 3];
    let nearestIndex = 0;
    let nearestDistance = 255;
    for (let j = 0; j < 8; j++) {
      let delta = Math.abs(srcAlpha - alphaLookup[j]);
      if (delta < nearestDistance) {
        nearestDistance = delta;
        nearestIndex = j;
      }
    }
    alphaIndices[i] = nearestIndex;
  }

  let out234 = alphaIndices[3] 
            | (alphaIndices[2] << 3) 
            | (alphaIndices[1] << 6) 
            | (alphaIndices[0] << 9) 
            | (alphaIndices[7] << 12) 
            | (alphaIndices[6] << 15) 
            | (alphaIndices[5] << 18) 
            | (alphaIndices[4] << 21);
  out[2] = (out234 & 0x0000ff);
  out[3] = (out234 & 0x00ff00) >> 8;
  out[4] = (out234 & 0xff0000) >> 16;

  let out567 = alphaIndices[11] 
  | (alphaIndices[10] << 3) 
  | (alphaIndices[9] << 6) 
  | (alphaIndices[8] << 9) 
  | (alphaIndices[15] << 12) 
  | (alphaIndices[14] << 15) 
  | (alphaIndices[13] << 18) 
  | (alphaIndices[12] << 21);
  out[5] = (out567 & 0x0000ff);
  out[6] = (out567 & 0x00ff00) >> 8;
  out[7] = (out567 & 0xff0000) >> 16;

  return out;
}

function decompressBlockDXT1(data, outArray = null) {
  if (data.length != DXT1BlockSize) return false;

  const cVal0 = (data[1] << 8) + data[0];
  const cVal1 = (data[3] << 8) + data[2];
  const lookup = DXTUtils.generateDXT1Lookup(cVal0, cVal1);

  const out = outArray || new Uint8Array(RGBABlockSize);
  for (let i = 0; i < 16; i++) {
    let bitOffset = i * 2;
    let byte = 4 + Math.floor(bitOffset / 8);
    let bits = (data[byte] >> bitOffset % 8) & 3;

    out[i * 4 + 0] = lookup[bits * 4 + 0];
    out[i * 4 + 1] = lookup[bits * 4 + 1];
    out[i * 4 + 2] = lookup[bits * 4 + 2];
    out[i * 4 + 3] = lookup[bits * 4 + 3];
  }

  return out;
}

function decompressBlockDXT3(data, outArray = null) {
  const out = outArray || new Uint8Array(RGBABlockSize);
  decompressBlockDXT1(data.slice(8, 16), out);
  
  for (let i = 0; i < 8; i++) {
    out[i * 8 + 3] = (data[i] & 0x0f) << 4; 
    out[i * 8 + 7] = (data[i] & 0xf0);
  }

  return out;
}

function decompressBlockDXT5(data, outArray = null) {
  const out = outArray || new Uint8Array(RGBABlockSize);
  decompressBlockDXT1(data.slice(8, 16), out);

  let alpha0 = data[0];
  let alpha1 = data[1];

  let alphaLookup = DXTUtils.generateDXT5AlphaLookup(alpha0, alpha1, alphaLookupBuffer);
  out[31] = alphaLookup[ (data[4] & 0b11100000) >> 5];
  out[27] = alphaLookup[ (data[4] & 0b00011100) >> 2];
  out[23] = alphaLookup[((data[4] & 0b00000011) << 1) + ((data[3] & 0b10000000) >> 7)];
  out[19] = alphaLookup[ (data[3] & 0b01110000) >> 4];
  out[15] = alphaLookup[ (data[3] & 0b00001110) >> 1];
  out[11] = alphaLookup[((data[3] & 0b00000001) << 2) + ((data[2] & 0b11000000) >> 6)];
  out[7] = alphaLookup[ (data[2] & 0b00111000) >> 3];
  out[3] = alphaLookup[ (data[2] & 0b00000111) >> 0];

  out[63] = alphaLookup[ (data[7] & 0b11100000) >> 5];
  out[59] = alphaLookup[ (data[7] & 0b00011100) >> 2];
  out[55] = alphaLookup[((data[7] & 0b00000011) << 1) + ((data[6] & 0b10000000) >> 7)];
  out[51] = alphaLookup[ (data[6] & 0b01110000) >> 4];
  out[47] = alphaLookup[ (data[6] & 0b00001110) >> 1];
  out[43] = alphaLookup[((data[6] & 0b00000001) << 2) + ((data[5] & 0b11000000) >> 6)];
  out[39] = alphaLookup[ (data[5] & 0b00111000) >> 3];
  out[35] = alphaLookup[ (data[5] & 0b00000111) >> 0];
  
  return out;
}




function compress(width, height, pixels, compression) {
  if (width % BlockWidth != 0) throw new Error("Width of the texture must be divisible by 4");
  if (height % BlockHeight != 0) throw new Error("Height of the texture must be divisible by 4");
  if (width < BlockWidth || height < BlockHeight) throw new Error("Size of the texture is to small");
  if (width * height * (RGBABlockSize / (BlockHeight * BlockWidth)) != pixels.length) throw new Error("Pixel data of the input does not match dimensions");

  let w = width / BlockWidth;
  let h = height / BlockHeight;
  let blockNumber = w*h;
  let buffer = new Uint8Array(blockNumber * compression.blockSize);
  let rgbaBlock = new Uint8Array(RGBABlockSize);
  let dxtBlock = new Uint8Array(compression.blockSize);

  for (let i = 0; i < blockNumber; i++) {
    let pixelX = (i % w) * 4;
    let pixelY = Math.floor(i / w) * 4;

    let j = 0;
    for (let y = 0; y < 4; y++) {
      for (let x = 3; x >= 0; x--) {
        let px = x + pixelX;
        let py = y + pixelY;
        let baseOffset = px * 4 + py * 4 * width;
        rgbaBlock[j + 0] = pixels[baseOffset + 0];
        rgbaBlock[j + 1] = pixels[baseOffset + 1];
        rgbaBlock[j + 2] = pixels[baseOffset + 2];
        rgbaBlock[j + 3] = pixels[baseOffset + 3];
        j += 4;
      }
    }

    let compressed = compression.blockCompressMethod(rgbaBlock, dxtBlock);
    for (let j = 0; j < compression.blockSize; j++) {
      buffer[i * compression.blockSize + j] = compressed[j];
    }
  }

  return buffer;
}

function decompress(width, height, data, compression) {
  if (width % BlockWidth != 0) throw new Error("Width of the texture must be divisible by 4");
  if (height % BlockHeight != 0) throw new Error("Height of the texture must be divisible by 4");
  if (width < BlockWidth || height < BlockHeight) throw new Error("Size of the texture is to small");

  let w = width / BlockWidth;
  let h = height / BlockHeight;
  let blockNumber = w * h;

  if (blockNumber * compression.blockSize != data.length) throw new Error("Data does not match dimensions");

  let out = new Uint8Array(width * height * 4);
  let blockBuffer = new Uint8Array(RGBABlockSize);

  for (let i = 0; i < blockNumber; i++) {
    let decompressed = compression.blockDecompressMethod(data.slice(i * compression.blockSize, (i+1) * compression.blockSize), blockBuffer);
    let pixelX = (i % w) * 4;
    let pixelY = Math.floor(i / w) * 4;

    let j = 0;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        let px = x + pixelX;
        let py = y + pixelY;
        out[px * 4 + py * 4 * width]     = decompressed[j];
        out[px * 4 + py * 4 * width + 1] = decompressed[j + 1];
        out[px * 4 + py * 4 * width + 2] = decompressed[j + 2];
        out[px * 4 + py * 4 * width + 3] = decompressed[j + 3];
        j += 4;
      }
    }
  }

  return out;
}

// module.exports = {
  // DXT1: {
    // compress(width, height, pixels) {
      // return compress(width, height, pixels, {
        // blockSize: DXT1BlockSize,
        // blockCompressMethod: compressBlockDXT1
      // });
    // },

    // decompress(width, height, data) {
       // return decompress(width, height, data, {
        // blockSize: DXT1BlockSize,
        // blockDecompressMethod: decompressBlockDXT1
      // });
    // }
  // },
  // DXT3: {
    // compress(width, height, pixels) {
      // return compress(width, height, pixels, {
        // blockSize: DXT3BlockSize,
        // blockCompressMethod: compressBlockDXT3
      // });
    // },

    // decompress(width, height, data) {
       // return decompress(width, height, data, {
        // blockSize: DXT3BlockSize,
        // blockDecompressMethod: decompressBlockDXT3
      // });
    // }
  // },
  // DXT5: {
    // compress(width, height, pixels) {
      // return compress(width, height, pixels, {
        // blockSize: DXT5BlockSize,
        // blockCompressMethod: compressBlockDXT5
      // });
    // },

    // decompress(width, height, data) {
       // return decompress(width, height, data, {
        // blockSize: DXT5BlockSize,
        // blockDecompressMethod: decompressBlockDXT5
      // });
    // }
  // }
// }






// TEX文件处理
class TEXFile {
    constructor() {
        this.header = {
            platform: 12, // PC
            pixelFormat: 0, // DXT1
            textureType: 2, // 2D
            numMips: 1,
            flags: 0,
            remainder: 0
        };
        this.mipmaps = [];
    }

    static fromPNGData(width, height, rgbaData, format) {
        const texFile = new TEXFile();
        // 设置格式
        switch(format) {
            case 'dxt1':
                texFile.header.pixelFormat = 0;
                break;
            case 'dxt3':
                texFile.header.pixelFormat = 1;
                break;
            case 'dxt5':
                texFile.header.pixelFormat = 2;
                break;
            case 'argb':
                texFile.header.pixelFormat = 4;
                break;
        }

        // 处理数据
        let compressedData;
        if (format === 'argb') {
            compressedData = rgbaData;
        } else {
            compressedData = compress(width, height, rgbaData, format);
        }

        // 创建mipmap
        const mipmap = {
            width: width,
            height: height,
            pitch: format === 'argb' ? width * 4 : width,
            dataSize: format === 'argb' ? width * height * 4 : compressedData.length,
            data: compressedData
        };
        texFile.mipmaps.push(mipmap);
        texFile.header.numMips = 1;

        return texFile;
    }

    static fromArrayBuffer(buffer) {
        const texFile = new TEXFile();
        const view = new DataView(buffer);
        let offset = 0;

        // 检查文件头
        const headerChars = new Uint8Array(buffer.slice(offset, offset + 4));
        offset += 4;
        if (String.fromCharCode(...headerChars) !== 'KTEX') {
            throw new Error('无效的TEX文件');
        }

        // 解析头部数据
        const header = view.getUint32(offset, true);
        offset += 4;
        texFile.header.platform = header & 15;
        texFile.header.pixelFormat = (header >> 4) & 31;
        texFile.header.textureType = (header >> 9) & 15;
        texFile.header.numMips = (header >> 13) & 31;
        texFile.header.flags = (header >> 18) & 3;
        texFile.header.remainder = (header >> 20) & 4095;

        // 解析mipmap信息
        const mipmaps = [];
        for (let i = 0; i < texFile.header.numMips; i++) {
            const mipmap = {
                width: view.getUint16(offset, true),
                height: view.getUint16(offset + 2, true),
                pitch: view.getUint16(offset + 4, true),
                dataSize: view.getUint32(offset + 6, true)
            };
            mipmaps.push(mipmap);
            offset += 10;
        }

        // 读取mipmap数据
        for (let i = 0; i < texFile.header.numMips; i++) {
            const mipmap = mipmaps[i];
            mipmap.data = new Uint8Array(buffer.slice(offset, offset + mipmap.dataSize));
            offset += mipmap.dataSize;
            texFile.mipmaps.push(mipmap);
        }

        return texFile;
    }

    toArrayBuffer() {
        // 计算总大小
        let totalSize = 8; // KTEX + header
        for (const mipmap of this.mipmaps) {
            totalSize += 10; // mipmap header
        }
        for (const mipmap of this.mipmaps) {
            totalSize += mipmap.dataSize;
        }

        const buffer = new ArrayBuffer(totalSize);
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(buffer);
        let offset = 0;

        // 写入文件头
        const headerChars = new TextEncoder().encode('KTEX');
        uint8.set(headerChars, offset);
        offset += 4;

        // 写入头部数据
        let header = 0;
        header |= this.header.platform;
        header |= this.header.pixelFormat << 4;
        header |= this.header.textureType << 9;
        header |= this.header.numMips << 13;
        header |= this.header.flags << 18;
        header |= this.header.remainder << 20;
        view.setUint32(offset, header, true);
        offset += 4;

        // 写入mipmap信息
        for (const mipmap of this.mipmaps) {
            view.setUint16(offset, mipmap.width, true);
            offset += 2;
            view.setUint16(offset, mipmap.height, true);
            offset += 2;
            view.setUint16(offset, mipmap.pitch, true);
            offset += 2;
            view.setUint32(offset, mipmap.dataSize, true);
            offset += 4;
        }

        // 写入mipmap数据
        for (const mipmap of this.mipmaps) {
            uint8.set(mipmap.data, offset);
            offset += mipmap.dataSize;
        }

        return buffer;
    }

    getPixelFormat() {
        switch(this.header.pixelFormat) {
            case 0: return 'dxt1';
            case 1: return 'dxt3';
            case 2: return 'dxt5';
            case 4: return 'argb';
            default: return 'unknown';
        }
    }
}

