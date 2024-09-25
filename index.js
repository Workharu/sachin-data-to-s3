import AWS from "aws-sdk";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client
const s3 = new AWS.S3();

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
const day = String(now.getDate()).padStart(2, "0");

const uuid = uuidv4();

export const fetchDataAndUploadToS3 = async () => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get(process.env.API_URL);
    const data = JSON.stringify(response.data);

    // Define S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `year=${year}/month=${month}/day=${day}/${uuid}.json`,
      Body: data,
      ContentType: "application/json",
    };

    // Upload data to S3
    const result = await s3.upload(params).promise();
    console.log("Data uploaded successfully:", result.Location);

    return { statusCode: 200, body: "Data fetched and uploaded to S3." };
  } catch (error) {
    console.error("Error fetching or uploading data:", error);
    return { statusCode: 500, body: "Failed to fetch or upload data." };
  }
};

fetchDataAndUploadToS3();
