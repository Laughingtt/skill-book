import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './assets/styles/tokens.css'

const app = createApp(App)
app.use(router)

// Global error handler — surfaces rendering errors instead of silent blank page
app.config.errorHandler = (err, vm, info) => {
  console.error('[Vue Error]', err, info)
  const debugEl = document.getElementById('vue-error-debug')
  if (debugEl) {
    debugEl.style.display = 'block'
    debugEl.textContent += `\n[Vue Error] ${err.message}\nComponent: ${vm?.$options?.__name || 'unknown'}\nInfo: ${info}\nStack: ${err.stack?.slice(0, 500)}`
  }
}

app.mount('#app')