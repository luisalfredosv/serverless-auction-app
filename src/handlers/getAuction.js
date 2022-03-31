import AWS from "aws-sdk";

import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const AUCTIONS_TABLE = process.env.AUCTIONS_TABLE;

async function getAuction(event, context) {
	let auction = {};
	const { auctionId } = event.pathParameters;
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

	return {
		statusCode: 200,
		body: JSON.stringify(auction),
	};
}

export const handler = middy(getAuction)
	.use(httpJsonBodyParser())
	.use(httpEventNormalizer())
	.use(httpErrorHandler());
