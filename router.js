const express = require('express')
const router= express.Router()

// router.route('/:username/:id')
//     .get((req,res)=>{
//         // validateID(req.params.id);
//     console.log(JSON.stringify(req.headers)); 
//     res.send(' welcome to page, ' + req.params.username)
// })
//     .post((req,res)=>{
//     // processData(req.params.username);
//     res.send('data received ')
// })

router.post('/facial-senti-api', (req,res)=>{
        console.log(JSON.stringify(req.headers));
        res.send('data received ') 
})

module.exports = router;