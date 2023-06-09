import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
	level: {
		type: String,
		default: 'silver',
	},
	points: {
		type: Number,
		default: 0,
	},
	transaction_history: [
		{ amount: { type: Number }, date: { type: Date, default: Date.now } },
	],
});

export default mongoose.models.Membership ||
	mongoose.model('Membership', MembershipSchema);
