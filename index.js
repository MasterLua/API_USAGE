var osu = require('node-os-utils')
const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());

RedouuTable = {
    ["KeyVerification"] : "RedouuOnTOP",
    ["DebugLog"] : true,
    ["CpuFunc"] : osu.cpu,
    ["DriveFunc"] : osu.drive,
    ["MemFunc"] : osu.mem,
    ["NetFunc"] : osu.netstat,
    ["ConsoleDebug"] : function(msg) {
        if(RedouuTable["DebugLog"]) {
            console.log("[API-STATS | By Redouu] ", msg)
        }    
    },
    ["VerificationKeyFunc"] : function(Key) {
        if(Key == RedouuTable["KeyVerification"]) {
            return true
        }else{
            return false
        }
    }
}

app.get('/cpu_usage', (req, res) => {
    if(RedouuTable["VerificationKeyFunc"](req.query.key)) {
        RedouuTable["CpuFunc"].free().then(info => {
            res.send({ cpu_free : info, cpu_usage: (100 - Number(info)) })
            RedouuTable["ConsoleDebug"](info) 
        })
    }else{
        res.send({ error: "Key verification is invalid." })
    }
})

app.get('/mem_usage', (req, res) => {
    if(RedouuTable["VerificationKeyFunc"](req.query.key)) {
        RedouuTable["MemFunc"].info().then(info => {
            res.send({ mem_totalmb : info.totalMemMb, mem_usedmb: info.usedMemMb, mem_freemb : info.freeMemMb, mem_free : info.freeMemPercentage, mem_usage : (100 - info.freeMemPercentage) })
        })
    }else{
        res.send({ error: "Key verification is invalid." })
    }
})

app.get('/disk_usage', (req, res) => {
    if(RedouuTable["VerificationKeyFunc"](req.query.key)) {
        RedouuTable["DriveFunc"].info().then(info => {
            res.send({ disk_totalgb : info.totalGb, disk_usedgb : info.usedGb, disk_freegb : info.freeGb, disk_usage : info.usedPercentage, disk_free : info.freePercentage })
            RedouuTable["ConsoleDebug"](info) 
        })      
    }else{
        res.send({ error: "Key verification is invalid." })
    }  
})

app.get('/net_usage', (req, res) => {
    if(RedouuTable["VerificationKeyFunc"](req.query.key)) {
        RedouuTable["NetFunc"].inOut().then(info => {
            res.send({ net_in : info["eth0@if1813"].inputMb, net_out : info["eth0@if1813"].outputMb })
            RedouuTable["ConsoleDebug"](info)
        })      
    }else{
        res.send({ error: "Key verification is invalid." })
    }  
})

app.use(function (req, res, next) {
    var err = "Invalid path this page is not create. Contact admin or webmaster of website.";
    err.status = 404;
    res.send(err);
});

app.listen(2334, () => {
    RedouuTable["ConsoleDebug"]("Has been started.")
})
