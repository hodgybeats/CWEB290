// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    host: "0.0.0.0", // needed to work in a devcontainer
    proxy: {
      "/api": { // this project api path redirect the localhost:5000 a.k.a project 3.4-TypeORM-UI
      
        target: "http://localhost:5000",
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});