import { eq } from "drizzle-orm"
import db from "../db/db.js"
import { user } from "../db/schema.js"

export const generateUsername = async () => {
    while(true){
        const username = `user-${crypto.randomUUID().slice(0,8)}`

        const exists = await db
            .select()
            .from(user)
            .where(eq(user.username, username));

        if(exists.length === 0) return username
    }
}