module.exports = {
    app: [{
        name: "docker-cluster",
        script : "../index.js",
        error_file: "./logs/err.log",
        wath: true,
        instances: 2,
        ignore_watch: "./src/logs/*",
        instance_var: "0"
    }]
}