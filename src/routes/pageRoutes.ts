import { Router } from "express"
const router = Router();
router.get("/", (req, res) => {
    res.render("home");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

router.get("/informações", (req, res) => {
    res.render("informações");
});

export default router;