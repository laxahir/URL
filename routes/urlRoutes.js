import express from "express";
import { getIndex, createShortUrl, redirectShortUrl } from "../controllers/postURLshortner.js";

const router = express.Router();

router.get("/", getIndex);
router.post("/shorten", createShortUrl);
router.get("/:shortcode", redirectShortUrl);

export default router;
