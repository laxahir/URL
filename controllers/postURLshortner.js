import crypto from "crypto";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "../data/links.json");

async function loadLinks() {
    try {
        const raw = await readFile(DATA_FILE, "utf-8");
        return JSON.parse(raw || "{}");
    } catch (err) {
        if (err.code === "ENOENT") {
            await writeFile(DATA_FILE, "{}");
            return {};
        }
        throw err;
    }
}

function saveLinks(links) {
    return writeFile(DATA_FILE, JSON.stringify(links, null, 2));
}

export async function getIndex(req, res) {
    const links = await loadLinks();
    res.render("index", {
        links,
        shortUrl: null,
        host: req.get("host"),
        error: null
    });
}

export async function createShortUrl(req, res) {
    const { url, shortcode } = req.body;
    const links = await loadLinks();
    const code = shortcode || crypto.randomBytes(3).toString("hex");

    if (links[code]) {
        return res.render("index", {
            links,
            shortUrl: null,
            host: req.get("host"),
            error: "That shortcode is already taken."
        });
    }

    links[code] = url;
    await saveLinks(links);

    const shortUrl = `${req.protocol}://${req.get("host")}/${code}`;
    res.render("index", {
        links,
        shortUrl,
        host: req.get("host"),
        error: null
    });
}

export async function redirectShortUrl(req, res) {
    const links = await loadLinks();
    const { shortcode } = req.params;

    if (!links[shortcode]) {
        return res.status(404).send("404 — Shortcode not found");
    }
    res.redirect(links[shortcode]);
}
