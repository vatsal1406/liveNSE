import Parser from "rss-parser";
import rssFeeds from "../config/rssFeeds.js";
import News from "../models/news.model.js";
import { extractDocument } from "../utils/documentExtractor.js";
import { summarizeAnnouncement } from "./gemini.service.js";

const parser = new Parser();

export const syncNews = async () => {
    for (const feed of rssFeeds) {
        try {
            const rss = await parser.parseURL(feed.url);

            for (const item of rss.items) {
                try {

                    if (!item.link) {
                        continue;
                    }

                    const guid = item.guid || item.link;

                    // Check if already present in MongoDB
                    const exists = await News.exists({ guid });

                    if (exists) {
                        continue;
                    }
                    let documentType = "unknown";

                    if (item.link?.toLowerCase().endsWith(".pdf")) {
                        documentType = "pdf";
                    } else if (item.link?.toLowerCase().endsWith(".xml")) {
                        documentType = "xml";
                    } else if (item.link) {
                        documentType = "html";
                    }

                    // Extract full document text
                    const rawText = await extractDocument(
                        item.link,
                        documentType
                    );

                    const aiResult = await summarizeAnnouncement(rawText);

                    const article = {
                        title: item.title || "",
                        company: "",
                        description: item.contentSnippet || item.content || "",
                        headline:aiResult?.headline || item.title || "",
                        fullText:aiResult?.summary || rawText.substring(0, 1000),
                        link: item.link || "",
                        documentType,
                        guid: item.guid || item.link,
                        category: feed.category,
                        source: "NSE",
                        publishedAt: item.pubDate
                            ? new Date(item.pubDate)
                            : new Date(),
                    };

                    await News.create(article);
                } catch (error) {
                    // Ignore duplicate entries
                    if (error.code !== 11000) {
                        console.error(
                            `Failed to process article: ${item.title || "Unknown Title"
                            }`
                        );
                        console.error(error.message);
                    }
                }
            }

            console.log(
                `${feed.name}: ${rss.items.length} items processed`
            );
        } catch (error) {
            console.error(
                `Failed to fetch ${feed.name}: ${error.message}`
            );
        }
    }

    console.log("RSS sync completed");
};