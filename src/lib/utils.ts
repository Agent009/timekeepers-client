import { Document, Model } from "mongoose";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UpsertResult } from "@customTypes/index";
import { connectDB } from "@lib/mongodb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A function to upsert (update or insert) a document based on unique fields.
 *
 * @template T - The type of the document.
 * @param model - The Mongoose model representing the collection.
 * @param newData - The new data to upsert. Must be a partial object that matches the document type.
 * @param uniqueFields - An array of keys from the document type that should be used to identify unique documents.
 *
 * @returns A promise that resolves to an `UpsertResult` object.
 * - `success` is `true` if the operation was successful.
 * - `updated` is `true` if an existing document was updated, `false` if a new document was created.
 * - `document` is the upserted document.
 */
export async function upsertDocument<T extends Document>(
  model: Model<T>,
  newData: Partial<T>,
  uniqueFields: (keyof T)[],
): Promise<UpsertResult<T>> {
  // Create a query object from the unique fields and their corresponding values from the new data.
  const query = Object.fromEntries(uniqueFields.map((field) => [field, newData[field]]));
  console.log("utils -> upsertDocument -> model", model, "query", query);
  await connectDB();
  // @ts-expect-error ignore
  const existingDocument = await model.findOne(query);

  if (existingDocument) {
    Object.assign(existingDocument, newData);
    const updatedDocument = await existingDocument.save();
    return { success: true, updated: true, document: updatedDocument as T };
  } else {
    const createdDocument = await model.create(newData);
    return { success: true, updated: false, document: createdDocument };
  }
}
