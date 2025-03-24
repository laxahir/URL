// import { readFile, writeFile } from "fs/promises";
// import { createServer } from "http";
// import crypto from "crypto"
// import path from "path";

// const PORT = 3000;
// const DATA_FILE = path.join("data", "links.json");

// const serverFile = async (res, filePath, contentType) => {
//     try {
//         const data = await readFile(filePath);
//         res.writeHead(200, { "Content-Type": contentType });
//         res.end(data);
//     } catch (error) {
//         res.writeHead(404, { "Content-Type": "text/plain" });
//         res.end("404 page not found");
//     }
// }

// const loadLinks = async () => {
//     try {
//         const data = await readFile(DATA_FILE, "utf-8");
//         if (!data.trim()) {
//             return {};
//         }
//         return JSON.parse(data);
//     } catch (error) {
//         if (error.code === "ENOENT") {
//             await writeFile(DATA_FILE, JSON.stringify({}));
//             // return {};
//         }
//         throw error;
//     }
// };

// const saveLinks = async (links) => {
//     await writeFile(DATA_FILE, JSON.stringify(links))
// }

// const server = createServer(async (req, res) => {
//     console.log(req.url);

//     if (req.method === "GET") {
//         if (req.url === "/") {
//             return serverFile(res, path.join("public", "index.html"), "text/html")
//         } else if (req.url === "/style.css") {
//             return serverFile(res, path.join("public", "style.css"), "text/css")
//         } else if (req.url === "/links") {
//             const links = await loadLinks();

//             res.writeHead(200, { "Content-Type": "applicatio/json" });
//             return res.end(JSON.stringify(links))
//         } else {
//             const links = await loadLinks()
//             const shortenCode = req.url.slice(1);
//             console.log("link red.", req.url);
//             if (links[shortenCode]) {
//                 res.writeHead(303, { location: links[shortenCode] })
//                 return res.end;
//             }

//             res.writeHead(404, { "Content-Type": "text/plain" });
//             return res.end("404 page not found");

//         }
//     }

//     if (req.method === "POST" && req.url === "/shorten") {

//         const links = await loadLinks();

//         let body = "";
//         req.on("data", (chunk) => {
//             return body += chunk;
//         });

//         req.on("end", async () => {
//             console.log(body);
//             const { url, shortenCode } = JSON.parse(body);

//             if (!url) {
//                 res.writeHead(400, { "Content-Type": "text/plain" })
//                 return res.end("URL is require")
//             }

//             const finalShortCode = shortenCode || crypto.randomBytes(4).toString("hex");

//             if (links[finalShortCode]) {
//                 res.writeHead(400, { "Content-Type": "text/plain" })
//                 return res.end("Short code already exist. Please choose another.")

//             }

//             if (links[finalShortCode]) {
//                 alert("Short code already exist. Please choose another.");
//             }

//             links[finalShortCode] = url;

//             await saveLinks(links)

//             res.writeHead(200, { "Content-Type": "application/json" })
//             res.end();
//             res.end(JSON.stringify({ message: "Shortened successfully", shortenCode: finalShortCode }));
//         });
//     }
// });

// server.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });


import { readFile, writeFile } from "fs/promises";
import { createServer } from "http";
import crypto from "crypto";
import path from "path";

const PORT = 3000;
const DATA_FILE = path.join("data", "links.json");

const serverFile = async (res, filePath, contentType) => {
    try {
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch (error) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 page not found");
    }
}

const loadLinks = async () => {
    try {
        const data = await readFile(DATA_FILE, "utf-8");
        if (!data.trim()) {
            return {};
        }

        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            await writeFile(DATA_FILE, JSON.stringify({}));
        }
        throw error;
    }
};


const saveLinks = async (links) => {
    await writeFile(DATA_FILE, JSON.stringify(links))
}

const server = createServer(async (req, res) => {
    console.log(req.url);

    if (req.method === "GET") {
        if (req.url === "/") {
            return serverFile(res, path.join("public", "index.html"), "text/html");
        } else if (req.url === "/style.css") {
            return serverFile(res, path.join("public", "style.css"), "text/css");
        } else if (req.url === "/links") {
            const links = await loadLinks();
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(links));
        } else {
            const links = await loadLinks();
            const shortenCode = req.url.slice(1);
            console.log("link red.", req.url);
            if (links[shortenCode]) {
                res.writeHead(303, { location: links[shortenCode] });
                return res.end();
            }

            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("404 page not found");
        }
    }

    if (req.method === "POST" && req.url === "/shorten") {

        const links = await loadLinks();

        let body = "";
        req.on("data", (chunk) => {
            return body += chunk;
        });

        req.on("end", async () => {
            console.log(body);
            const { url, shortenCode } = JSON.parse(body);

            if (!url) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("URL is required");
            }

            const finalShortCode = shortenCode || crypto.randomBytes(4).toString("hex");

            if (links[finalShortCode]) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("Short code already exists. Please choose another.");
            }

            links[finalShortCode] = url;

            await saveLinks(links);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Shortened successfully", shortenCode: finalShortCode }));
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
