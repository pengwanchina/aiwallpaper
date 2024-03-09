// import AWS from "aws-sdk";
// import { Readable } from "stream";
// import axios from "axios";
// import fs from "fs";

// AWS.config.update({
//   accessKeyId: process.env.AWS_AK,
//   secretAccessKey: process.env.AWS_SK,
// });

// const s3 = new AWS.S3();

// export async function downloadAndUploadImage(
//   imageUrl: string,
//   bucketName: string,
//   s3Key: string
// ) {
//   console.log(
//     "======Downloading an Uploading: =======",
//     "\nimageUrl is:",
//     imageUrl,
//     "\nbucketName is:",
//     bucketName,
//     "\ns3key is:",
//     s3Key
//   );
//   try {
//     const response = await axios({
//       method: "GET",
//       url: imageUrl,
//       responseType: "stream",
//     });

//     console.log("========axios ok:=========\n");

//     const uploadParams = {
//       Bucket: bucketName,
//       Key: s3Key,
//       Body: response.data as Readable,
//     };

//     return s3.upload(uploadParams).promise();
//   } catch (e) {
//     console.log("========upload failed:=========\n", e);
//     throw e;
//   }
// }

// export async function downloadImage(imageUrl: string, outputPath: string) {
//   try {
//     const response = await axios({
//       method: "GET",
//       url: imageUrl,
//       responseType: "stream",
//     });

//     return new Promise((resolve, reject) => {
//       const writer = fs.createWriteStream(outputPath);
//       response.data.pipe(writer);

//       let error: Error | null = null;
//       writer.on("error", (err) => {
//         error = err;
//         writer.close();
//         reject(err);
//       });

//       writer.on("close", () => {
//         if (!error) {
//           resolve(null);
//         }
//       });
//     });
//   } catch (e) {
//     console.log("upload failed:", e);
//     throw e;
//   }
// }
import AWS from "aws-sdk";
import fetch from "node-fetch";
import fs from "fs";

AWS.config.update({
  accessKeyId: process.env.AWS_AK,
  secretAccessKey: process.env.AWS_SK,
});

const s3 = new AWS.S3();

// 使用node-fetch下载图片并上传到S3
export async function downloadAndUploadImage(
  imageUrl: string,
  bucketName: string,
  s3Key: string
) {
  console.log(
    "======Downloading and Uploading: =======",
    "\nimageUrl is:",
    imageUrl,
    "\nbucketName is:",
    bucketName,
    "\ns3key is:",
    s3Key
  );
  try {
    // 使用node-fetch获取图片
    const response = await fetch(imageUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 检查response.body是否为null
    if (response.body === null) {
      throw new Error("Response body is null");
    }

    // 创建上传参数
    const uploadParams = {
      Bucket: bucketName,
      Key: s3Key,
      Body: response.body as unknown as ReadableStream, // 使用类型断言
    };

    // 使用AWS SDK上传图片到S3
    return s3.upload(uploadParams).promise();
  } catch (e) {
    console.error("========upload failed:=========\n", e);
    throw e;
  }
}

// 使用node-fetch下载图片并保存到本地
export async function downloadImage(imageUrl: string, outputPath: string) {
  try {
    // 使用node-fetch获取图片
    const response = await fetch(imageUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 检查response.body是否为null
    if (response.body === null) {
      throw new Error("Response body is null");
    }

    // 创建一个可写流并将node-fetch的Response对象的数据写入本地文件
    const writer = fs.createWriteStream(outputPath);
    response.body.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("error", (err) => {
        reject(err);
      });

      writer.on("finish", () => {
        resolve(null);
      });
    });
  } catch (e) {
    console.error("download failed:", e);
    throw e;
  }
}
