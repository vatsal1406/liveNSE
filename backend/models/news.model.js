import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            trim: true,
            index: true,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },
        headline: {
            type: String,
            required: true,
            trim: true,
        },

        // Complete extracted content from the linked document
        fullText: {
            type: String,
            default: "",
        },

        // Original document URL from RSS
        link: {
            type: String,
            required: true,
        },

        // Type of document pointed to by 'link'
        documentType: {
            type: String,
            enum: ["pdf", "xml", "html", "unknown"],
            default: "unknown",
        },

        guid: {
            type: String,
            required: true,
            unique: true,
        },

        category: {
            type: String,
            required: true,
        },

        source: {
            type: String,
            required: true,
            default: "NSE",
        },

        publishedAt: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

newsSchema.index({ company: 1, publishedAt: -1 });

const News = mongoose.model("News", newsSchema);

export default News;