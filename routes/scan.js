//setup express
const { PrismaClient } = require('.prisma/client');
var express = require('express');
var router = express.Router();


//store file using multer
var multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});
const upload = multer({ storage: storage });

const { scan } = new PrismaClient();






//create endpoint that use multer to store file
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const filepath = req.file.path;
        const NewScan = await scan.create({
            data: {
                url: filepath,
                date_scan : new Date()
            
            }
        });


        res.send(NewScan);
    } catch (error) {
        console.log(error);
    }
});



//get all scans
router.get('/', async (req, res) => {
    try {
        const scans = await scan.findMany();
        res.json(scans);
    } catch (error) {
        res.json({ message: error });
    }
});


//get scan by id and the name of variable is SelectedScan and change id to int and if dosen't exist return "not found"
router.get('/:id', async (req, res) => {
    try {
        const SelectedScan = await scan.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (SelectedScan) {
            res.json(SelectedScan);
        } else {
            res.json({ message: "not found" });
        }
    } catch (error) {
        res.json({ message: error });
    }
});


//update scan
router.put('/:id', async (req, res) => {
    try {
        const UpdatedScan = await scan.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                url: req.body.url,
                date_scan: new Date(),
            }
        });
        res.json(UpdatedScan);
    } catch (error) {
        res.json({ message: error });
    }
});


//delete scan
router.delete('/:id', async (req, res) => {
    try {
        const DeletedScan = await scan.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.json(DeletedScan);
    } catch (error) {
        res.json({ message: error });
    }
});




//export router
module.exports = router;