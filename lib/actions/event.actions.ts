"use server"
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, UpdateEventParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import Event from "../database/models/event.model"
import { revalidatePath } from "next/cache"
import Category from "../database/models/category.model"

const populateEvent = (query: any) => {
    return query
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })
  }
export const createEvent = async({event,userId,path}:CreateEventParams)=>{
    console.log('createEvent: ', event);

    try{
       await connectToDatabase()
       const organizer = await User.findById(userId  )
       console.log('organizer: ', organizer);
       if (!organizer) throw new Error('Organizer not found');
       const newEvent = await Event.create({...event,category:event.categoryId,organizer:userId})
       revalidatePath(path)
       return JSON.parse(JSON.stringify(newEvent))

    }catch(error){
        handleError(error)
    }
}

export async function getEventById(eventId: string) {

    try{
        await connectToDatabase()
        const event = await populateEvent(Event.findById(eventId))
        if (!event) throw new Error('Event not found')

            return JSON.parse(JSON.stringify(event))
    }catch(error) {
        handleError(error)
      }
}

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try{

    } catch (error) {
        handleError(error)
      }
}

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
    
}

export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
    
}

export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    
}