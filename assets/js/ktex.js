class TEXFile {
  static KTEX_HEADER = [0x4B, 0x54, 0x45, 0x58]; // 'KTEX'

  constructor(arrayBuffer) {
    this.buffer = arrayBuffer;
    this.view = new DataView(arrayBuffer);
    this.uint8 = new Uint8Array(arrayBuffer);

    this._validateHeader();
    this._parseHeader();
    this._rawOffset = 8; // 4 bytes for 'KTEX' + 4 bytes for header
    this.raw = this.uint8.slice(this._rawOffset);
  }

  _validateHeader() {
    for (let i = 0; i < 4; i++) {
      if (this.uint8[i] !== TEXFile.KTEX_HEADER[i]) {
        throw new Error("Invalid TEX file header (should start with 'KTEX')");
      }
    }
  }

  _parseHeader() {
    const header = this.view.getUint32(4, true); // little-endian

    this.header = {
      Platform: header & 0xF,
      PixelFormat: (header >> 4) & 0x1F,
      TextureType: (header >> 9) & 0xF,
      NumMips: (header >> 13) & 0x1F,
      Flags: (header >> 18) & 0x3,
      Remainder: (header >> 20) & 0xFFF
    };

    // Compatibility field
    this.oldRemainder = (header >> 14) & 0x3FFFF;
  }

  isPreCaveUpdate() {
    return this.oldRemainder === 0x3FFFF;
  }

  getMipmapsSummary() {
    const mipmaps = [];
    const reader = new DataView(this.raw.buffer, this.raw.byteOffset, this.raw.byteLength);
    let offset = 0;

    for (let i = 0; i < this.header.NumMips; i++) {
      const width = reader.getUint16(offset, true); offset += 2;
      const height = reader.getUint16(offset, true); offset += 2;
      const pitch = reader.getUint16(offset, true); offset += 2;
      const dataSize = reader.getUint32(offset, true); offset += 4;

      mipmaps.push({ width, height, pitch, dataSize });
    }

    return mipmaps;
  }

  getMipmaps() {
    const mipmaps = [];
    const reader = new DataView(this.raw.buffer, this.raw.byteOffset, this.raw.byteLength);
    let offset = 0;

    for (let i = 0; i < this.header.NumMips; i++) {
      const width = reader.getUint16(offset, true); offset += 2;
      const height = reader.getUint16(offset, true); offset += 2;
      const pitch = reader.getUint16(offset, true); offset += 2;
      const dataSize = reader.getUint32(offset, true); offset += 4;

      mipmaps.push({ width, height, pitch, dataSize });
    }

    for (let i = 0; i < this.header.NumMips; i++) {
      const mip = mipmaps[i];
      mip.data = this.raw.slice(offset, offset + mip.dataSize);
      offset += mip.dataSize;
    }

    return mipmaps;
  }

  getMainMipmapSummary() {
    const reader = new DataView(this.raw.buffer, this.raw.byteOffset, this.raw.byteLength);
    let offset = 0;

    const width = reader.getUint16(offset, true); offset += 2;
    const height = reader.getUint16(offset, true); offset += 2;
    const pitch = reader.getUint16(offset, true); offset += 2;
    const dataSize = reader.getUint32(offset, true);

    return { width, height, pitch, dataSize };
  }

  getMainMipmap() {
    const reader = new DataView(this.raw.buffer, this.raw.byteOffset, this.raw.byteLength);
    let offset = 0;

    const width = reader.getUint16(offset, true); offset += 2;
    const height = reader.getUint16(offset, true); offset += 2;
    const pitch = reader.getUint16(offset, true); offset += 2;
    const dataSize = reader.getUint32(offset, true); offset += 4;

    // Skip remaining mipmap headers
    offset = 10 * (this.header.NumMips);

    const data = this.raw.slice(offset, offset + dataSize);

    return { width, height, pitch, dataSize, data };
  }

  saveFile() {
    let header = 0;
    header |= 0xFFF;                     // Remainder
    header <<= 2; header |= this.header.Flags;
    header <<= 5; header |= this.header.NumMips;
    header <<= 4; header |= this.header.TextureType;
    header <<= 5; header |= this.header.PixelFormat;
    header <<= 4; header |= this.header.Platform;

    const output = new Uint8Array(8 + this.raw.length);
    output.set(TEXFile.KTEX_HEADER, 0);
    new DataView(output.buffer).setUint32(4, header, true);
    output.set(this.raw, 8);

    return output.buffer;
  }
}