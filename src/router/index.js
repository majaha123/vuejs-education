import { createWebHistory, createRouter } from 'vue-router'


const routes = [
	{
		path : '/',
		name : 'Home',
		component : () => import('../views/Home.vue')
	},
	{
		path : '/minesweeper/',
		name : 'Minesweeper',
		component : () => import('../views/Minesweeper.vue')
	},
	{
		path : '/snake/',
		name : 'Snake',
		component : () => import('../views/Snake.vue')
	},
	{
		path : '/:catchAll(.*)',
		name : 'NotFound',
		component : () => import('../views/NotFound.vue')
	}
]

const router = createRouter({
	history : createWebHistory(process.env.BASE_URL),
	routes
})

export default router