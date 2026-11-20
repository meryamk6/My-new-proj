import { Config } from "@remotion/cli/config";
import fs from "fs";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setColorSpace("bt709");

// Cloud sessions can't download Chrome; use the pre-installed one if present.
const localChrome = "/opt/pw-browsers/chromium";
if (fs.existsSync(localChrome)) {
  Config.setBrowserExecutable(localChrome);
}
