"use server";
import path from "node:path";
import { openAsBlob, writeFileSync } from "node:fs";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { Livepeer } from "@livepeer/ai";
import { EpochType, GeneratedImage, ImageGenerationResponse } from "@customTypes/index";
import { getImagePath } from "@lib/utils";

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
  modelId?: string;
  width?: number;
  height?: number;
  guidanceScale?: number;
  negativePrompt?: string;
  safetyCheck?: boolean;
  seed?: number;
  numInferenceSteps?: number;
  numImagesPerPrompt?: number;
  epochType?: EpochType;
  ymdhmDate?: string;
};

const livepeerAI = new Livepeer({
  httpBearer: "",
});

export const textToImage = async (params: TextToImageRequest): Promise<ImageGenerationResponse> => {
  const prompt = params.prompt;
  const modelId = params.modelId || "SG161222/RealVisXL_V4.0_Lightning";
  const width = params.width || 512;
  const height = params.height || 512;
  const guidanceScale = params.guidanceScale || 7.5;
  const negativePrompt =
    params.negativePrompt ||
    "(octane render, render, drawing, anime, bad photo, bad photography:1.3), (worst quality, low quality, blurry:1.2), (bad teeth, deformed teeth, deformed lips), (bad anatomy, bad proportions:1.1), (deformed iris, deformed pupils), (deformed eyes, bad eyes), (deformed face, ugly face, bad face), (deformed hands, bad hands, fused fingers), morbid, mutilated, mutation, disfigured";
  const safetyCheck = params.safetyCheck || false;
  const seed = params.seed || 0;
  const numInferenceSteps = params.numInferenceSteps || 50;
  const numImagesPerPrompt = params.numImagesPerPrompt || 1;
  const epochType = params.epochType || EpochType.Minute;
  const ymdhmDate = params.ymdhmDate || dayjs().format("YYYY-MM-DD_HHmm");
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
    const images: GeneratedImage[] = result.imageResponse.images.map((image, index) => {
      const imageName = `${epochType}_${ymdhmDate.replace(/[ :]/g, "_")}_${index}.png`;
      return {
        imageUrl: image.url,
        imagePath: getImagePath(imageName, false),
        imageSrc: getImagePath(imageName, true),
      };
    });

    // Save each image to the filesystem
    await Promise.all(
      images.map(async (image) => {
        // Extract the image name from the URL by getting the last part of the URL.
        // Example URL: https://obj-store.livepeer.cloud/livepeer-cloud-ai-images/cff21c04/1c9b4a4d.png
        // const imageName = imageUrl.split("/").pop();
        // const imagePath = path.join(imagesDir, imageName || `${ymdhmDate}_${index}.png`);
        // const imageName = imageUrl.split("/").pop();
        const imagePath = image.imagePath;
        const response = await fetch(image.imageUrl);
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
};

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
