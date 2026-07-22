import { Router } from "express";


const router = Router();



router.get("/", (req, res) => {

    res.json({
        projeto: "Academia E.M",
        status: "online"
    });

});



export default router;