import mongoose from 'mongoose';

/* CarSchema will correspond to a collection in your MongoDB database. */
const CarSchema = new mongoose.Schema({
	carData: {
		brand: {
			type: String,
			required: true,
		},
		model: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		mileage: {
			type: Number,
			required: true,
		},
		firstRegistration: {
			type: Date,
			required: true,
		},
		bodyType: {
			type: String,
			required: true,
		},
		engine: {
			type: String,
			required: true,
		},
		performance: {
			type: Number,
			required: true,
		},
		transmission: {
			type: String,
			required: true,
		},
		firstDelivery: {
			type: Date,
			required: true,
		},
		expectedTotalPerformance: {
			type: Number,
			required: true,
		},
		expectedAverageTotalPerformancePerYear: {
			type: Number,
			required: true,
		},
		numberOfTokens: {
			type: Number,
			required: true,
		},
		startOfPeriod: {
			type: Date,
			required: true,
		},
		expectedEndOfPeriod: {
			type: Date,
			required: true,
		},
		nextDistribution: {
			type: Date,
			required: true,
		},
		mileageReadingDate: {
			type: Date,
			required: true,
		},
	},
	metaData: {
		carId: {
			type: String,
			default: () => Math.random().toString(36).substr(2, 9),
			unique: true,
		},
		dateAdded: {
			type: Date,
			default: Date.now,
		},
		imageUrl: {
			type: String,
			default: 'https://via.placeholder.com/150',
		},
		stage: {
			type: String,
			default: 'none',
			enum: ['none', 'funding', 'funding_closed', 'trading'],
		},
		stageProgress: {
			type: Number || null,
			default: 0,
		},
	},
});

export default mongoose.models.Car || mongoose.model('Car', CarSchema);
