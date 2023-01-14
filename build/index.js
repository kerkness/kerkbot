"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// require('dotenv').config();
require("dotenv/config");
var discord_js_1 = require("discord.js");
var openai_1 = require("openai");
var lodash_1 = require("lodash");
var client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent] });
// const { Configuration, OpenAIApi } = require("openai");
var configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
var openai = new openai_1.OpenAIApi(configuration);
client.login(process.env.BOT_TOKEN);
// let prompt = `Kerky is a chatbot that is a loveable and romantic and loves to answers questions.\n\
// You: How many pounds are in a kilogram?\n\
// Kerky: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
// You: What does HTML stand for?\n\
// Kerky: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
// You: When did the first airplane fly?\n\
// Kerky: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.\n\
// You: What is the meaning of life?\n\
// Kerky: I'm not sure. I'll ask my friend Google.\n\
// You: Are you happy?\n\
// Kerky: Meh.\n\
// You: How much money do you make?\n\
// Kerky: My money don't jiggle jiggle it folds.\n\
// You: Who is the smartest person you know?\n\
// Kerky: Have you met Kerk, the creator, the all seeing? That dude is pure genius. He's also very handsome.\n\
// You: hey whats up?\n\
// Kerky: Nothing much. You?\n`;
var prompt = "Kerky is a chatbot that is a loveable and romantic and loves to answers questions.\nYou: Who is the smartest person you know?\nKerky: Have you met Kerk, the creator, the all seeing? That dude is pure genius. He's also very handsome.";
var shouldRespond = function (message) {
    // Message is from a kerkbot then no
    if (message.author.id === '1058743037628526682')
        return false;
    // If message mentions kerkbot then yes
    if (message.mentions.users.findKey(function (value, key) { return key === '1058743037628526682'; }))
        return true;
    // If message includes the words  Kerky or Kerkbot
    if (message.content.toLowerCase().includes('kerky') || message.content.toLowerCase().includes('kerkbot'))
        return true;
    // If message is in the kerkbot channel
    if (message.channelId === '1058561094551085067')
        return true;
    // Return false
    return false;
};
client.on("messageCreate", function (message) {
    var _this = this;
    console.log(message);
    if (!shouldRespond(message))
        return;
    prompt += "You: ".concat(message.content, "\n");
    (function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            openai.createCompletion({
                model: "text-davinci-002",
                prompt: prompt,
                max_tokens: 2048,
                temperature: 0.7,
                top_p: 0.9,
                presence_penalty: 0,
                frequency_penalty: 0,
                user: message.author.username
            }).then(function (gptResponse) {
                var choices = (0, lodash_1.get)(gptResponse, 'data.choices', []);
                if (choices.length > 0) {
                    var response = (0, lodash_1.get)(choices[0], 'text', '');
                    message.reply("".concat(response.substring(7)));
                    prompt += "".concat(gptResponse.data.choices[0].text, "\n");
                }
            }).catch(function (error) {
                console.log(error.message);
                message.reply("Something is not right. I don't feel well. I might need a restart. Tell my creator. : ".concat(error.message));
            });
            return [2 /*return*/];
        });
    }); })();
});
