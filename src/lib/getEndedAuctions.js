import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const AUCTIONS_TABLE = process.env.AUCTIONS_TABLE;

export async function getEndedAuctions() {
	const now = new Date();

	const params = {
		TableName: AUCTIONS_TABLE,
		IndexName: "statusAndEndDate",
		KeyConditionExpression: "#status = :status AND endingAt <= :now",
		ExpressionAttributeValues: {
			":status": "OPEN",
			":now": now.toISOString(),
		},
		ExpressionAttributeNames: {
			"#status": "status",
		},
	};

	const result = await dynamoDb.query(params).promise();
	return result.Items;
}
