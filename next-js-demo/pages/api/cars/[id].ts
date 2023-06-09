import dbConnect from '@/api-lib/dbConnect';
import Car from '@/api-lib/db/models/Car';

export default async function handler(req, res) {
	const {
		query: { id },
		method,
	} = req;

	await dbConnect();

	switch (method) {
		case 'GET' /* Get a model by its ID */:
			try {
				// find a model in the database by {metaData.carId: id}

				const car = await Car.find({ 'metaData.carId': id });

				if (!car) {
					return res
						.status(400)
						.json({ success: false, message: 'No car found' });
				}
				res.status(200).json({ success: true, data: car });
			} catch (error) {
				res.status(400).json({ success: false, message: error.message });
			}
			break;

		case 'PUT' /* Edit a model by its ID */:
			try {
				const car = await Car.findAndUpdate({ 'metaData.carId': id }, req.body, {
					new: true,
					runValidators: true,
				});
				if (!car) {
					return res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: car });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case 'DELETE' /* Delete a model by its ID */:
			try {
				const deletedCar = await Car.deleteOne({ 'metaData.carId': id });
				if (!deletedCar) {
					return res.status(400).json({ success: false });
				}
				res.status(200).json({ success: true, data: {} });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		default:
			res.status(400).json({ success: false, message: 'Method not allowed' });
			break;
	}
}
