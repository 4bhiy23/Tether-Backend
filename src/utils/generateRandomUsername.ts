import { eq } from "drizzle-orm"
import db from "../db/db.js"
import { tetherUsers } from "../db/schema.js"

export const generateUsername = async () => {
    while(true){
        const username = `user-${crypto.randomUUID().slice(0,8)}`

        const exists = await db.select().from(tetherUsers).where(
            eq(tetherUsers.username, username)
        )

        if(exists.length === 0) return username
    }
}