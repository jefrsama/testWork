<template>
	<v-container class="h-100">
		<v-card class="mb-4">
			<v-card-title>Корзина</v-card-title>
		</v-card>
		<v-row>
			<v-col md="12">
				<v-card-text>
					<v-list class="d-flex flex-wrap ga-2">
						<v-list-item v-for="item in cartItems" :key="item.id">
							<v-card class="mb-2 pa-3 d-flex flex-column" outlined width="300px" height="400px">
								<v-list-item-avatar>
									<v-img :src="item.image" />
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title>{{ item.name }}</v-list-item-title>
									<v-list-item-subtitle>Цена: {{ item.price }} ₸</v-list-item-subtitle>
									<v-list-item-subtitle>Количество: {{ item.quantity }}</v-list-item-subtitle>
								</v-list-item-content>
								<v-list-item-action class="d-flex ga-2">
									<v-btn icon @click="decreaseQuantity(item)">
										<v-icon>mdi-minus</v-icon>
									</v-btn>
									<v-btn icon @click="increaseQuantity(item)">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
									<v-btn icon @click="removeFromCart(item)">
										<v-icon>mdi-delete</v-icon>
									</v-btn>
								</v-list-item-action>
							</v-card>
						</v-list-item>
					</v-list>
					<div class="mt-4">
						<h3>Итоговая сумма: {{ totalSum }} ₸</h3>
					</div>
				</v-card-text>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";

export default {
	name: 'CartPage',
	setup() {
		const cartItems = ref([]);

		onMounted(() => {
			const storedCart = sessionStorage.getItem('cart');
			if (storedCart) {
				const parsedCart = JSON.parse(storedCart).map(item => ({
					...item,
					quantity: item.quantity || 1
				}));
				cartItems.value = parsedCart;
			}
		});

		const updateSessionCart = () => {
			sessionStorage.setItem('cart', JSON.stringify(cartItems.value));
		};

		const removeFromCart = (product) => {
			cartItems.value = cartItems.value.filter(item => item.id !== product.id);
			updateSessionCart();
		};

		const increaseQuantity = (product) => {
			const index = cartItems.value.findIndex(item => item.id === product.id);
			if (index !== -1) {
				cartItems.value[index].quantity += 1;
				updateSessionCart();
			}
		};

		const decreaseQuantity = (product) => {
			const index = cartItems.value.findIndex(item => item.id === product.id);
			if (index !== -1) {
				if (cartItems.value[index].quantity > 1) {
					cartItems.value[index].quantity -= 1;
				} else {
					cartItems.value.splice(index, 1);
				}
				updateSessionCart();
			}
		};

		const totalSum = computed(() => {
			return cartItems.value.reduce((sum, item) => {
				return sum + item.price * item.quantity;
			}, 0);
		});

		return {
			cartItems,
			removeFromCart,
			increaseQuantity,
			decreaseQuantity,
			totalSum
		};
	}
}
</script>
