import * as mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    calendar: {
        holidays: [{}]
    },
})

export const User = mongoose.model('User', UserSchema)
