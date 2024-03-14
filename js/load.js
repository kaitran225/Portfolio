const cssFiles = [
  "./css/conversation.css",
  "./css/global.css",
  "./css/layout.css",
  "./css/slider.css",
  "./css/logo.css",
  "./css/message.css",
  "./css/terminal.css",
];

    
/**
 * Loads CSS files by creating link elements and appending them to the document head.
 *
 * @param {Array} cssFiles - An array of CSS file paths.
 * @return {void} No return value.
 */
function loadCSSFiles() {
  cssFiles.forEach((cssFile) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssFile;
    document.head.appendChild(link);
  });
}

window.addEventListener("load", loadCSSFiles);
