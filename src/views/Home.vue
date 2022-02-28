<template>
	<h1>Hello all</h1>
	<div>
		<p>Sort properties</p>
		<button class = 'sort-option'
		v-for = '(name, idx) in [ "Score increasing", "Score decreasing", "Date increasing", "Date decreasing" ]' :key = 'idx' @click = 'change_sort(idx + 1)'>
			{{ name }}
		</button>
	</div>
	<div class = 'main-container'>
		<div>
			<h2>Snake highscores</h2>
			<div class = 'snake-highscores'>
				<div v-for = '(difficulty, idx) in [ "Easy", "Medium", "Hard" ]' :key = 'idx'
					:class = '{ "snake-highscores-easy" : difficulty == "Easy", "snake-highscores-medium" : difficulty == "Medium", "snake-highscores-hard" : difficulty == "Hard" }'>
					<div v-if = 'snake_highscores(difficulty).length != 0'>
						<h2 class = 'score-header'>{{ difficulty }}</h2>
						<div v-for = 'highscore in snake_highscores(difficulty)' :key = 'highscore.date' class = 'score-item'>
							<p>Score - {{ highscore.score }}</p>
							<p>Date - {{ dateformat(new Date(highscore.date), 'dd/mm/yy hh:MM:ss') }}</p>
						</div>
					</div>
					<div v-else>
						No highscores in {{ difficulty }} difficulty yet
					</div>
				</div>
			</div>
		</div>
		
		<div>
			<h2>Minesweeper highscores</h2>
			<div class = 'minesweeper-highscores'>
				<div v-for = '(difficulty, idx) in [ "Easy", "Medium", "Hard" ]' :key = 'idx'
					:class = '{ "minesweeper-highscores-easy" : difficulty == "Easy", "minesweeper-highscores-medium" : difficulty == "Medium", "minesweeper-highscores-hard" : difficulty == "Hard" }'>
					<div v-if = 'minesweeper_highscores(difficulty).length != 0'>
						<h2 class = 'score-header'>{{ difficulty }}</h2>
						<div v-for = 'highscore in minesweeper_highscores(difficulty)' :key = 'highscore.date' class = 'score-item'>
							<p>Time - {{ highscore.time }}</p>
							<p>Date - {{ dateformat(new Date(highscore.date), 'dd/mm/yy hh:MM:ss') }}</p>
						</div>
					</div>
					<div v-else>
						No highscores in {{ difficulty }} difficulty yet
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import dateformat from 'dateformat'

export default {
	name : 'Home',
	data : function() {
		return {
			dateformat : dateformat,
			sort : 1 // 1 - score decreasing / time increasing, 2 - score increasing / time decreasing, 3 - date increasing, 4 - date decreasing
		}
	},
	methods : {
		change_sort : function(sort) {
			if(sort >= 1 && sort <= 4)
				this.sort = sort
		},
		snake_highscores : function(difficulty) {
			let scores = this.$store.state.snakeHighscores[difficulty]
			let func;
			
			switch(this.sort)
			{
			case 1:
				func = function(a, b) {
					return b.score - a.score
				}
				break;
			case 2:
				func = function(a, b) {
					return a.score - b.score
				}
				break;
			case 3:
				func = function(a, b) {
					return a.date - b.date
				}
				break;
			case 4:
				func = function(a, b) {
					return b.date - a.date
				}
				break;
			default:
				return
			}
			
			return scores.sort(func)
		},
		minesweeper_highscores : function(difficulty) {
			let scores = this.$store.state.minesweeperHighscores[difficulty]
			let func;
			
			switch(this.sort)
			{
			case 1:
				func = function(a, b) {
					return a.time - b.time
				}
				break;
			case 2:
				func = function(a, b) {
					return b.time - a.time
				}
				break;
			case 3:
				func = function(a, b) {
					return a.date - b.date
				}
				break;
			case 4:
				func = function(a, b) {
					return b.date - a.date
				}
				break;
			default:
				return
			}
			
			return scores.sort(func)
		}
	},
	computed : {
		snake_easy : function() {
			return this.snake_highscores('Easy')
		},
		snake_medium : function() {
			return this.snake_highscores('Medium')
		},
		snake_hard : function() {
			return this.snake_highscores('Hard')
		},
		
		minesweeper_easy : function() {
			return this.minesweeper_highscores('Easy')
		},
		minesweeper_medium : function() {
			return this.minesweeper_highscores('Medium')
		},
		minesweeper_hard : function() {
			return this.minesweeper_highscores('Hard')
		}
	}
}

</script>

<style scoped>
.sort-option {
	margin : 10px;
	padding : 10px;
	background-color : #222222;
	color : #77ff77;
	border-color : #444444 #111111 #111111 #444444;
	border-style : solid;
	border-width : 5px;
	
	transition : 0.25s background-color linear, 0.25s border-color linear;
}

.sort-option:hover {
	background-color : #444444;
	border-color : #666666 #222222 #222222 #666666;
}

.sort-option:active {
	background-color : #555555;
	border-color : #777777 #444400 #444400 #777777;
}

.main-container {
	display : flex;
	margin : auto;
	width : 60%;
	justify-content : space-around;
}

.score-header {
	margin : 10px;
	padding : 10px;
	background-color : #444444;
	border-color : #777777 #333333 #333333 #777777;
	border-style : solid;
	border-width : 10px;
	font-size : 30px;
}

.score-item {
	margin : 10px;
	padding : 10px;
	background-color : #444444;
	border-color : #777777 #333333 #333333 #777777;
	border-style : solid;
	border-width : 10px;
}

.snake-highscores {
	display : flex;
	justify-content : space-between;
	
	margin : 15px;
}

.snake-highscores-easy {
	color : green;
}

.snake-highscores-medium {
	color : #CCCC00;
}

.snake-highscores-hard {
	color : red;
}


.minesweeper-highscores {
	display : flex;
	justify-content : space-between;
	
	margin : 15px;
}

.minesweeper-highscores-easy {
	color : green;
}

.minesweeper-highscores-medium {
	color : #CCCC00;
}

.minesweeper-highscores-hard {
	color : red;
}
</style>