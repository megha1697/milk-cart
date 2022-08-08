const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://generic_user:password@123@mflix.tnbmq.mongodb.net/kore_ai?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})