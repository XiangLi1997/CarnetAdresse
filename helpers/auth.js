module.exports = {
    ensureAuthenticated:(req,res,next) =>{
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg","Connectez-vous d'abord");
        res.redirect("/users/login");

}}