<template>
	<div class = 'main-container'>
		<div class = 'data-container'>
			<div class = 'remaining-bombs'>
				<strong style = 'color : white'>Remaining bombs:</strong><p>{{ bombCount - flagCount }}</p>
			</div>
			<div class = 'timer'>
				<strong style = 'color : white'>Timer: </strong><p>{{ curTime }}</p>
			</div>
			<div class = 'lose-alert' v-if = 'lose'>
				<p>You lose!</p>
			</div>
			<div class = 'win-alert' v-else-if = 'win'>
				<p>You win!</p>
			</div>
			<div v-if = 'lose || win'>
				<button @click = 'restart'>Restart?</button>
			</div>
		</div>
		<div class = 'field-container' oncontextmenu = 'return false'>
			<div v-for = '(row, index) in field' :key = 'index'>
				<template v-for = '(tile, idx) in row' :key = 'idx + 10000'>
					<img :src = 'getImage(tile)' 
					@click = 'clickTile(index, idx)'
					@click.right = 'markTile(index, idx)'
					:width = '750 / width' :height = '750 / height'
					unselectable = 'on'/>
				</template>
			</div>
		</div>
		<div class = 'difficulty-choser'>
			<button @click = 'setDifficulty("Easy")'>
				Easy
			</button>
			<button @click = 'setDifficulty("Medium")'>
				Medium
			</button>
			<button @click = 'setDifficulty("Hard")'>
				Hard
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name : 'Minesweeper',
		data : function(){
			return {
				width : 10,
				height : 10,
				bombCount : 20,
				difficulty : 'Medium',
				
				field : [],
				gameBeginning : true,
				win : false,
				lose : false,
				
				openedCount : 0,
				flagCount : 0,
				
				timer : null,
				curTime : 0
			}
		},
		methods : {
			getImage : function(tile) {
				if(this.lose && tile.bomb)
				{
					return require('../../public/bomb.png')
				}
				
				if(tile.marked)
				{
					return require('../../public/flagged.png')
				}
			
				if(tile.hidden)
				{
					return require('../../public/facingDown.png')
				}
				
				return require('../../public/' + tile.state + '.png')
			},
			clickTile : function(x, y)
			{
				if(this.field[x][y].marked || this.lose || this.win)
					return
					
				if(!this.field[x][y].bomb)
				{
					if (this.gameBeginning)
					{
						this.initField(x, y)
						this.startTimer()
						
						this.gameBeginning = false
					}
					
					if(this.field[x][y].hidden)
						this.openedCount++
					
					this.field[x][y].hidden = false;
					
					if (this.field[x][y].state == 0)
					{
						for(let _x = x - 1; _x <= x + 1; _x++)
						{
							for(let _y = y - 1; _y <= y + 1; _y++)
							{
								if((_x == x && _y == y) || _x >= this.width || _x < 0 || _y >= this.height || _y < 0)
									continue
									
								if (this.field[_x][_y].hidden)
									this.clickTile(_x, _y)
							}
						}
					}
					
					if(this.openedCount == this.width * this.height - this.bombCount && !this.win)
					{
						this.winGame()
					}
				}
				else
				{
					this.loseGame()
					return
				}
			},
			initField : function(startX, startY)
			{
				var curBomb = 0
				
				while(curBomb < this.bombCount)
				{
					let x = Math.floor(Math.random() * this.width)
					let y = Math.floor(Math.random() * this.height)
					
					if(!this.field[x][y].bomb && x != startX && y != startY)
					{
						this.field[x][y].bomb = true
						curBomb++
						
						this.plusTileStates(x, y)
					}
				}
			},
			plusTileStates : function(tileX, tileY)
			{
				for(let x = tileX - 1; x <= tileX + 1; x++)
				{
					for(let y = tileY - 1; y <= tileY + 1; y++)
					{
						if((x == tileX && y == tileY) || x >= this.width || x < 0 || y >= this.height || y < 0)
							continue
							
						this.field[x][y].state++
					}
				}
			},
			loseGame : function() {
				this.lose = true
				
				this.stopTimer()
			},
			winGame : function() {
				this.win = true
				
				this.stopTimer()
				
				let score = {
					difficulty : this.difficulty,
					time : this.curTime,
					date : new Date().getTime()
				}
				
				console.log('!!!')
				
				this.$store.dispatch('addMinesweeperScore', score)
			},
			markTile : function(x, y) {
				if(this.field[x][y].hidden)
				{
					this.field[x][y].marked = !this.field[x][y].marked
					
					this.flagCount += this.field[x][y].marked ? 1 : -1
				}
			},
			restart : function() {
				this.field = []
			
				for(var i = 0; i < this.width; i++)
				{
					this.field.push([])
					for(var j = 0; j < this.height; j++)
					{
						this.field[i].push({ hidden : true, 
						marked : false, 
						state : 0, 
						bomb : false })
					}
				}
				
				this.win = this.lose = false
				this.gameBeginning = true
				
				this.openedCount = 0
				this.flagCount = 0
				
				this.restartTimer()
			},
			startTimer : function() {
			this.timer = setInterval(() => {
				this.curTime++
			}, 1000)
			},
			stopTimer : function() {
				clearTimeout(this.timer)
			},
			restartTimer : function() {
				this.curTime = 0
				
				this.stopTimer()
			},
			
			setDifficulty : function(difficulty) {
				switch(difficulty) {
				case 'Easy':
					this.width = 7
					this.height = 7
					this.bombCount = 10
					break
				case 'Medium':
					this.width = 10
					this.height = 10
					this.bombCount = 25
					break
				case 'Hard':
					this.width = 14
					this.height = 14
					this.bombCount = 45
					break
				default:
					return
				}
				
				this.difficulty = difficulty
				
				this.restart()
			}
		},
		mounted : function() {
			
		
			this.restart()
		},
		unmounted : function() {
			this.stopTimer()
		}
	}
</script>

<style scoped>
.main-container {
	width : 80%;
	margin : auto;
	display : flex;
	justify-content : space-between;
}

.data-container {
	margin : 10px;
	display : inline-block;
	float : left;
}

.field-container{
	margin : 10px;
	display : inline-block;
}

.remaining-bombs {
	display : inline-block;
	font-size : 30px;
	margin : 10px;
	padding-left : 50px;
	padding-right : 50px;
	padding-top : 10px;
	padding-bottom : 10px;
	color : #005500;
	background-color : #888888;
	border-radius : 5px;
}

.lose-alert {
	color : crimson;
	font-size : 30px;
	margin : 10px;
	padding-left : 50px;
	padding-right : 50px;
	padding-top : 10px;
	padding-bottom : 10px;
	background-color : #888888;
	border-radius : 5px;
}

.timer {
	color : green;
	font-size : 30px;
	margin : 10px;
	padding-left : 50px;
	padding-right : 50px;
	padding-top : 10px;
	padding-bottom : 10px;
	background-color : #888888;
	border-radius : 5px;
}

.win-alert {
	color : green;
	font-size : 30px;
	margin : 10px;
	padding-left : 50px;
	padding-right : 50px;
	padding-top : 10px;
	padding-bottom : 10px;
	background-color : #888888;
	border-radius : 5px;
}

.difficulty-choser {
	background-color : #777777;
	border-color : #333333 #999999 #999999 #333333;
	border-style : solid;
	
	height : 100%;
}

.difficulty-choser > * {
	margin : 10px;
	padding : 10px;
}

img {
	user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.router-link-active {
	color : gray;
}
</style>