const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'weather',
    aliases: ['forecast'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        // If no location is provided
        const location = args.join(' ') || 'Unknown Location';
        
        // Random data for weather simulation
        const weatherConditions = [
            'Clear sky',
            'Partly cloudy',
            'Overcast',
            'Light rain',
            'Heavy rain',
            'Thunderstorms',
            'Snow',
            'Foggy'
        ];

        const temperatures = [
            { condition: 'Clear sky', temp: 25 },
            { condition: 'Partly cloudy', temp: 20 },
            { condition: 'Overcast', temp: 18 },
            { condition: 'Light rain', temp: 15 },
            { condition: 'Heavy rain', temp: 12 },
            { condition: 'Thunderstorms', temp: 10 },
            { condition: 'Snow', temp: -5 },
            { condition: 'Foggy', temp: 8 }
        ];

        // Select random weather condition and corresponding temperature
        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const temperatureData = temperatures.find((data) => data.condition === randomCondition);

        // Simulating other weather data
        const humidity = Math.floor(Math.random() * (100 - 30) + 30); // Random humidity between 30% and 100%
        const windSpeed = (Math.random() * 10).toFixed(1); // Random wind speed between 0 and 10 m/s
        const pressure = Math.floor(Math.random() * (1020 - 980) + 980); // Random pressure between 980 and 1020 hPa

        // Create an embed with the simulated weather data
        const weatherEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Weather in ${location}`)
            .setDescription(`Current weather in ${location} is simulated.`)
            .addFields(
                {
                    name: 'Temperature',
                    value: `${temperatureData.temp}°C`,
                    inline: true,
                },
                {
                    name: 'Weather Condition',
                    value: randomCondition,
                    inline: true,
                },
                {
                    name: 'Humidity',
                    value: `${humidity}%`,
                    inline: true,
                },
                {
                    name: 'Wind Speed',
                    value: `${windSpeed} m/s`,
                    inline: true,
                },
                {
                    name: 'Pressure',
                    value: `${pressure} hPa`,
                    inline: true,
                }
            )
            .setThumbnail('https://openweathermap.org/img/wn/01d.png') // A generic weather icon (can be changed)
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        // Send the weather embed
        await message.channel.send({ embeds: [weatherEmbed] });
    },
};
