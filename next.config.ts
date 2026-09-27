import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 모드 외부 IP 접속(HMR) 허용
  allowedDevOrigins: ["192.168.123.179"],
};

export default nextConfig;
