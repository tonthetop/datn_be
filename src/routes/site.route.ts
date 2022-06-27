import express,{Request,Response,NextFunction} from "express";

// import categoryController from "../controllers/category.controller";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Welcome to PBL7 @@@" });
});

export default router;
