const Category = require("../../models/categorySchema");

const categoryInfo = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page - 1) * limit;

        const categoryData = await Category.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); // Required for Handlebars to access data

        const totalCategories = await Category.countDocuments();
        const totalPages = Math.ceil(totalCategories / limit) || 1;

        const pagination = {
            hasPrev: page > 1,
            hasNext: page < totalPages,
            prevPage: page - 1,
            nextPage: page + 1
        };

        res.render("admin/category", {
            cat: categoryData,
            currentPage: page,
            totalPages: totalPages,
            totalCategories: totalCategories,
            pagination: pagination
        });
    } catch (error) {
        console.error("Error fetching category info:", error);
        res.status(500).send("Server Error");
    }
};

const addCategoryInfo = async (req, res) => {
    try {
        res.render("admin/addCategory");
    } catch (error) {
        console.error("Error loading add category page:", error);
        res.status(500).send("Server Error");
    }
}

const addCategory = async (req, res) => {
    try {
        const { category_name, description } = req.body;
        const image = req.file ? req.file.filename : "";

        const existingCategory = await Category.findOne({ category_name });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists" });
        }
        const newCategory = new Category({
            image,
            category_name,
            description,
            isListed: true,
            sales_quantity: 0,
            stock_quantity: 0
        })
        await newCategory.save();
        return res.status(200).json({ message: "Category added successfully" });
        return res.redirect("/admin/categories");

    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    categoryInfo,
    addCategoryInfo,
    addCategory
};