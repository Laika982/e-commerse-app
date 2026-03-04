const User = require("../../models/userSchema");

const customerInfo = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect("/admin/login");
        }
        let search = "";
        if (req.query.search) {
            search = req.query.search;
        }
        let page = parseInt(req.query.page) || 1;
        const limit = 5;

        const userData = await User.find({
            isAdmin: false,
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        })
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        const count = await User.find({
            isAdmin: false,
            $or: [
                { name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        }).countDocuments();

        const totalPages = Math.ceil(count / limit);
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push({
                page: i,
                active: i === page
            });
        }

        res.render("admin/customer", {
            data: userData,
            totalPages: totalPages,
            currentPage: page,
            pages: pages,
            search: search
        });

    } catch (error) {
        console.log("Error in customerInfo:", error);
        res.redirect("/pageerror");
    }
}

const customerBlocked = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect("/admin/login");
        }
        let id = req.query.id;
        await User.updateOne({ _id: id }, { $set: { isBlocked: true } });
        res.redirect("/admin/users");
    } catch (error) {
        console.log("Error in customerBlocked:", error);
        res.redirect("/pageerror");
    }
}

const customerunBlocked = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect("/admin/login");
        }
        let id = req.query.id;
        await User.updateOne({ _id: id }, { $set: { isBlocked: false } });
        res.redirect("/admin/users");
    } catch (error) {
        console.log("Error in customerunBlocked:", error);
        res.redirect("/pageerror");
    }
}

module.exports = {
    customerInfo,
    customerBlocked,
    customerunBlocked
};