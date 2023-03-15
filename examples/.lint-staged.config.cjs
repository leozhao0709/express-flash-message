module.exports = {
  '{src,tests}/**/*.{js,jsx,ts,tsx,json,css,scss,md}': (filenames) =>
    filenames.map((filename) => `prettier --write '${filename}'`),
};
