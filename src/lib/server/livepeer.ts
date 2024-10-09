"use server";
import path from "node:path";
import { openAsBlob } from "node:fs";
import { writeFileSync } from "node:fs";
import { revalidatePath } from "next/cache";
import { Livepeer } from "@livepeer/ai";
import dayjs from "dayjs";

// const modelIds = [
//   "ByteDance/SDXL-Lightning",
//   "SG161222/RealVisXL_V4.0",
//   "SG161222/RealVisXL_V4.0_Lightning",
//   "black-forest-labs/FLUX.1-dev",
//   "black-forest-labs/FLUX.1-schnell",
//   "runwayml/stable-diffusion-v1-5",
//   "stabilityai/stable-diffusion-3-medium-diffusers",
// ];
// const heights = ["256", "512", "768", "1024"];
// const widths = ["256", "512", "768", "1024"];

type TextToImageRequest = {
  prompt: string;
  modelId: string;
  width: number;
  height: number;
  guidanceScale: number;
  negativePrompt: string;
  safetyCheck: boolean;
  seed: number;
  numInferenceSteps: number;
  numImagesPerPrompt: number;
};

const livepeerAI = new Livepeer({
  httpBearer: "",
});

export async function textToImage(params: TextToImageRequest) {
  const prompt = params.prompt;
  const modelId = params.modelId;
  const width = params.width;
  const height = params.height;
  const guidanceScale = params.guidanceScale;
  const negativePrompt = params.negativePrompt;
  const safetyCheck = params.safetyCheck;
  const seed = params.seed;
  const numInferenceSteps = params.numInferenceSteps;
  const numImagesPerPrompt = params.numImagesPerPrompt;
  console.log("livepeer -> textToImage -> prompt", prompt);
  const result = await livepeerAI.generate.textToImage({
    modelId,
    prompt,
    width,
    height,
    guidanceScale,
    negativePrompt,
    safetyCheck,
    seed,
    numInferenceSteps,
    numImagesPerPrompt,
  });

  revalidatePath("/");

  if (result.imageResponse?.images) {
    const images = result.imageResponse.images.map((image) => image.url);

    // Save each image to the filesystem
    const publicDir = path.join(process.cwd(), "public", "images", "nfts");
    await Promise.all(
      images.map(async (imageUrl, index) => {
        // Extract the image name from the URL by getting the last part of the URL.
        // Example URL: https://obj-store.livepeer.cloud/livepeer-cloud-ai-images/cff21c04/1c9b4a4d.png
        const imageName = imageUrl.split("/").pop();
        const timestamp = dayjs().format("YYYY-MM-DD_HHmm");
        const imagePath = path.join(publicDir, imageName || `${timestamp}_${index}.png`);
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        writeFileSync(imagePath, buffer);
      }),
    );

    return {
      success: true,
      images,
    };
  } else {
    return {
      success: false,
      images: [],
      error: "Failed to generate images",
    };
  }
}

export async function imageToImage(formData: FormData) {
  const image = formData.get("image") as File;
  const buffer = await image.arrayBuffer();
  const publicDir = path.join(process.cwd(), "public");
  const imagePath = path.join(publicDir, image.name);

  writeFileSync(imagePath, Buffer.from(buffer));

  const prompt = formData.get("prompt") as string;
  const modelId = formData.get("modelId") as string;
  const strength = parseFloat(formData.get("strength") as string);
  const guidanceScale = parseFloat(formData.get("guidanceScale") as string);
  const imageGuidanceScale = parseFloat(formData.get("imageGuidanceScale") as string);
  const negativePrompt = formData.get("negativePrompt") as string;
  const safetyCheck = formData.get("safetyCheck") === "true";
  const seed = parseInt(formData.get("seed") as string);
  const numInferenceSteps = parseInt(formData.get("numInferenceSteps") as string);
  const numImagesPerPrompt = parseInt(formData.get("numImagesPerPrompt") as string);

  const result = await livepeerAI.generate.imageToImage({
    image: await openAsBlob(imagePath),
    modelId,
    prompt,
    strength,
    guidanceScale,
    imageGuidanceScale,
    negativePrompt,
    safetyCheck,
    seed,
    numInferenceSteps,
    numImagesPerPrompt,
  });

  revalidatePath("/");

  if (result.imageResponse?.images) {
    const images = result.imageResponse.images.map((image) => image.url);
    return {
      success: true,
      images,
    };
  } else {
    return {
      success: false,
      images: [],
      error: "Failed to generate images",
    };
  }
}
