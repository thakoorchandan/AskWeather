/*
 * Message component
 *
 * - Renders a message
 * - Checks if message is from bot and renders accordingly
 */

import dayjs from "dayjs";
import WeatherCard from "./WeatherCard";

export default function Message({ message }) {
	// Check if message is from bot
	const isBot = message.user.fName === "Nimble.AI Weather";

	return (
		<div className={`py-5 text-white ${isBot && "bg-botBackground"}`}>
			<div className="flex space-x-5 px-10 max-w-4xl mx-auto ">
				<img
					src={message.user.avatar}
					alt="avatar"
					className="h-8 w-8"
				/>
				<div>
					<div className="flex text-xs text-textSecondary space-x-2">
						<h3>{message.user.fName}</h3>
						<h4>
							({dayjs(message.created_at).format("DD/MM HH:mm")})
						</h4>
					</div>
					{message.text.startsWith(`{"weatherData":{`) ? (
						<WeatherCard
							weatherData={JSON.parse(message.text).weatherData}
						/>
					) : (
						<p className="pt-1 whitespace-pre-wrap">
							{message.text}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
