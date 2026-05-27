import fs from "node:fs";
import https from "node:https";
import http from "node:http";
import { MovieDownloadPlan } from "./download_plan";

function downloadUrl(url: string, outputPath: string, redirects = 0): Promise<boolean> {
  return new Promise((resolve) => {
    if (redirects > 5) {
      console.log("DOWNLOAD_REDIRECT_LIMIT=", url);
      return resolve(false);
    }

    const client = url.startsWith("http://") ? http : https;
    const file = fs.createWriteStream(outputPath);

    const request = client.get(url, (response) => {
      const status = response.statusCode || 0;
      const location = response.headers.location;

      if ([301, 302, 303, 307, 308].includes(status) && location) {
        file.close();
        try { fs.unlinkSync(outputPath); } catch {}
        const nextUrl = new URL(location, url).toString();
        console.log("DOWNLOAD_REDIRECT=", nextUrl);
        return resolve(downloadUrl(nextUrl, outputPath, redirects + 1));
      }

      if (status !== 200) {
        file.close();
        try { fs.unlinkSync(outputPath); } catch {}
        console.log("DOWNLOAD_FAILED_STATUS=", status, url);
        return resolve(false);
      }

      let bytes = 0;
      response.on("data", (chunk) => {
        bytes += chunk.length;
      });

      response.pipe(file);

      file.on("finish", () => {
        file.close();

        if (bytes < 100_000) {
          try { fs.unlinkSync(outputPath); } catch {}
          console.log("DOWNLOAD_TOO_SMALL=", bytes, url);
          return resolve(false);
        }

        console.log("DOWNLOAD_OK=", bytes, outputPath);
        resolve(true);
      });
    });

    request.setTimeout(60000, () => {
      request.destroy();
      try { fs.unlinkSync(outputPath); } catch {}
      console.log("DOWNLOAD_TIMEOUT=", url);
      resolve(false);
    });

    request.on("error", (error) => {
      try { fs.unlinkSync(outputPath); } catch {}
      console.log("DOWNLOAD_ERROR=", error.message, url);
      resolve(false);
    });
  });
}

export async function downloadMovieFile(plan: MovieDownloadPlan): Promise<boolean> {
  const ok = await downloadUrl(plan.candidate.downloadUrl, plan.tempPath);

  if (!ok) return false;

  try {
    fs.renameSync(plan.tempPath, plan.finalPath);
    return true;
  } catch (error: any) {
    console.log("DOWNLOAD_RENAME_ERROR=", error.message);
    try { fs.unlinkSync(plan.tempPath); } catch {}
    return false;
  }
}
