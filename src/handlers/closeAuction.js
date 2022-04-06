import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const AUCTIONS_TABLE = process.env.AUCTIONS_TABLE;

export async function closeAuction(auction) {
	const params = {
		TableName: AUCTIONS_TABLE,
		Key: {
			id: auction.id,
		},
		UpdateExpression: "SET #status = :status",
		ExpressionAttributeValues: {
			":status": "CLOSED",
		},
		ExpressionAttributeNames: {
			"#status": "status",
		},
	};

	const result = await dynamoDb.update(params).promise();
	return result;
}
