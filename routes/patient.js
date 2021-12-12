const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");


const { patient } = new PrismaClient();


router.get("/", async (req, res) => {
    const patients = await patient.findMany({
        select: {
            id: true,
            email: true,
            nom: true,
        }
    })

    res.status(200).send(patients);
})


router.post("/", async (req, res) => {
    const NewPatient = await patient.create({
        data: {
            nom: req.body.nom,
            email: req.body.email,
        }
    });


    res.status(201).send(NewPatient);


});


router.delete("/:id", async (req, res) => {

    try{
        await patient.delete({
            where: {
                id: parseInt(req.params.id),
            }
        });
        
        res.status(204).send();
    }catch(e){
        res.status(400).send({"error" : e.meta.cause});
    }



});




router.put("/:id" , async (req , res) => {
    try{
        const UpdatedPatient = await patient.update({
            data : {
              email : req.body.email,
              nom : req.body.nom,
            },
            where : {
                id : parseInt(req.params.id)
            }
        });

        res.status(202).send(UpdatedPatient);

    }catch(e){
        res.status(400).send({"error" : e.meta.cause});
    }
})


module.exports = router;