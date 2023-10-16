import { utapi } from "uploadthing/server";
import { type ImageType } from "~/types/commonTypes";

export const deleteImages = async (images: ImageType) => {
    if(!images || images.length === 0) return
    const keys = images.map((image) => image.id);
    await utapi.deleteFiles(keys)
}
