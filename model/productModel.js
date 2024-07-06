import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    details: { type: String, required: true },
    image: { type: String, required: true }, // Main image
    images: [{ imageUrl: String }], // Array of additional images
});

const Product = mongoose.model('Product', productSchema);

export default Product;
