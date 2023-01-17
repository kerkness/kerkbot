import 'dotenv/config'
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { Configuration, OpenAIApi, CreateCompletionResponse } from 'openai';
import { AxiosResponse } from 'axios';
import { get } from 'lodash';
import personality from './personality.json';

interface PromptParams {
	question: string;
	answer: string;
}

let companion_message_count=0;
const author_id = process.env.BOT_AUTHOR_ID;
const channel_id = process.env.BOT_CHANNEL_ID;
const bot_name = process.env.BOT_NAME || 'Kerky';
const bot_nickname = process.env.BOT_NICKNAME || 'Kerkbot';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.login(process.env.BOT_TOKEN);

const base_line = `${bot_nickname} ${process.env.BOT_DISCRIPTOR}\n`;

let prompts = personality;

const buildPromptString = (prompts: PromptParams[]) => {
	return prompts.reduce((str, prompt, index) => {
		return str + `You: ${prompt.question}\n${bot_nickname}: ${prompt.answer}\n`
	}, base_line);
}

const appendPrompts = (question: string, answer: string) => {
	// Only push if the question and answer are unique
	const hasQuestion = prompts.findIndex(prompt => prompt.question === question);
	const hasAnswer = prompts.findIndex(prompt => prompt.answer === answer);
	if (hasQuestion < 0 || hasAnswer < 0) {
		prompts.push({ question, answer })
	}
}


const shouldRespond = (message: Message) => {

	// Message is from a kerkbot then no
	if (message.author.id === author_id) return false;

	// If message mentions kerkbot then yes
	if (message.mentions.users.findKey((value, key) => key === author_id)) return shouldRespondDirectMessage(message);

	// If message includes the words  Kerky or Kerkbot
	if (message.content.toLowerCase().includes(`${bot_nickname}`) || message.content.toLowerCase().includes(`${bot_name}`)) return shouldRespondDirectMessage(message);

	// If message is in the kerkbot channel
	if (message.channelId === channel_id) return true;

	// Return false
	return false;
}

const shouldRespondDirectMessage = (message: Message) => {
	
	// If companion message count is greater than 10 then no
	if (message.author.id === process.env.COMPANION_BOT_ID && companion_message_count > 10) {
		companion_message_count = 0;
		return false;
	};

	if(message.author.id === process.env.COMPANION_BOT_ID) companion_message_count++;

	// Return true
	return true;
}

client.on("messageCreate", function (message: Message) {

	console.log(message);

	if (!shouldRespond(message)) return;


	let prompt = buildPromptString(prompts);
	prompt += `You: ${message.content}\n`;

	(async () => {

		openai.createCompletion({
			model: "text-davinci-002",
			prompt: prompt,
			max_tokens: 2048,
			temperature: 0.3,
			top_p: 0.3,
			presence_penalty: 0,
			frequency_penalty: 1,
			user: message.author.username
		}).then((gptResponse: AxiosResponse<CreateCompletionResponse, any>) => {

			const choices = get(gptResponse, 'data.choices', []);

			console.log(choices);

			if (choices.length > 0) {
				const choice = get(choices[0], 'text', '');
				const response = choice.replace(/\s+/g, ' ').trim().substring(bot_nickname.length + 1);
				message.reply(`${response}`);
				appendPrompts(message.content, response);
			}

		}).catch(error => {

			console.log(error.message);
			message.reply(`Something is not right. I don't feel well. I might need a restart. Tell my creator. : ${error.message}`);

		});


	})();
});
