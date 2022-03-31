import AWS from "aws-sdk";

import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const AUCTIONS_TABLE = process.env.AUCTIONS_TABLE;

async function getAuctions(event, context) {
	let auctions = [];

	try {
		const result = await dynamoDb
			.scan({
				TableName: AUCTIONS_TABLE,
			})
			.promise();

		auctions = result.Items;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError();
	}

	return {
		statusCode: 200,
		body: JSON.stringify(auctions),
	};
}

export const handler = commonMiddleware(getAuctions);
