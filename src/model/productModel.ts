import mongoose from 'mongoose';
import {IProduct, IReview, ITechnicalSpecifications} from '../types/productType'


// Sub-schema for reviews
const reviewSchema = new mongoose.Schema<IReview>({
    reviewerName: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
})

// Sub-schema for technical specifications
const technicalSpecificationsSchema = new mongoose.Schema<ITechnicalSpecifications>({
    modelNumber: { type: String },
    dimensions: { type: String },
    weight: { type: String },
    color: { type: String },
    powerConsumption: { type: String },
    processor: { type: String },
    ram: { type: String },
    storage: { type: String },
    graphicsCard: { type: String },
    screenSize: { type: String },
    operatingSystem: { type: String },
    batteryLife: { type: String },
    compatibility: { type: String },
    ports: { type: [String] },
    chipset: { type: String },
    coolingSystem: { type: String },
});


// Main product schema
const productSchema = new mongoose.Schema<IProduct>({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    backgroundColor: {type: String, required: false},
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: { type: [String], required: true },
    technicalSpecifications: { type: technicalSpecificationsSchema },
    warranty: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: [reviewSchema] },
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'seller'},
    tags: { type: [String] },
    isFeatured: { type: Boolean, default: false },
}, {timestamps: true});

export default mongoose.model<IProduct>('product', productSchema);