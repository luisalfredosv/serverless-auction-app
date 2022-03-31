import AWS from "aws-sdk";

import { v4 as uuid } from "uuid";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const AUCTIONS_TABLE = process.env.AUCTIONS_TABLE;

async function createAuction(event, context) {
	const { title } = event.body;
	const now = new Date();

	const auction = {
		id: uuid(),
		title,
		status: "OPEN",
		createdAt: now.toISOString(),
	};

	try {
		await dynamoDb
			.put({
				TableName: AUCTIONS_TABLE,
				Item: auction,
			})
			.promise();
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError();
	}

	return {
		statusCode: 201,
		body: JSON.stringify(auction),
	};
}

export const handler = middy(createAuction)
	.use(httpJsonBodyParser())
	.use(httpEventNormalizer())
	.use(httpErrorHandler());
