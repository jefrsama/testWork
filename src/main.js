/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Plugins
import { registerPlugins } from './plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

ModuleRegistry.registerModules([AllCommunityModule]);
const app = createApp(App)

registerPlugins(app)

app.mount('#app')
