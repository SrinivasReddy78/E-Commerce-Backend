import { Document } from 'mongoose';

// Interface for a single review
export interface IReview {
  reviewerName: string;
  comment: string;
  rating: number; // Rating from 1 to 5
}

// Interface for the seller information
export interface ISeller {
  name: string;
  contact: string;
  address: string;
}

// Interface for technical specifications
export interface ITechnicalSpecifications {
  modelNumber?: string;
  dimensions?: string;
  weight?: string;
  color?: string;
  powerConsumption?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  graphicsCard?: string;
  screenSize?: string;
  operatingSystem?: string;
  batteryLife?: string;
  compatibility?: string;
  ports?: string[];
  chipset?: string;
  coolingSystem?: string;
}

// Interface for the main product schema
export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  brand: string;
  backgroundColor?: string;
  price: number;
  discount?: number; // Defaults to 0
  stock: number;
  images: string[];
  technicalSpecifications?: ITechnicalSpecifications;
  warranty?: string;
  rating?: number; // Defaults to 0
  reviews?: IReview[];
  seller: ISeller;
  tags?: string[];
  isFeatured?: boolean; // Defaults to false
  createdAt: Date;
  updatedAt: Date;
}
