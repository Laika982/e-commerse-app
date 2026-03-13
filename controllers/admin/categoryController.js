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
        res.redirect("/admin/categories");
        return res.status(200).json({ message: "Category added successfully" });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).send("Server Error");
    }
}

const editCategoryInfo = async (req, res) => {
    try {
        const id = req.query.id;
        const category = await Category.findById(id);
        if (!category) {
            return res.redirect("/admin/categories");
        }
        res.render("admin/editCategory", { category });
    } catch (error) {
        console.error("Error loading edit category page:", error);
        res.status(500).send("Server Error");
    }
};

const editCategory = async (req, res) => {
    try {
        const id = req.query.id;
        const { category_name, description } = req.body;

        const existingCategory = await Category.findOne({ category_name, _id: { $ne: id } });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        category.category_name = category_name;
        category.description = description;

        if (req.file) {
            category.image = req.file.filename;
        }

        await category.save();
        res.redirect("/admin/categories");
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Server Error");
    }
};

const deleteCategory = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.redirect("/admin/categories");
        }
        await Category.findByIdAndDelete(id);
        res.redirect("/admin/categories");
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    categoryInfo,
    addCategoryInfo,
    addCategory,
    editCategoryInfo,
    editCategory,
    deleteCategory
};