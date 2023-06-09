import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	_id: {},
	name: {},
	email: {},
	image: {},
	emailVerified: {},
	membership: {},
	isNewUser: {},
});

export default mongoose.connection.useDb('nextauth').models.User ||
	mongoose.connection.useDb('nextauth').model('User', UserSchema);
