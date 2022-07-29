var Alarm = ""
var Status = ""
var Objects = []

function preload() {
    Alarm = loadSound("Alarm.wav")
}

function setup() {
    Canvas = createCanvas(500, 375)
    Canvas.position(400, 175)
    Video = createCapture(VIDEO)
    Video.hide()
    ObjectDetector = ml5.objectDetector("cocossd", ModelLoaded)
    document.getElementById("Status").innerHTML = "Status: Detecting Objects"
}

function draw() {
    image(Video, 0, 0, 500, 375)
    if (Status != "") {
        for (var i = 0; i < Objects.length; i++) {
            document.getElementById("Status").innerHTML = "Status: Objects Detected"
            fill("#FF0000")
            Percent = floor(Objects[i].confidence * 100)
            text(Objects[i].label.toUpperCase() + " " + Percent + "%", Objects[i].x + 15, Objects[i].y + 15)
            noFill()
            stroke("#FF0000")
            rect(Objects[i].x, Objects[i].y, Objects[i].width, Objects[i].height)
            if (Objects[i].label == "person") {
                document.getElementById("BabyStatus").innerHTML = "Baby Found"
                Alarm.stop()
            } else if (Objects[i].label != "person") {
                document.getElementById("BabyStatus").innerHTML = "Baby Not Found"
                Alarm.play()
                Alarm.loop()
            } else if (Objects.length == 0) {
                document.getElementById("BabyStatus").innerHTML = "Baby Not Found"
                Alarm.play()
                Alarm.loop()
            }
        }
    }
}

function ModelLoaded() {
    console.log("Model Loaded!")
    Status = true
    ObjectDetector.detect(Video, GetResults)
}

function GetResults(Error, Results) {
    if (Error) {
        console.error(Error)
    }
    console.log(Results)
    Objects = Results
}