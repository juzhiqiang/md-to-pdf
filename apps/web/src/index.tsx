/* @import url('tailwindcss/preflight'); already handled by index.css */
import { render } from 'solid-js/web'
import App from './App'
import './index.css'
import './styles/markdown.less'

const root = document.getElementById('root')

if (!root) {
    throw new Error('Root element not found')
}

render(() => <App />, root)
