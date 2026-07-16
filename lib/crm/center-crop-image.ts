/**
 * Center-crops an image to a square and resizes it for avatars.
 * Uses the shorter side as the crop size so the subject stays centered.
 */
export async function centerCropImageToSquare(
  file: File,
  outputSize = 512
): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choisissez une image (JPG, PNG ou WebP).");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("L'image ne doit pas dépasser 8 Mo.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const side = Math.min(bitmap.width, bitmap.height);
    if (side < 64) {
      throw new Error("L'image est trop petite.");
    }

    const sx = Math.floor((bitmap.width - side) / 2);
    const sy = Math.floor((bitmap.height - side) / 2);
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Impossible de préparer l'image.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, outputSize, outputSize);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error("Impossible de compresser l'image."));
        },
        "image/jpeg",
        0.88
      );
    });

    return blob;
  } finally {
    bitmap.close();
  }
}
