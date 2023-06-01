const express = require("express");
const { createReadStream } = require("fs");
const fs = require("fs/promises");
const { pipeline } = require("stream");

const app = express();
const PORT = 3000;

const chunkSize = 1 * 1e+5;
app.get("/video", async(req, res)=>{
    const range = req.headers.range;
    const videoPath = '../Understanding Networking Understanding Node.js Core Concepts.mp4';
    const videoSize = (await fs.stat(videoPath)).size;

    const start = Number(range?.replace(/\D/g, ""));
    const end = Math.min(start+ chunkSize, videoSize - 1);

    const contentLength = end - start + 1;

    console.log('bytes ' + start + '-' + end + '/' + videoSize)
    const headers = {
        "Content-Range": 'bytes ' + start + '-' + end + '/' + videoSize,
        "Accept-Ranges": "bytes",
        "Content-Length" : contentLength,
        "Content-Type": "video/mp4"
    }

    res.writeHead(206, headers);

    const stream = createReadStream(videoPath, {start, end});
    pipeline(stream, res, (err)=>{
        if(err) console.log("error occured", err);
        console.log("Done successfully");
    });

})


app.listen(PORT, ()=>{
    console.log('Listening on Port ', PORT);
})