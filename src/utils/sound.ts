import { soundCollectionAtom, soundVolumeAtom } from "@/state/atoms";
import { convertFileSrc } from "@tauri-apps/api/core";
import { getDefaultStore } from "jotai";

let lastTime = 0;

export async function playSound(capture: boolean, check: boolean) {
  // only play at most 1 sound every 75ms
  const now = Date.now();
  if (now - lastTime < 75) {
    return;
  }
  lastTime = now;

  const store = getDefaultStore();
  const collection = store.get(soundCollectionAtom);
  const volume = store.get(soundVolumeAtom);

  let type = "Move";
  if (capture) {
    type = "Capture";
  }
  if (collection !== "standard" && check) {
    type = "Check";
  }

  try {
    // Use convertFileSrc to properly resolve the asset path for Tauri
    const soundPath = await convertFileSrc(`sound/${collection}/${type}.mp3`);
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play().catch((error) => {
      console.error("Failed to play sound:", error);
    });
  } catch (error) {
    console.error("Failed to resolve sound path:", error);
  }
}
