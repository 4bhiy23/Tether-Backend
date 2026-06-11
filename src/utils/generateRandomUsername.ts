import { eq } from "drizzle-orm"
import db from "../db/db"
import { tetherUsers } from "../db/schema"

export const generateUsername = () => {
    while(true){
        const username = `user-${crypto.randomUUID().slice(0,8)}`

        const exists = db.select().from(tetherUsers).where(
            eq(tetherUsers.username, username)
        )

        if(!exists) return username
    }
}