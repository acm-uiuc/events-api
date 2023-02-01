import { Schema } from "mongoose";

const EventSchema = new Schema({
    title: {
        type: String, 
        required: true
    }, 
    description:  {
        type: String, 
        required: true
    },
    date:  {
        type: String, 
        required: true
    },
    location:  {
        type: String, 
        required: true
    },
    locationLink: String,
    repeats: String
})

export default EventSchema;