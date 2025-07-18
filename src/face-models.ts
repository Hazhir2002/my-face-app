import * as faceapi from "face-api.js";

export async function loadFaceModels() {
  const MODEL_URL = process.env.PUBLIC_URL + "/models";
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  ]);
}
