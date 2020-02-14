var Twit = require('twit');

require('dotenv').config();

/* Instancie o bot com as chaves no arquivo .env */
const Bot = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
  timeout_ms:           60 * 1000,
});

console.log('Este bot está rodando...');

/* BotInit() : Para iniciar o bot */
function BotInit() {
	var query = {
		q: "Corumbá",
		result_type: "recent"
	}

	Bot.get('search/tweets', query, BotGotLatestTweet);

	function BotGotLatestTweet (error, data, response) {
		if (error) {
			console.log('Bot não pôde achar o último tweet, : ' + error);
		}
		else {
			var id = {
				id : data.statuses[0].id_str
			}

			Bot.post('statuses/retweet/:id', id, BotRetweeted);
			Bot.post('favorites/create', id, BotFavorited);
			Bot.post('friendships/create', data.statuses[0].user, BotFollowed);
			
			function BotRetweeted(error, response) {
				if (error) {
					console.log('Bot não pode retweetar, : ' + error);
				}
				else {
					console.log('Bot retweetou : ' + id.id);
				}
			}
			function BotFavorited(error, response) {
				if (error) {
					console.log('Bot não pode favoritar, : ' + error);
				}
				else {
					console.log('Bot favoritou : ' + id.id);
				}
			}
			function BotFollowed(error, response) {
				if (error) {
					console.log('Bot não pode seguir, : ' + error);
				}
				else {
					console.log('Bot seguiu : ' + id.id);
				}
			}
		}
	}
}

/* Configure um intervalo de  30 minutos (em microsegundos) */
setInterval(BotInit, 1*60*1000);

/* Inicialize o bot Bot */
BotInit();