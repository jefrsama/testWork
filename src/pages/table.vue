<template>
	<v-container fluid class="py-4">
		<v-row justify="center">
			<v-col cols="12" md="10" lg="8">
				<v-card elevation="4">
					<v-toolbar color="primary" dark flat>
						<v-toolbar-title>Ag Grid Table</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<ag-grid-vue
							class="ag-theme-alpine"
							:row-data="rowData"
							:column-defs="colDefs"
							:pinned-bottom-row-data="pinnedRowData"
							:default-col-def="defaultColDef"
							:grid-options="gridOptions"
							style="height: 80vh; width: 100%;"
							@row-clicked="onRowClicked"
						/>

					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default {
	name: 'TablePage',
	components: {
		AgGridVue,
	},
	setup() {
		const defaultColDef = {
			flex: 1,
		};

		const gridOptions = {
			popupParent: document.body
		};

		function getRandomString(length) {
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
			let result = '';
			for (let i = 0; i < length; i++) {
				result += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return result;
		}

		function getRandomFloat(min, max, decimals) {
			const num = Math.random() * (max - min) + min;
			return parseFloat(num.toFixed(decimals));
		}

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function getRandomImgPath() {
			return `https://picsum.photos/200?random=${getRandomInt(1, 1000)}`;
		}

		const val8Options = ["str1", "str2", "str3", "str4", "str5"];

		const data = [];
		for (let i = 0; i < 100; i++) {
			data.push({
				val1: getRandomString(10),
				val2: getRandomFloat(0, 100, 2),
				val3: getRandomFloat(0, 1000, 4),
				val4: getRandomInt(0, 1000),
				val5: getRandomInt(0, 1000),
				val6: getRandomImgPath(),
				val7: getRandomString(10),
				val8: val8Options[getRandomInt(0, val8Options.length - 1)]
			});
		}

		const rowData = ref(data);

		let sumVal3 = 0;
		let sumVal4 = 0;
		data.forEach(item => {
			sumVal3 += parseFloat(item.val3);
			sumVal4 += item.val4;
		});
		const avgVal4 = parseFloat((sumVal4 / data.length).toFixed(2));

		const pinnedRowData = ref([{
			val1: "Итого:",
			val2: null,
			val3: sumVal3,
			val4: avgVal4,
			val5: null,
			val6: "",
			val7: "",
			val8: ""
		}]);

		const colDefs = ref([
			{ field: "val1", headerName: "Val1", filter: false },
			{ field: "val2", headerName: "Val2", filter: false },
			{
				field: "val3",
				headerName: "Val3",
				filter: false,
				aggFunc: 'sum',
				valueFormatter: params => {
					return params.value != null ? params.value.toFixed(2) : "";
				}
			},
			{ field: "val4", headerName: "Val4", filter: false, aggFunc: 'avg' },
			{ field: "val5", headerName: "Val5", filter: false },
			{
				field: "val6",
				headerName: "Val6",
				filter: 'agTextColumnFilter',
				cellRenderer: params => {
					return `<img src="${params.value}" style="width: 60px; height: auto; border-radius: 4px;" alt="Image" />`;
				}
			},
			{ field: "val7", headerName: "Val7", filter: false },
			{ field: "val8", headerName: "Val8", filter: false }
		]);

		const onRowClicked = params => {
			alert(JSON.stringify(params.data));
		}

		return {
			rowData,
			colDefs,
			pinnedRowData,
			onRowClicked,
			gridOptions,
			defaultColDef
		}
	}
}
</script>

<style scoped>
.custom-grid {
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
