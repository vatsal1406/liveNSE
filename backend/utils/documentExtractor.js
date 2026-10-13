import axios from "axios";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";

const axiosConfig = {
    timeout: 30000,
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        Accept: "*/*",
    },
};

// ---------------- PDF ----------------

const extractPdf = async (url) => {
    try {
        const response = await axios.get(url, {
            ...axiosConfig,
            responseType: "arraybuffer",
        });

        const data = await pdfParse(response.data);

        return data.text
            .replace(/\s+/g, " ")
            .trim();
    } catch (error) {
        console.error(`PDF extraction failed: ${url}`);
        console.error(error.message);
        return "";
    }
};

// ---------------- XML ----------------

function extractReadableText(obj) {
    let output = [];

    const traverse = (value) => {
        if (value == null) return;

        if (typeof value === "string") {
            const text = value.trim();

            if (text.length > 1) {
                output.push(text);
            }

            return;
        }

        if (Array.isArray(value)) {
            value.forEach(traverse);
            return;
        }

        if (typeof value === "object") {
            Object.values(value).forEach(traverse);
        }
    };

    traverse(obj);

    // Remove duplicates
    output = [...new Set(output)];

    // Decode any HTML inside the XML values
    const $ = cheerio.load(output.join("\n"));

    return $.text()
        .replace(/\s+/g, " ")
        .trim();
}

const extractXml = async (url) => {
    try {
        const response = await axios.get(url, axiosConfig);

        const parser = new XMLParser({
            ignoreAttributes: true,
            trimValues: true,
            parseTagValue: true,
            parseAttributeValue: true,
        });

        const json = parser.parse(response.data);

        return extractReadableText(json);

    } catch (error) {
        console.error(`XML extraction failed: ${url}`);
        console.error(error.message);
        return "";
    }
};

// ---------------- HTML ----------------

const extractHtml = async (url) => {
    try {
        const response = await axios.get(url, axiosConfig);

        const $ = cheerio.load(response.data);

        $("script").remove();
        $("style").remove();
        $("noscript").remove();

        return $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim();

    } catch (error) {
        console.error(`HTML extraction failed: ${url}`);
        console.error(error.message);
        return "";
    }
};

// ---------------- Main ----------------

export const extractDocument = async (url, documentType) => {
    if (!url) return "";

    switch (documentType) {

        case "pdf":
            return await extractPdf(url);

        case "xml":
            return await extractXml(url);

        case "html":
            return await extractHtml(url);

        default:
            return "";
    }
};