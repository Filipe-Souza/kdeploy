const path = require("path");
const resolveApp = relativePath => path.resolve(".", relativePath);

module.exports = {
  appManifestJson: resolveApp("./distKaios/manifest.webapp"),
  appNodeModules: resolveApp("node_modules"),
  appDist: resolveApp("./distKaios/")
};
