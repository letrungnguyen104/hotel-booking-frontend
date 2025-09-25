import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux';
import allReducers from './reducer';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

const store = createStore(allReducers);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster richColors />
    </BrowserRouter>
  </Provider>
)
