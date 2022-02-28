<template>
	<div class = 'navigation-bar'>
		<nav>
			<router-link :to = "{ name : 'Minesweeper' }" class-active = "active" exact>Minesweeper</router-link>
			<router-link :to = "{ name : 'Snake' }">Snake</router-link>
			<router-link :to = "{ name : 'Home' }">Home</router-link>
		</nav>
	</div>
	<router-view/>
</template>

<script>

export default {
  name: 'App',
  components: {
	
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
nav a {
	margin : 10px;
	padding : 10px;
	text-decoration : none;
	color : green;
}
.router-link-active
{
	background-color : crimson;
	border-radius : 5px;
	color : white;
}
.navigation-bar {
	margin : 10px;
	padding : 20px;
}
</style>
