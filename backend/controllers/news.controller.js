import News from "../models/news.model.js";

export const getOneNews = async (req, res) => {
    try {
        const news = await News.findOne()
            .sort({ publishedAt: -1 });

        if (!news) {
            return res.status(404).json({
                message: "No news found",
            });
        }

        res.status(200).json(news);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const searchNews = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const news = await News.find({
            company: {
                $regex: query,
                $options: "i", // case-insensitive
            },
        }).sort({ publishedAt: -1 });

        res.status(200).json({
            success: true,
            count: news.length,
            data: news,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to search news",
        });
    }
};


export const getNews = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 50;

        const news = await News.find()
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalNews = await News.countDocuments();


        res.status(200).json({
            success: true,
            page,
            limit,
            totalNews,
            count: news.length,
            data: news,
        });

    } catch (error) {
        console.error("Error fetching news:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch news",
            error: error.message,
        });
    }
};

export const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: "News not found",
            });
        }

        res.status(200).json({
            success: true,
            data: news,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};