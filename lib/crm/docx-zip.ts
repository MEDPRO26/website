/** Minimal ZIP read/write for DOCX (store + deflate), browser-native. */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(view: DataView, offset: number) {
  return view.getUint16(offset, true);
}

function u32(view: DataView, offset: number) {
  return view.getUint32(offset, true);
}

function writeU16(out: number[], value: number) {
  out.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeU32(out: number[], value: number) {
  out.push(
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff
  );
}

async function inflateRaw(data: Uint8Array) {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("Décompression ZIP non supportée par ce navigateur.");
  }
  const stream = new Blob([data]).stream().pipeThrough(
    new DecompressionStream("deflate-raw")
  );
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function deflateRaw(data: Uint8Array) {
  if (typeof CompressionStream === "undefined") {
    throw new Error("Compression ZIP non supportée par ce navigateur.");
  }
  const stream = new Blob([data]).stream().pipeThrough(
    new CompressionStream("deflate-raw")
  );
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

type ZipEntry = {
  name: string;
  compression: number;
  compressed: Uint8Array;
  uncompressedSize: number;
  crc: number;
};

export async function readZipEntries(buffer: ArrayBuffer): Promise<ZipEntry[]> {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let offset = 0;
  const entries: ZipEntry[] = [];

  while (offset + 4 <= bytes.length) {
    const sig = u32(view, offset);
    if (sig !== 0x04034b50) {
      break;
    }
    const compression = u16(view, offset + 8);
    const compressedSize = u32(view, offset + 18);
    const uncompressedSize = u32(view, offset + 22);
    const nameLen = u16(view, offset + 26);
    const extraLen = u16(view, offset + 28);
    const nameStart = offset + 30;
    const name = new TextDecoder().decode(
      bytes.subarray(nameStart, nameStart + nameLen)
    );
    const dataStart = nameStart + nameLen + extraLen;
    const compressed = bytes.subarray(dataStart, dataStart + compressedSize);
    entries.push({
      name,
      compression,
      compressed: compressed.slice(),
      uncompressedSize,
      crc: u32(view, offset + 14),
    });
    offset = dataStart + compressedSize;
  }

  return entries;
}

export async function getZipText(entry: ZipEntry) {
  let data: Uint8Array;
  if (entry.compression === 0) {
    data = entry.compressed;
  } else if (entry.compression === 8) {
    data = await inflateRaw(entry.compressed);
  } else {
    throw new Error(`Compression ZIP non supportée (${entry.compression}).`);
  }
  return new TextDecoder().decode(data);
}

export async function buildZip(files: { name: string; content: Uint8Array }[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: number[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = crc32(file.content);
    const compressed = await deflateRaw(file.content);
    const useStore = compressed.length >= file.content.length;
    const payload = useStore ? file.content : compressed;
    const method = useStore ? 0 : 8;

    const local: number[] = [];
    writeU32(local, 0x04034b50);
    writeU16(local, 20);
    writeU16(local, 0);
    writeU16(local, method);
    writeU16(local, 0);
    writeU16(local, 0);
    writeU32(local, crc);
    writeU32(local, payload.length);
    writeU32(local, file.content.length);
    writeU16(local, nameBytes.length);
    writeU16(local, 0);
    const localHeader = new Uint8Array(local.length + nameBytes.length + payload.length);
    localHeader.set(local, 0);
    localHeader.set(nameBytes, local.length);
    localHeader.set(payload, local.length + nameBytes.length);
    localParts.push(localHeader);

    writeU32(centralParts, 0x02014b50);
    writeU16(centralParts, 20);
    writeU16(centralParts, 20);
    writeU16(centralParts, 0);
    writeU16(centralParts, method);
    writeU16(centralParts, 0);
    writeU16(centralParts, 0);
    writeU32(centralParts, crc);
    writeU32(centralParts, payload.length);
    writeU32(centralParts, file.content.length);
    writeU16(centralParts, nameBytes.length);
    writeU16(centralParts, 0);
    writeU16(centralParts, 0);
    writeU16(centralParts, 0);
    writeU16(centralParts, 0);
    writeU32(centralParts, 0);
    writeU32(centralParts, offset);
    for (let i = 0; i < nameBytes.length; i += 1) {
      centralParts.push(nameBytes[i]);
    }

    offset += localHeader.length;
  }

  const central = new Uint8Array(centralParts);
  const end: number[] = [];
  writeU32(end, 0x06054b50);
  writeU16(end, 0);
  writeU16(end, 0);
  writeU16(end, files.length);
  writeU16(end, files.length);
  writeU32(end, central.length);
  writeU32(end, offset);
  writeU16(end, 0);

  const total =
    offset + central.length + end.length;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const part of localParts) {
    out.set(part, pos);
    pos += part.length;
  }
  out.set(central, pos);
  pos += central.length;
  out.set(end, pos);
  return out;
}

export async function replaceZipTextFile(
  buffer: ArrayBuffer,
  path: string,
  transform: (text: string) => string
) {
  const entries = await readZipEntries(buffer);
  const files: { name: string; content: Uint8Array }[] = [];

  for (const entry of entries) {
    if (entry.name === path) {
      const text = transform(await getZipText(entry));
      files.push({ name: entry.name, content: new TextEncoder().encode(text) });
      continue;
    }
    let content: Uint8Array;
    if (entry.compression === 0) {
      content = entry.compressed;
    } else if (entry.compression === 8) {
      content = await inflateRaw(entry.compressed);
    } else {
      throw new Error(`Compression ZIP non supportée (${entry.compression}).`);
    }
    files.push({ name: entry.name, content });
  }

  return buildZip(files);
}
