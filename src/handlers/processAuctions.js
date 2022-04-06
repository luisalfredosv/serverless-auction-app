import createError from "http-errors";
import { getEndedAuctions } from "../lib/getEndedAuctions";
import { closeAuction } from "./closeAuction";

async function processAuctions(event, context) {
	try {
		const auctionsToClose = await getEndedAuctions();
		const closePromises = auctionsToClose.map((auction) =>
			closeAuction(auction)
		);
		await Promise.all(closePromises);
	} catch (error) {
		console.error(error);
		throw new createError.InternalServerError();
	}
}

export const handler = processAuctions;
