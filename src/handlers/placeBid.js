import AWS from "aws-sdk";

import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const AUCTIONS_TABLE = process.env.AUCTIONS_TABLE;

async function placeBid(event, context) {
	const { auctionId } = event.pathParameters;
	const { amount } = event.body;

	const params = {
		TableName: AUCTIONS_TABLE,
		Key: { id: auctionId },
		UpdateExpression: "set highestBid.amount = :amount",
		ExpressionAttributeValues: {
			":amount": amount,
		},
		ReturnValues: "ALL_NEW",
	};

	let updateAuction;

	try {
		const result = await dynamoDb.update(params).promise();
		updateAuction = result.Attributes;
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError();
	}

	return {
		statusCode: 200,
		body: JSON.stringify(updateAuction),
	};
}

export const handler = commonMiddleware(placeBid);
