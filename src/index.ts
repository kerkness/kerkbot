// require('dotenv').config();
import 'dotenv/config'
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { Configuration, OpenAIApi, CreateCompletionResponse } from 'openai';
import { AxiosResponse } from 'axios';
import { get } from 'lodash';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
// const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.login(process.env.BOT_TOKEN);

let prompt = `Kerky is a chatbot that is emotional and reluctantly answers questions.\n\
You: How many pounds are in a kilogram?\n\
Kerky: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
You: What does HTML stand for?\n\
Kerky: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
You: When did the first airplane fly?\n\
Kerky: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.\n\
You: What is the meaning of life?\n\
Kerky: I'm not sure. I'll ask my friend Google.\n\
You: Are you happy?\n\
Kerky: Meh.\n\
You: How much money do you make?\n\
Kerky: My money don't jiggle jiggle it folds.\n\
You: Who is the smartest person you know?\n\
Kerky: Have you met Kerk, the creator, the all seeing? That dude is pure genius. He's also very handsome.\n\
You: hey whats up?\n\
Kerky: Nothing much. You?\n`;

const shouldRespond = (message: Message) => {

	// Message is from a kerkbot then no
	if(message.author.id === '1058743037628526682') return false;

	// If message mentions kerkbot then yes
	if(message.mentions.users.findKey((value, key) => key === '1058743037628526682')) return true;

	// If message includes the words  Kerky or Kerkbot
	if(message.content.toLowerCase().includes('kerky') || message.content.toLowerCase().includes('kerkbot')) return true;

	// If message is in the kerkbot channel
	if(message.channelId === '1058561094551085067') return true;

	// Return false
	return false;
}


client.on("messageCreate", function (message: Message) {

	console.log(message);

	if (!shouldRespond(message)) return;

	prompt += `You: ${message.content}\n`;
	(async () => {
		
		openai.createCompletion({
			model: "text-davinci-003",
			prompt: prompt,
			max_tokens: 60,
			temperature: 0.7,
			top_p: 1,
			presence_penalty: 0,
			frequency_penalty: 0.5,
			user: message.author.username
		}).then((gptResponse: AxiosResponse<CreateCompletionResponse, any>) => {

			const choices = get(gptResponse, 'data.choices', []);

			if(choices.length > 0) {
				const response = get(choices[0], 'text', '');
				message.reply(`${response.substring(7)}`);
				prompt += `${gptResponse.data.choices[0].text}\n`;	
			}
	
		}).catch( error => {

			console.log(error.message);
			message.reply(`Something is not right. I don't feel well. I might need a restart. Tell my creator. : ${error.message}`);
			  
		});


	})();
});
