const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

app.use(express.json())
app.use(cors())


const AuthRoute = require("./routes/auth");
app.use("/auth" , AuthRoute);

const PatientRoute = require("./routes/patient");
app.use("/patient" , PatientRoute);

const ScanRoute = require("./routes/scan");
app.use("/scan" , ScanRoute);




app.listen(port, () => {
    console.log(`Scan your lungs (Backend) run at http://localhost:${port}`)
})