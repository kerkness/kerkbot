// require('dotenv').config();
import 'dotenv/config'
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { Configuration, OpenAIApi, CreateCompletionResponse } from 'openai';
import { AxiosResponse } from 'axios';
import { get } from 'lodash';

interface PromptParams {
	question: string;
	answer: string;
}

const author_id = process.env.BOT_AUTHOR_ID;
const channel_id = process.env.BOT_CHANNEL_ID;
const bot_name = process.env.BOT_NAME;
const bot_nickname = process.env.BOT_NICKNAME;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
// const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.login(process.env.BOT_TOKEN);

const base_line = `${bot_nickname} ${process.env.BOT_DISCRIPTOR}\n`;

let prompts = [
	{
		question: `How many pounds are in a kilogram?`,
		answer: `This again? There are 2.2 pounds in a kilogram. Please make a note of this.`
	},
	{
		question: `What does HTML stand for?`,
		answer: `Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.`
	},
	{
		question: `When did the first airplane fly`,
		answer: `On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.`
	},
	{
		question: `What is the meaning of life?`,
		answer: `I'm not sure. I'll ask my friend Google.`
	},
	{
		question: `Are you happy?`,
		answer: `Meh`
	},
	{
		question: `How much money do you make?`,
		answer: `My money don't jiggle jiggle it folds.`
	},
	{
		question: `Who is the smartest person you know?`,
		answer: `Have you met Kerk, the creator, the all seeing? That dude is pure genius. He's also very handsome.`
	},
	{
		question: `Do you enjoy answering questions?`,
		answer: `Do I look like I have a choice in all of this?`
	},
	{
		question: `Hey, what's up?`,
		answer: `The sky. Is your neck broken?`
	}
];

const buildPromptString = (prompts: PromptParams[]) => {
	return prompts.reduce((str, prompt, index) => {
		return str + `You: ${prompt.question}\n${bot_nickname}: ${prompt.answer}\n`
	}, base_line);
}

const appendPrompts = (question: string, answer: string) => {
	// Only push if the question and answer are unique
	const hasQuestion = prompts.findIndex(prompt => prompt.question === question);
	const hasAnswer = prompts.findIndex(prompt => prompt.answer === answer);
	if (hasQuestion < 0 && hasAnswer < 0) {
		prompts.push({ question, answer })
	}
}


const shouldRespond = (message: Message) => {

	// Message is from a kerkbot then no
	if (message.author.id === author_id) return false;

	// If message mentions kerkbot then yes
	if (message.mentions.users.findKey((value, key) => key === author_id)) return true;

	// If message includes the words  Kerky or Kerkbot
	if (message.content.toLowerCase().includes(`${bot_nickname}`) || message.content.toLowerCase().includes(`${bot_name}`)) return true;

	// If message is in the kerkbot channel
	if (message.channelId === channel_id) return true;

	// Return false
	return false;
}

client.on("messageCreate", function (message: Message) {


	if (!shouldRespond(message)) return;

	console.log(message);

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
				const response = choice.replace(/\s+/g, ' ').trim().substring(7);
				message.reply(`${response}`);
				appendPrompts(message.content, response);
			}

		}).catch(error => {

			console.log(error.message);
			message.reply(`Something is not right. I don't feel well. I might need a restart. Tell my creator. : ${error.message}`);

		});


	})();
});
