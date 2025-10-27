/** @type {import('prettier').Config} */
const config = {
  tabWidth: 2,

  tailwindAttributes: ["className", "class", "imgClassName", "listClassName"],
  tailwindStylesheet: "./src/styles/globals.css",
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
};

export default config;
