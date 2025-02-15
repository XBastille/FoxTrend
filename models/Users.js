const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const UserSchema1 = new mongoose.Schema({
    company: {
        type: String,
    }
})

const UserSchema2 = new mongoose.Schema({
    Ticker: {
        type: String
    },
    Price: {
        type: Number
    },
    Change: {
        type: Number
    },
    ChangePercentage: {
        type: Number
    },
    Volume: {
        type: Number
    },
    MarketCap: {
        type: Number,
    },
    YearChange: {
        type: Number
    },
    beta:{
        type:Number
    }

})

const user1 = mongoose.model('CompanyStore', UserSchema1)
const user = mongoose.model('foxtrend', UserSchema)
const user2 = mongoose.model('CompanyDetails', UserSchema2)

module.exports = {
    User: user,
    CompanyStore: user1,
    CompanyDetails: user2
};