import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './App.jsx'
import { routes } from './routes.jsx'
import { HelmetProvider } from 'react-helmet-async'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const router = createBrowserRouter(routes)

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <HelmetProvider>
    <React.StrictMode>
      <App>
        <RouterProvider router={router} />
      </App>
    </React.StrictMode>
  </HelmetProvider>,
)
