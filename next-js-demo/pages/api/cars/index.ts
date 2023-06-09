import dbConnect from '../../../api-lib/dbConnect';
import Car from '../../../api-lib/db/models/Car';

export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			try {
				const cars = await Car.find({}); /* find all the data in our database */

				setTimeout(() => {
					res.status(200).json({ success: true, data: cars });
				}, 1000);
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'POST':
			try {
				const car = await Car.create(
					req.body
				); /* create a new model in the database */
				res.status(201).json({ success: true, data: car });
			} catch (error) {
				res.status(400).json({ success: false, message: error.message });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
