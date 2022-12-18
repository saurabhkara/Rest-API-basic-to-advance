import { Product } from "../models";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler";
import fs from "fs";
import productSchema from "../validators/productShema";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image"); //fileSize:5MB

const productController = {
  async store(req, res, next) {
    //multi part form data
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      const filePath = req.file.path;

      //validation
      const { error } = productSchema.validate(req.body);
      if (error) {
        //Delete the uploaded pic
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError());
          }
        });
        return next(error);
      }

      const { name, price, size } = req.body;

      let document;
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filePath,
        });
      } catch (error) {
        return next(err);
      }

      res.status(201).json(document);
    });
  },






  update(req, res, next) {

    handleMultipartData(req, res, async (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError(err.message));
        }
  
        let filePath 
        if(req.file){
           filePath = req.file.path
        }
  
        //validation
        const { error } = productSchema.validate(req.body);
        if (error) {
          //Delete the uploaded pic
          if(req.file){
            fs.unlink(`${appRoot}/${filePath}`, (err) => {
                if (err) {
                  return next(CustomErrorHandler.serverError());
                }
              });
          }
          return next(error);
        }
  
        const { name, price, size } = req.body;
  
        let document;
        try {
          document = await Product.findOneAndUpdate({_id:req.params.id},{
            name,
            price,
            size,
            ...(req.file && {image: filePath})
          });
        } catch (error) {
          return next(err);
        }
  
        res.status(201).json(document);
      });

  },
};

export default productController;