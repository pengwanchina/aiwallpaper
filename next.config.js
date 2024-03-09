/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "wphoenix-aiwallpaper-demo.s3.us-east-2.amazonaws.com",
      "gpts-works.s3.us-west-1.amazonaws.com",
      "trysai.s3.us-west-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
