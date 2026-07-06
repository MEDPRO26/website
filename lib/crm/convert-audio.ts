import {
  isWebmAudio,
  isWhatsAppAudioSupported,
  normalizeAudioMimeType,
} from "@/lib/crm/audio-upload";

const MP3_BLOCK_SIZE = 1152;
const LAME_SCRIPT_SRC = "/lame.all.js";

type LameMp3Encoder = {
  encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
  flush(): Int8Array;
};

type LameGlobal = {
  Mp3Encoder: new (
    channels: number,
    sampleRate: number,
    kbps: number
  ) => LameMp3Encoder;
};

let lamePromise: Promise<LameGlobal> | null = null;

function loadLame(): Promise<LameGlobal> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Conversion audio indisponible côté serveur."));
  }

  const existing = (window as unknown as { lamejs?: LameGlobal }).lamejs;
  if (existing?.Mp3Encoder) {
    return Promise.resolve(existing);
  }

  if (lamePromise) {
    return lamePromise;
  }

  lamePromise = new Promise<LameGlobal>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = LAME_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      const lame = (window as unknown as { lamejs?: LameGlobal }).lamejs;
      if (lame?.Mp3Encoder) {
        resolve(lame);
      } else {
        reject(new Error("Encodeur MP3 introuvable après chargement."));
      }
    };
    script.onerror = () => reject(new Error("Chargement de l'encodeur MP3 échoué."));
    document.head.appendChild(script);
  });

  return lamePromise;
}

function floatTo16BitPCM(input: Float32Array) {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const sample = Math.max(-1, Math.min(1, input[i]));
    output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
}

function mixToMono(audioBuffer: AudioBuffer) {
  const { length, numberOfChannels, sampleRate } = audioBuffer;
  const mono = new Float32Array(length);

  for (let channel = 0; channel < numberOfChannels; channel++) {
    const data = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      mono[i] += data[i] / numberOfChannels;
    }
  }

  return { samples: mono, sampleRate };
}

export function needsAudioConversion(contentType: string) {
  const mime = normalizeAudioMimeType(contentType);
  if (!mime) {
    return true;
  }
  return isWebmAudio(mime) || !isWhatsAppAudioSupported(mime);
}

export async function convertBlobToMp3(blob: Blob) {
  const lame = await loadLame();
  const audioContext = new AudioContext();
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const { samples, sampleRate } = mixToMono(audioBuffer);
    const pcm = floatTo16BitPCM(samples);
    const encoder = new lame.Mp3Encoder(1, sampleRate, 128);
    const mp3Chunks: Uint8Array[] = [];

    for (let offset = 0; offset < pcm.length; offset += MP3_BLOCK_SIZE) {
      const chunk = pcm.subarray(offset, offset + MP3_BLOCK_SIZE);
      const encoded = encoder.encodeBuffer(chunk);
      if (encoded.length > 0) {
        mp3Chunks.push(new Uint8Array(encoded.buffer.slice(0)));
      }
    }

    const flushed = encoder.flush();
    if (flushed.length > 0) {
      mp3Chunks.push(new Uint8Array(flushed.buffer.slice(0)));
    }

    if (mp3Chunks.length === 0) {
      throw new Error("La conversion audio a produit un fichier vide.");
    }

    return new Blob(mp3Chunks, { type: "audio/mpeg" });
  } finally {
    await audioContext.close();
  }
}

export async function prepareAudioForWhatsApp(blob: Blob) {
  const contentType = blob.type || "audio/mpeg";
  if (!needsAudioConversion(contentType)) {
    return {
      blob,
      contentType: normalizeAudioMimeType(contentType),
    };
  }

  const mp3Blob = await convertBlobToMp3(blob);
  return {
    blob: mp3Blob,
    contentType: "audio/mpeg",
  };
}
