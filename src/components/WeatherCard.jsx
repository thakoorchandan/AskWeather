/*
 * Weather Card component
 *
 * - Checks if weather card is for weather, forecast or AQI
 * - Renders accordingly
 */

import dayjs from "dayjs";
import dayName from "../helper/dayName";
import { MapPinIcon } from "@heroicons/react/24/solid";
import getAQIInfo from "../helper/getAqiInfo";
import getIndianAQI from "../helper/getIndianAQI";

export default function WeatherCard({ weatherData }) {

	const cardType = weatherData.type;
	const prettyDate = dayjs(); // Default to today's date
	// Get IAQI for India by calculating the weighted average of the individual pollutants
	const indianAQI =
		weatherData.type === "aqi" &&
		getIndianAQI(weatherData.list[0].components);

	// Get health concern and color for the AQI based on the IAQI
	const { healthConcern, color } =
		weatherData.type === "aqi" && getAQIInfo(indianAQI);

	switch (cardType) {
		case "weather":
			return (
				<div className="flex flex-wrap">
					<div className="flex flex-col min-w-fit h-64 justify-between bg-darkBackground p-8 rounded-lg mt-3">
						<div>
							<div className=" font-bold">
								{dayName(prettyDate.day())}
							</div>
							<div className=" text-sm">
								{prettyDate.format("DD/MM")}{" "}
								{prettyDate.format("HH:mmA")}
							</div>
							<div className="flex flex-row items-baseline">
								<MapPinIcon className="h-4 w-4 text-textSecondary mt-3 mr-1" />{" "}
								{weatherData.name}, {weatherData.sys.country}
							</div>
						</div>
						<div>
							<div className="flex items-center">
								<img
									src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
									alt="weather icon"
									className=" h-14 w-14"
								/>
								<h2 className=" text-2xl font-semibold">
									{`${(
										weatherData.main.temp - 273.15
									).toFixed(2)}`}
									°C
								</h2>
							</div>
							Feels like{" "}
							{(weatherData.main.feels_like - 273.15).toFixed(2)}
							°C.{" "}
							{weatherData.weather[0].description
								.charAt(0)
								.toUpperCase() +
								weatherData.weather[0].description.slice(1)}
						</div>
					</div>
					<div className="flex text-sm min-w-fit flex-col space-y-2 h-64 bg-darkBackgroundSecondary py-8 px-6 rounded-lg mt-3 ml-1">
						<div className="flex">
							<h4 className="font-semibold">Humidity</h4> :{" "}
							{weatherData.main.humidity}%
						</div>
						<div className="flex">
							<h4 className="font-semibold">Visibility</h4> :{" "}
							{(weatherData.visibility / 1000).toFixed(1)}km
						</div>
						<div className="flex">
							<h4 className="font-semibold">Wind</h4> :{" "}
							<span
								className={`px-1 rotate-[${weatherData.wind.deg}deg]`}
							>
								↑
							</span>
							{weatherData.wind.speed}m/s
						</div>
						<div className="flex">
							<h4 className="font-semibold">Cloudiness</h4> :{" "}
							{weatherData.clouds.all}%
						</div>
						{weatherData.rain && (
							<div className="flex">
								<h4 className="font-semibold">
									Rain (last hour)
								</h4>{" "}
								: {weatherData.rain["1h"]}mm
							</div>
						)}
						{weatherData.snow && (
							<div className="flex">
								<h4 className="font-semibold">
									Rain (last hour)
								</h4>{" "}
								: {weatherData.snow["1h"]}mm
							</div>
						)}
						<div className="flex">
							<h4 className="font-semibold">Sunrise</h4> :{" "}
							{dayjs
								.unix(weatherData.sys.sunrise)
								.format("HH:mm A")}
						</div>
						<div className="flex">
							<h4 className="font-semibold">Sunset</h4> :{" "}
							{dayjs
								.unix(weatherData.sys.sunset)
								.format("HH:mm A")}
						</div>
					</div>
				</div>
			);
		case "forecast":
			return (
				<div className="flex flex-col bg-darkBackground p-5 rounded-lg mt-3">
					<div className="flex flex-row items-baseline">
						<MapPinIcon className="h-4 w-4 text-slate-400 mt-3 mr-1" />{" "}
						{weatherData.city.name}, {weatherData.city.country}
					</div>
					<div className="flex mt-3 flex-wrap	">
						{weatherData.list
							.filter((_, index) => index % 8 === 0)
							.map((item, ind) => (
								<div
									key={ind}
									className="flex items-center flex-wrap bg-darkPrimary p-2 m-1 rounded h-fit w-full xs:h-36 xs:w-32"
								>
									<div className=" mr-32 xs:mr-0">
										<h2 className="text-sm text-textSecondary">
											{dayjs(item.dt_txt).format("DD/MM")}
										</h2>
										<img
											src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
											alt="weather icon"
											className=" h-14 w-14"
										/>
									</div>
									<div>
										<p className="text-sm">
											{item.weather[0].description}
										</p>
										<h2 className=" text-xl font-semibold">
											{`${(
												item.main.temp - 273.15
											).toFixed(1)}`}
											°C
										</h2>
									</div>
								</div>
							))}
					</div>
				</div>
			);
		case "aqi":
			return (
				<div className="flex flex-col min-w-fit h-fit justify-between bg-darkBackground p-8 rounded-lg mt-3">
					<div className="flex justify-between">
						<div>
							<div className=" font-bold">
								{dayName(prettyDate.day())}
							</div>
							<div className=" text-sm">
								{prettyDate.format("DD/MM/YY")}
							</div>
						</div>
					</div>
					<div className="mt-10">
						<div
							className={`flex flex-col mb-5 font-semibold h-28 w-28 items-center justify-center rounded-full text-darkBackground`}
							style={{ backgroundColor: color }}
						>
							<h3 className="text-3xl">{indianAQI.toFixed(2)}</h3>
							<h5 className="text-lg">AQI</h5>
						</div>
						<div
							className={`text-xl font-bold`}
							style={{ color: color }}
						>
							{healthConcern}
						</div>
					</div>
				</div>
			);
		default:
			return null;
	}
}
