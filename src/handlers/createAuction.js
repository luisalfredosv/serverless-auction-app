import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const AUCTIONS_TABLE = process.env.AUCTIONS_TABLE;

async function createAuction(event, context) {
	const { title } = JSON.parse(event.body);
	const now = new Date();

	const auction = {
		id: uuid(),
		title,
		status: "OPEN",
		createdAt: now.toISOString(),
	};

	await dynamoDb
		.put({
			TableName: AUCTIONS_TABLE,
			Item: auction,
		})
		.promise();

	return {
		statusCode: 201,
		body: JSON.stringify(auction),
	};
}

export const handler = createAuction;
