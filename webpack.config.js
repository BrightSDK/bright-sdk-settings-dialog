module.exports = {
    entry: "./src/settingsdialog.js",
    output: {
        filename: "settingsdialog.bundle.js",
        path: __dirname + "/dist",
        library: "SettingsDialog", // The name of the global variable
        libraryTarget: "umd", // Universal support for CommonJS, AMD, and global
        libraryExport: "default",  // ✅ This removes the "default" wrapper!
        globalObject: "this", // Ensures compatibility in different environments
        environment: {
            arrowFunction: false, // No arrow functions
            const: false, // No const/let
            destructuring: false, // No destructuring
        },

    },
    devtool: 'source-map',
    resolve: {
        fullySpecified: false // Fixes issues with some old module formats
    },
};
