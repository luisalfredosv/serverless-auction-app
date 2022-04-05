import AWS from "aws-sdk";

import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const AUCTIONS_TABLE = process.env.AUCTIONS_TABLE;

export async function getAuctionById(auctionId) {
	let auction = {};
	try {
		const result = await dynamoDb
			.get({
				TableName: AUCTIONS_TABLE,
				Key: { id: auctionId },
			})
			.promise();

		auction = result.Item;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError();
	}

	if (!auction) {
		throw new createError.NotFound(
			`Auction with id ${auctionId} was not found`
		);
	}
	return auction;
}

async function getAuction(event, context) {
	const { auctionId } = event.pathParameters;
	const auction = await getAuctionById(auctionId);

	return {
		statusCode: 200,
		body: JSON.stringify(auction),
	};
}

export const handler = commonMiddleware(getAuction);
