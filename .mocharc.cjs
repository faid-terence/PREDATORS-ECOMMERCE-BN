module.exports = {
    timeout: 20000,
    recursive: true,
    exit: true,
    spec: "tests/*.test.js",
    all: true,
    include: [
        "src/**/*.js"
    ], 
    exclude: ["node_modules","src/database", "docs","src/database/**"],
    
};