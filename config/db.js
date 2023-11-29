if(process.env.NODE_ENV == "production"){
    module.exports = {
        mongoURI: 'mongodb://127.0.0.1:27017/blogapp'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/blogapp'
    }
}
// } else {
//     module.exports = {
//         mongoURI:  "mongodb://<credentials>@127.0.0.1:14042/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2" // mudarei depois so testando
//     }
// }

// "mongodb://<credentials>@127.0.0.1:14042/?directConnection=true&serverSelectionTimeoutMS2000&appName=mongosh+1.6.2"
// "mongodb://<credentials>@127.0.0.1:14042/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2"
