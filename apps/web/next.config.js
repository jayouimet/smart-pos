module.exports = {
  // (Optional) Export as a standalone site
  // See https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
  output: 'standalone', // Feel free to modify/remove this option

  // Indicate that these packages should not be bundled by webpack
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hackernoon.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};
