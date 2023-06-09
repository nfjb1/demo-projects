import mongoose from 'mongoose';

const NotificationsSchema = new mongoose.Schema({
	id: {
		type: String,
		default: () => Math.random().toString(36),
		unique: true,
	},
	sender: { type: mongoose.Schema.Types.ObjectId, required: true },
	receiver: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
	title: { type: String, required: true, default: 'Notification' },
	description: { type: String, required: true },
	read_by: [
		{
			type: mongoose.Schema.Types.ObjectId,
		},
	],
	created_at: { type: Date, default: Date.now, required: true },
});

export default mongoose.connection.useDb('data').models.Notification ||
	mongoose.connection.useDb('data').model('Notification', NotificationsSchema);
