<template>
	<div class = 'main-container'>
		<div class = 'speed-choser'>
			<button @click = 'changeSpeed(1000)'>Slow</button>
			<button @click = 'changeSpeed(500)'>Medium</button>
			<button @click = 'changeSpeed(250)'>Fast</button>
		</div>
		<canvas class = 'snake-game'
		:width = 'width * tileSize' :height = 'height * tileSize'
		ref = 'snakeField'
		>
		</canvas>
		<div class = 'data-container'>
			<div class = 'score-display'>
				<strong>Current score: </strong><p>{{ score }}</p>
			</div>
			<div class = 'lose-alert' v-if = 'lost'>
				<p>You lose!</p>
			</div>
			<button class = 'restart-btn' v-if = 'lost' @click = 'restart'>
				Restart?
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name : 'Snake',
		data : function() {
			return {
				width : 10,
				height : 10,
				tickInterval : 500,
				tileSize : 25,
				snakeStartLength : 5,
				direction : 0, // 0 - None, 1-4 - UP, RIGHT, DOWN, LEFT
				body : [],
						
				field : [], // 0 - Empty, 1 - Block, 2 - Food
				lost : false,
				
				timer : null,
				canvas : null,
				context : null,
				
				score : 0
			}
		},
		methods : {	
			tick : function(){
				let motion = this.calcMotion(this.direction)
				
				if(motion.x == 0 && motion.y == 0)
					return
					
				let head = this.body[this.body.length - 1]
				let tail = { x : this.body[0].x, y : this.body[0].y }
					
				let newPos = { x : head.x + motion.x, y : head.y + motion.y }
				
				if (newPos.x >= this.width || newPos.x < 0 || newPos.y >= this.height || newPos.y < 0)
				{
					this.lose()
					return
				}
				
				let ate = false
				
				let newPosTile = this.field[newPos.x][newPos.y]
				
				if (newPosTile == 1)
				{
					this.lose()
					return
				}
				
				if (newPosTile == 2)
				{
					ate = true
					this.onEat()
				}
				
				this.field[tail.x][tail.y] = 0
				
				for(let i = 0; i < this.body.length - 1; i++)
				{
					this.body[i].x = this.body[i + 1].x
					this.body[i].y = this.body[i + 1].y
				}
				
				this.body[this.body.length - 1].x += motion.x
				this.body[this.body.length - 1].y += motion.y
				
				head = this.body[this.body.length - 1]
				
				this.field[head.x][head.y] = 1
				
				if (ate)
				{
					this.body.unshift(tail)
					
					this.field[tail.x][tail.y] = 1
				}
			},
			display : function(){
				for(let x = 0; x < this.width; x++)
				{
					for(let y = 0; y < this.height; y++)
					{
						switch(this.field[x][y])
						{
						case 0:
							this.context.fillStyle = 'rgb(255, 255, 255)'
							break
						case 1:
							this.context.fillStyle = 'rgb(0, 0, 0)'
							break
						case 2:
							this.context.fillStyle = 'rgb(0, 255, 0)'
							break
						}
						
						this.context.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)
					}
				}
			},
			changeDirection : function(dir){
				if (this.direction == 0)
				{
					this.direction = dir
					return
				}
			
				let head = this.body[this.body.length - 1]
				let prehead = this.body[this.body.length - 2]
				
				let motion = this.calcMotion(dir)
			
				let newPos = { x : head.x + motion.x, y : head.y + motion.y }
			
				if (!(prehead.x == newPos.x && prehead.y == newPos.y))
				{
					this.direction = dir
				}
			},
			onEat : function() {
				let x, y;
				do
				{
					x = Math.floor(Math.random() * this.width)
					y = Math.floor(Math.random() * this.height)
				} while (this.field[x][y] != 0)
				
				this.field[x][y] = 2
				this.score++
			},
			lose : function() {
				this.direction = 0
				this.lost = true
				
				clearTimeout(this.timer)
				
				let difficulty;
				
				switch (this.tickInterval) {
				case 250:
					difficulty = 'Hard'
					break
				case 500:
					difficulty = 'Medium'
					break
				case 1000:
					difficulty = 'Easy'
					break
				default:
					return
				}
				
				let score = {
					difficulty : difficulty,
					score : this.score,
					date : new Date().getTime()
				}
				
				this.$store.dispatch('addSnakeScore', score)
			},
			restart : function() {
				this.score = 0
				this.direction = 0
				this.lost = false
			
				this.field = []
				for(let x = 0; x < this.width; x++)
				{
					this.field.push([])
					for(let y = 0; y < this.height; y++)
					{
						this.field[x].push(0)
					}
				}
				
				this.body = []
				for(let _x = this.width / 2 - this.snakeStartLength; _x < this.width / 2; _x++)
				{
					this.field[_x][Math.floor(this.height / 2)] = 1
					
					this.body.push({ x : _x, y : this.height / 2 })
				}
				
				this.onEat()
				this.score--
				
				this.timer = setInterval(() => {
					this.tick()
					this.display()
				}, this.tickInterval)
			},
			calcMotion : function(dir) {
				let motion = {x : 0, y : 0}
			
				switch(dir)
				{
				case 0: // NONE
					motion.x = 0
					motion.y = 0
					break
				case 1: // UP
					motion.x = 0
					motion.y = -1
					break
				case 2: // RIGHT
					motion.x = 1
					motion.y = 0
					break
				case 3: // DOWN
					motion.x = 0
					motion.y = 1
					break
				case 4: // LEFT
					motion.x = -1
					motion.y = 0
					break
				}
				
				return motion
			},
			
			keypressListener : function (event) {
				let code = event.code
				let dir;
				
				switch(code)
				{
				case 'ArrowLeft':
					dir = 4
					break
				case 'ArrowUp':
					dir = 1
					break
				case 'ArrowRight':
					dir = 2
					break
				case 'ArrowDown':
					dir = 3
					break
				default:
					dir = this.direction
					break
				}
				
				this.changeDirection(dir)
			},
			changeSpeed : function(time) {
				this.tickInterval = time
				
				clearTimeout(this.timer)
				this.restart()
			}
		},
		mounted : function() {
			this.restart()
			
			document.addEventListener('keydown', this.keypressListener, false)
			
			this.canvas = this.$refs.snakeField
			this.context = this.canvas.getContext("2d")
		},
		unmounted : function() {
			clearTimeout(this.timer)
			document.removeEventListener('keydown', this.keypressListener, false)
		}
	}
</script>

<style scoped>
.main-container {
	width : 80%;
	margin : auto;
	
	display : flex;
}

.snake-game {
	width : 50%;
	margin : auto;

	border-width : 5px;
	border-color : #333333;
	border-radius : 5px;
	border-style : solid;
	
	display : inline-block;
}

.data-container {
	width : 30%;
	height : 100px;
	
	display : flex;
}

.score-display {
	padding : 10px;
	margin : 10px;
	background-color : gray;
	border-radius : 5px;
	color : blue;
}

.lose-alert {
	padding : 10px;
	margin : 10px;
	background-color : gray;
	border-radius : 5px;
	color : crimson;
}

.restart-btn {
	padding : 10px;
	border-color : #333333 #777777;
	margin : 10px;
	background-color : gray;
}
</style>