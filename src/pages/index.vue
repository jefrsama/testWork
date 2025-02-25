<template>
	<v-container class="h-100">
		<v-row>
			<v-col md="3">
				<v-card>
					<v-card-title>Фильтры</v-card-title>
					<v-card-text>
						<v-select
							v-model="selectedCategory"
							:items="categories"
							label="Выберите категорию"
							clearable
						></v-select>
						<v-range-slider
							v-model="priceRange"
							:min="minPrice"
							:max="maxPrice"
							label="Цена, ₸"
							hide-details
							thumb-label
						></v-range-slider>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col md="9">
				<div class="mb-4 text-h3">Все товары</div>
				<div v-if="flags.isLoading">
					Загрузка...
				</div>
				<div v-else class="d-flex flex-wrap ga-2">
					<div v-for="product in filtered" :key="product.id">
						<v-card class="mb-2 pa-3 d-flex flex-column" outlined width="300px" height="400px">
							<v-img :src="product.image" height="200px" width="100%"></v-img>
							<v-card-title>{{ product.name }}</v-card-title>
							<v-card-text>{{ product.price }} ₸</v-card-text>
							<v-card-actions>
								<v-btn icon @click="addToCart(product)">
									<v-icon>mdi-cart</v-icon>
								</v-btn>

								<v-snackbar v-model="snackbar" :timeout="3000">
									{{ snackbarMessage }}
									<template v-slot:action="{ attrs }">
										<v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
											Закрыть
										</v-btn>
									</template>
								</v-snackbar>

								<v-btn icon @click="toggleFavorite(product)">
									<v-icon>
										{{ isFavorite(product) ? 'mdi-heart' : 'mdi-heart-outline' }}
									</v-icon>
								</v-btn>
							</v-card-actions>
						</v-card>
					</div>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import useProducts from '@/composables/useProducts'
import { ref, onMounted } from "vue";

export default {
	name: 'MainPage',
	setup() {
		const { flags, products, getAllProducts } = useProducts()
		const favorites = ref([])
		const snackbar = ref(false)
		const snackbarMessage = ref('')

		onMounted(() => {
			const storedFavorites = sessionStorage.getItem('favorites')
			if (storedFavorites) {
				favorites.value = JSON.parse(storedFavorites)
			}
		})

		const addToCart = (product) => {
			const storedCart = sessionStorage.getItem('cart')
			const cart = storedCart ? JSON.parse(storedCart) : []

			cart.push(product)
			sessionStorage.setItem('cart', JSON.stringify(cart))

			snackbarMessage.value = `Добавлено в корзину: ${product.name}`
			snackbar.value = true

			console.log('Добавлено в корзину:', product)
		}

		const toggleFavorite = (product) => {
			if (favorites.value.some(fav => fav.id === product.id)) {
				favorites.value = favorites.value.filter(fav => fav.id !== product.id)
			} else {
				favorites.value.push(product)
			}
			sessionStorage.setItem('favorites', JSON.stringify(favorites.value))
		}

		const isFavorite = (product) => {
			return favorites.value.some(fav => fav.id === product.id)
		}

		return {
			snackbar,
			snackbarMessage,
			addToCart,
			flags,
			products,
			getAllProducts,
			toggleFavorite,
			isFavorite,
			favorites
		}
	},
	data() {
		return {
			selectedCategory: null,
			categories: ['Одежда', 'Обувь', 'Аксессуары', 'Гаджеты', 'Мебель'],
			priceRange: [0, 0]
		}
	},
	computed: {
		minPrice() {
			if (this.products.length) {
				return Math.min(...this.products.map(p => p.price))
			}
			return 0
		},
		maxPrice() {
			if (this.products.length) {
				return Math.max(...this.products.map(p => p.price))
			}
			return 0
		},
		filtered() {
			let result = this.products
			if (this.selectedCategory) {
				result = result.filter(product => product.category === this.selectedCategory)
			}
			if (this.priceRange && this.priceRange.length === 2) {
				const [minSelected, maxSelected] = this.priceRange
				result = result.filter(product => product.price >= minSelected && product.price <= maxSelected)
			}
			return result
		}
	},
	watch: {
		products(newVal) {
			if (newVal.length) {
				this.priceRange = [this.minPrice, this.maxPrice]
			}
		}
	},
	created() {
		this.getAllProducts()
	}
}
</script>
