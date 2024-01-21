import { readFile } from "fs-extra";
import { resolve } from "path";
import { z } from "zod";
import { S3 } from "@aws-sdk/client-s3";

let s3 = new S3({
  apiVersion: "2012-10-17",
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  },
  // endpoint: process.env.AWS_ENDPOINT || '',
  maxAttempts: 3
});

const FrontMatterTypingsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  shortTitle: z.string(),
  section: z.string(),
  position: z.number()
});

const MetaDataObjectSchema = z.object({
  name: z.string(),
  position: z.number(),
  children: z.array(FrontMatterTypingsSchema)
});

export type MetaDataObject = z.infer<typeof MetaDataObjectSchema>;

/**
 *
 * @param packageSlug - Slug of the package we're interested in
 * @param slug - Slug of the post we're interested in
 * @returns
 */
export const getPostContent = async (slug: string | undefined, version: string = "main") => {
  /**
   * If we are in development mode, we can just read the file from the file system.
   */
  if (process.env.NODE_ENV === "development") {
    const content = await readFile(resolve(__dirname, "../", `${version === 'main' ? 'posts' : 'posts_dev'}/${slug || "installation"}.mdx`), "utf-8");

    if (!content) {
      return null;
    }

    return content;
  }

  const promise = await s3.getObject({
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: `${version === 'main' ? 'posts_v3' : 'posts_v3_dev'}/${slug || "installation"}.mdx`
  })

  return await promise.Body?.transformToString();
};

export const getPostMetaData = async (version: string = "main") => {
  /**
   * If we are in development mode, we can just read the file from the file system.
   */
  if (process.env.NODE_ENV === "development") {
    /**
     * Don't want to automate this part cause I don't feel like.
     *
     * Before you run `npm run dev`, run `npm run generator` first. This keeps the post metadata up to date,
     * if you add a new post or delete, open another terminal and re-run. Then refresh your application to
     * get the latest metadata.
     *
     * Todo: Generate metadata in development without the use of a github token.
     */
    const content = await readFile(resolve(__dirname, "../", `${version === 'main' ? 'posts' : 'posts_dev'}/metadata.json`), "utf-8");

    if (!content) {
      return null;
    }
    const parsed_content = JSON.parse(content);

    return z.array(MetaDataObjectSchema).parse(parsed_content);
  }

  const promise = await s3.getObject({
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: `${version === 'main' ? 'posts_v3' : 'posts_v3_dev'}/metadata.json`
  })

  const content = await promise.Body?.transformToString() || '[{}]';

  const data = z.array(MetaDataObjectSchema).parse(JSON.parse(content));
  return data;
};
