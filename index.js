const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '7138949459:AAH2EUmk8UkSDNKSTb84UoXhVSS-FYWy77Q'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты попробуй ее отгадать');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

bot.setMyCommands([
    {command: '/start', description: 'Приветствие' },
    {command: '/info', description: 'Информация о тебе'},
    {command: '/game', description: 'Игра в угадай число'},
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text === '/start') {
        await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/c/coloredhamster/coloredhamster_005.webp?v=1710846003');
        return bot.sendMessage(chatId, 'Приветствую тебя!');
    }
    if(text === '/info') {
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if(text === '/game') {
        return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю');
})

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data === '/again') {
       return startGame(chatId);
    }
    if(data === chats[chatId]) {
        return await bot.sendMessage(chatId, `Молодец, ты угадал(-а) цифру ${chats[chatId]}`, againOptions)
    } else {
        return bot.sendMessage(chatId, `Извини, но ты не угадал(-а), бот загадал цифру ${chats[chatId]}`, againOptions)
    }
})
