<template>
	<v-container class="h-100">
		<v-card>
			<v-card-title>Избранное</v-card-title>
		</v-card>
		<v-row>
			<v-col md="12">
				<v-card-text>
					<v-list class="d-flex flex-wrap ga-2">
						<v-list-item
							v-for="item in favorites"
							:key="item.id"
						>
							<v-card class="mb-2 pa-3 d-flex flex-column" outlined width="300px" height="400px">
								<v-list-item-avatar>
									<v-img :src="item.image"/>
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title>{{ item.name }}</v-list-item-title>
									<v-list-item-subtitle>{{ item.price }} ₸</v-list-item-subtitle>
								</v-list-item-content>
								<v-list-item-action class="d-flex ga-2">
									<v-btn icon @click="addToCart(item)">
										<v-icon>mdi-cart</v-icon>
									</v-btn>
									<v-btn icon @click="removeFromFavorites(item)">
										<v-icon>mdi-heart</v-icon>
									</v-btn>
								</v-list-item-action>
							</v-card>
						</v-list-item>
					</v-list>
				</v-card-text>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
	name: 'WishlistPage',
	setup() {
		const isLoading = ref(false)
		const favorites = ref([])

		onMounted(() => {
			const storedFavorites = sessionStorage.getItem('favorites')
			if (storedFavorites) {
				favorites.value = JSON.parse(storedFavorites)
			}
		})

		const addToCart = (product) => {
			const storedCart = sessionStorage.getItem('cart');
			const cart = storedCart ? JSON.parse(storedCart) : [];

			cart.push(product);

			sessionStorage.setItem('cart', JSON.stringify(cart));
			alert(`Добавлено в корзину: ${product.name}`);
			console.log('Добавлено в корзину:', product);
		};

		const removeFromFavorites = (product) => {
			favorites.value = favorites.value.filter(item => item.id !== product.id)
			sessionStorage.setItem('favorites', JSON.stringify(favorites.value))
		}

		return {
			isLoading,
			favorites,
			addToCart,
			removeFromFavorites
		}
	}
}
</script>
