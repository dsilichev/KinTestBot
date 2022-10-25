const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const TOKEN = require('./token').TOKEN;
console.log(TOKEN);

const bot = new TelegramApi(TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать!');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

bot.setMyCommands([
  { command: '/start', description: 'Начальное приветствие' },
  { command: '/info', description: 'Получить информацию о пользователе' },
  { command: '/game', description: 'Игра угадай цифру' }
]);

function start() {
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      return bot.sendMessage(chatId, 'Добро пожаловать в тестовый бот к курсу "Сплю сам!"');
    } else if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    } else if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')

  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    else if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
    }
  })

}

start();