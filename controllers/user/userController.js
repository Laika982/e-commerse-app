

const pageNotFound = async (req,res)=>{
    try {
        return res.render("user/pageNotFound")
    } catch (error) {
        res.redirect("/pageNotFound")
            console.log(error);
    }
}

const loadHomepage = async (req,res)=>{
    try {
        return res.render("user/home")
    } catch (error) {     
        console.log(error);      
    }
}


module.exports = {
    loadHomepage,
    pageNotFound,
}