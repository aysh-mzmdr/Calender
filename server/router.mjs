import { Router } from "express"
import db from "./database.mjs"

const router = Router()

router.post("/api/update", async (request,response) => {
    const {date,color,note} = request.body
    try{
        await new Promise((resolve, reject) => {
            db.run(`INSERT OR REPLACE INTO dates (date,color,note) VALUES (?,?,?)`,[date,color,note], 
                function(err) {
                    if (err) reject(err)
                    else resolve(this)
                }
            )
        })
        return response.sendStatus(201)
    }
    catch(err){
        console.log(err)
        return response.sendStatus(500)
    }
})

router.get("/api/getDates",async(request,response) => {
    const data = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM dates",
            function(err, rows) {
                if (err) reject(err)
                else resolve(rows)
            }
        )
    })
    response.send(data)
})

export default router