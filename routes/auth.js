const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const { doctor } = new PrismaClient()


router.get("/", async (req, res) => {
    const doctors = await doctor.findMany({
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            signature : true,
            role : true,
        }
    });

    res.status(200).send(doctors);
})



router.post("/register", async (req, res) => {
    const hashedpassword = await bcrypt.hash(req.body.password, await bcrypt.genSalt())


    const newDoctor = doctor.create({
        data: {
            email: req.body.email,
            password: hashedpassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            signature: req.body.signature,
            role : req.body.role,

        }
    });

    res.status(201).send({
        email: (await newDoctor).email,
        first_name: (await newDoctor).first_name,
        last_name: (await newDoctor).last_name,
        location: (await newDoctor).location,
        signature : (await newDoctor).signature,
        password: hashedpassword,
    })

})



router.post("/login", async (req, res) => {



    const connectedDoctor = doctor.findFirst({
        select: {
            first_name : true,
            last_name : true,
            email: true,
            password: true,
            signature : true,
            role : true,
        },
        where: {
            email: req.body.email,
        }
    });



    if (await connectedDoctor) {


        if (await bcrypt.compare(req.body.password, (await connectedDoctor).password)) {

            const token = jwt.sign(await connectedDoctor, "SCANYOURLUNGS");
            
            return res.status(200).json({
                "message": "Success",
                "user": await connectedDoctor,
                "token": token,
            });
        } else {
            return res.status(200).json({
                "message": "You have entered an invalid password"
            });
        }
    }


    return res.status(200).json({
        "message": "You have entered an non-existent email"
    })
})




module.exports = router;