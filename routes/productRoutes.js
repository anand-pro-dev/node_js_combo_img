import express from 'express';
const router = express.Router();

import Product from "../model/productModel.js";
import upload from "../middleware/uploads.js";

import {
    product_all,
    product_create,
    product_details,
    product_update,
    product_delete,
    product_delete_all
} from '../Controller/productController.js';

router.get('/', product_all);
router.get('/:id', product_details);

// router.post('/', product_create);


// Route to create a new product with multiple images
router.post('/multiImg', upload, async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);

    try {
        const { title, price, details } = req.body;
        let image = null;
        let images = [];

        // Handle single image
        if (req.files && req.files['image']) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.files['image'][0].filename}`;
        }

        // Handle multiple images
        if (req.files && req.files['multiImage']) {
            images = req.files['multiImage'].map(file => ({
                imageUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));
        }

        // Ensure the `image` field is set, using the first multi-image if no single image is provided
        if (!image && images.length > 0) {
            image = images[0].imageUrl;
        }

        // Validate required fields
        let errorMessage = '';
        if (!title) errorMessage += 'Title is required. ';
        if (!price) errorMessage += 'Price is required. ';
        if (!details) errorMessage += 'Details are required. ';
        if (!image) errorMessage += 'At least one image is required. ';

        if (errorMessage) {
            return res.status(400).json({ status: false, message: errorMessage.trim() });
        }

        const product = new Product({ title, price, image, images, details });
        const savedProduct = await product.save();

        // Remove _id from each image object in the response
        const formattedImages = savedProduct.images.map(image => ({
            imageUrl: image.imageUrl
        }));

        res.json({
            status: true,
            data: {
                title: savedProduct.title,
                price: savedProduct.price,
                details: savedProduct.details,
                image: savedProduct.image,
                images: formattedImages,
                _id: savedProduct._id,
                __v: savedProduct.__v
            }
        });

    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});




// Route to create a new product with multiple images
// router.post('/product', upload, async (req, res) => {
//     console.log('Request Body:', req.body);
//     console.log('Uploaded Files:', req.files);

//     try {
//         const { title, price, details } = req.body;
//         let image = null;
//         let images = [];

//         // Handle single image
//         if (req.files && req.files['image']) {
//             image = `${req.protocol}://${req.get('host')}/uploads/${req.files['image'][0].filename}`;
//         }

//         // Handle multiple images
//         if (req.files && req.files['multiImage']) {
//             req.files['multiImage'].forEach(file => {
//                 images.push({
//                     imageUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
//                 });
//             });
//         }

//         // Ensure the `image` field is set, using the first multi-image if no single image is provided
//         if (!image && images.length > 0) {
//             image = images[0].imageUrl;
//         }

//         // Validate required fields
//         let errorMessage = '';
//         if (!title) errorMessage += 'Title is required. ';
//         if (!price) errorMessage += 'Price is required. ';
//         if (!details) errorMessage += 'Details are required. ';
//         if (!image) errorMessage += 'At least one image is required. ';

//         if (errorMessage) {
//             return res.status(400).json({ status: false, message: errorMessage.trim() });
//         }

//         const product = new Product({ title, price, image, images, details });
//         const savedProduct = await product.save();
//         res.json({ status: true, data: savedProduct });

//     } catch (error) {
//         res.status(400).json({ status: false, error: error.message });
//     }
// });


router.put('/:id', product_update);

router.delete('/:id', product_delete);

router.delete('/all/delete', product_delete_all);

export default router;