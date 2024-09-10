import express from "express"
import { fileURLToPath } from "url";
import path from "path"
import menuRoutes from "./routes/menu.mjs"

const app = express()


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// TODO: Enable sessions (not needed for assignment project)

app.set("view engine", "ejs")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.set("views", "src/views")
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "../src/public")));


// TODO: app.use routes
app.use("/menu", menuRoutes)

const port = 8088
app.listen(port, function() {
    console.log("Express started on http://localhost:"+port)
})


