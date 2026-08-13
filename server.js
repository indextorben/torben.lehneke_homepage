const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const root = __dirname;
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

http
  .createServer((request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end("Method not allowed");
      return;
    }

    const requestedPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relativePath = requestedPath === "/" ? "index.html" : requestedPath.replace(/^\/+/, "");
    const filePath = path.resolve(root, relativePath);

    if (!filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stats) => {
      const resolvedPath = !error && stats.isDirectory() ? path.join(filePath, "index.html") : filePath;
      fs.readFile(resolvedPath, (readError, content) => {
        if (readError) {
          response.writeHead(readError.code === "ENOENT" ? 404 : 500, { "Content-Type": "text/plain; charset=utf-8" });
          response.end(readError.code === "ENOENT" ? "Not found" : "Server error");
          return;
        }

        response.writeHead(200, {
          "Content-Type": types[path.extname(resolvedPath).toLowerCase()] || "application/octet-stream",
        });
        response.end(request.method === "HEAD" ? undefined : content);
      });
    });
  })
  .listen(port, () => {
    console.log(`Website is running at http://localhost:${port}`);
  });
