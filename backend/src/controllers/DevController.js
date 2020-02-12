const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const {findConnections, sendMessage} = require('../websocket');

module.exports = {

	async index (request, response){
		const devs = await Dev.find();

		return response.json(devs);
	},

	async store (request, response) {
		const {github_username, techs, latitude, longitude} = request.body;

		let dev = await Dev.findOne({ github_username });

		if (!dev) {
			const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

			const {name = login, avatar_url, bio} = apiResponse.data;

			const techsArray = parseStringAsArray(techs);

			const location = {
				type: 'Point',
				coordinates: [longitude, latitude]
			};

			dev = await Dev.create({
				github_username,
				name,
				avatar_url,
				bio,
				techs: techsArray,
				location,
			})

			//Filtrar conexões por 10 km e tecnologias da busca
			const sendSocketMessageTo = findConnections(
				{latitude, longitude},
				techsArray,
			)

			sendMessage(sendSocketMessageTo, 'new-dev', dev);
		}

		return response.json(dev);
	},

	async update(request, response){
		const {github_username, techs, latitude, longitude} = request.body;

		let dev = await Dev.findOne({github_username});

		if(dev)	{		
			const techsArray = parseStringAsArray(techs);

			const location = {
				type: 'Point',
				coordinates: [longitude, latitude]
			};


			dev = await dev.updateOne({
				techs: techsArray,
				location,
			})
		};

		return response.json({
			modifiedCount: dev.nModified,
            ok: dev.ok
		});

	},

	async destroy(request, response){
		const {github_username} = request.query;

		await Dev.deleteOne({github_username});

		return response.json();
	}
};