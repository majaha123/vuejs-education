import { createStore } from 'vuex'

const store = createStore({
	state : {
		snakeHighscores : JSON.parse(localStorage.getItem('snakeHighscores') || '{ "Easy" : [], "Medium" : [], "Hard" : [] }'),
		minesweeperHighscores : JSON.parse(localStorage.getItem('minesweeperHighscores') || '{ "Easy" : [], "Medium" : [], "Hard" : [] }'),
	},
	mutations : {
		addSnakeScore : function(state, scoreData) {
			state.snakeHighscores[scoreData.difficulty].push({ score : scoreData.score, date : scoreData.date})
			
			localStorage.setItem('snakeHighscores', JSON.stringify(state.snakeHighscores))
		},
		addMinesweeperScore : function(state, scoreData) {
			state.minesweeperHighscores[scoreData.difficulty].push({ time : scoreData.time, date : scoreData.date})
			
			localStorage.setItem('minesweeperHighscores', JSON.stringify(state.minesweeperHighscores))
		}
	},
	actions : {
		addSnakeScore : function({ commit }, scoreData) {
			commit('addSnakeScore', scoreData)
		},
		addMinesweeperScore : function({ commit }, scoreData) {
			commit('addMinesweeperScore', scoreData)
		}
	},
	getters : {
		/*snakeHighscores : function(storage) {
			var highscores = storage.state.snakeHighscores
			
			var easy = highscores['Easy'].slice()
			var medium = highscores['Medium'].slice()
			var hard = highscores['Hard'].slice()
			
			return { 'Easy' : easy.sort(), 'Medium' : medium.sort, 'Hard' : hard.sort() }
		}*/
	},
	modules : {
		
	}
})

export default store