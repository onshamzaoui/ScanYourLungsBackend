const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { appointment } = new PrismaClient();
router.get("/",async(res,req)=>{ 
    const appointment = await appointment.findMany({
        select: {
            id: true,
            date_appointment: true,
            patient_id: true,
            pulmonologist_id:true,

        }
    })

    res.status(200).send(appointment);
}) 
router.get("/:id", async(res,req)=>{
    try{
        await appointment.findById({
            where: {
                id: parseInt(req.params.id),
            }
        });
        
        res.status(204).send();
    }catch(e){
        res.status(400).send({"error" : e.meta.cause});
    }
})
router.post("/", async (req, res) => {
    const NewAppointment = await appointment.create({
        data: {
            date_appointment: req.body.date_appointment,
            patient_id : req.body.patient_id,
            pulmonologist_id: req.body.pulmonologist_id,
        }
    });
    res.status(201).send(NewAppointment);
})

router.put("/:id" , async (req , res) => {
    try{
        const UpdatedAppointment = await appointment.update({
            data : {
              date_appointment : req.body.date_appointment,
              patient_id : req.body.patient_id,
              pulmonologist_id: req.body.pulmonologist_id,
            },
            where : {
                id : parseInt(req.params.id)
            }
        });

        res.status(202).send(UpdatedAppointment);

    }catch(e){
        res.status(400).send({"error" : e.meta.cause});
    }
})

router.delete("/:id", async (req, res) => {

    try{
        await appointment.delete({
            where: {
                id: parseInt(req.params.id),
            }
        });
        
        res.status(204).send();
    }catch(e){
        res.status(400).send({"error" : e.meta.cause});
    }



});


module.exports = router;