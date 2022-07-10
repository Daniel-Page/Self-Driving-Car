const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

//const networkCanvas = document.getElementById("networkCanvas");
//networkCanvas.width = 300;

//const networkCtx = carCanvas.getContext("2d");
const carCtx = carCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
//const car = new Car(road.getLaneCenter(1),100,30,50,"AI"); // or "KEYS"
const N = 2;
const cars = generateCars(N);
let bestCar = cars[0];
// if (localStorage.getItem("bestBrain")) {
//     for (let i=0;i<cars.length;i++) {
//         cars[i].brain = JSON.parse(
//             localStorage.getItem("bestBrain")
//         );
//         if (i != 0) {
//             NeuralNetwork.mutate(cars[i].brain,0.2);
//         }
//     }
//     bestCar.brain = JSON.parse(
//         localStorage.getItem("bestBrain")
//     );

// }

bestCar.brain = {
    "levels": [{
        "inputs": [0.32971360855695664, 0, 0, 0, 0],
        "outputs": [1, 1, 1, 0, 1, 1],
        "biases": [-0.036833149881899424, -0.3310100211433388, -0.1888264133151164, 0.21692952996541415, -0.47982177502831047, -0.2886883904144824],
        "weights": [
            [0.13187205848556097, -0.045204242562627714, 0.059326117778486676, 0.20988192779053028, 0.23390249772994126, 0.3671809684202981],
            [-0.3029867137277343, 0.015817457962442855, 0.22027248192608767, -0.21048449877755643, -0.2197384128088898, -0.24197554789399767],
            [-0.18750062486368485, 0.39053704699027025, 0.3067131196626916, -0.1187817812666309, -0.09479940143606733, -0.312958533820809],
            [0.1802584294779339, -0.07392280800772552, 0.579171824030085, -0.2939420583451941, -0.3504745216218629, -0.08443869900826323],
            [0.24708573157290653, 0.586331028479924, -0.026369651531215087, 0.031180411313242284, 0.11525769470497584, -0.34320461193998864]
        ]
    }, {
        "inputs": [1, 1, 1, 0, 1, 1],
        "outputs": [1, 1, 1, 0],
        "biases": [0.17762048047437387, -0.14543886787387664, -0.27742332732107366, -0.4005219314204944],
        "weights": [
            [0.11423584042046281, 0.31281224939957386, -0.4036345130090823, -0.46104102403521474],
            [0.0389426722558292, -0.0680191272403404, 0.05885131243260136, -0.5839407652871673],
            [0.11544675838485863, 0.09014153157922797, -0.09603945163629017, -0.14850413122570708],
            [-0.20060467771830706, 0.5176377098331639, 0.3056318445427308, 0.09219517417733494],
            [0.2558869415789403, -0.22393485242717182, -0.2802277063549895, -0.13544991327680295],
            [-0.2756171897005214, -0.005022172762246507, 0.45597757324066696, -0.15713624722031755]
        ]
    }]

};

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2)

];

animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)); // Serialising brain into local storage
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )
    );

    // networkCanvas.height = window.innerHeight;
    carCanvas.height = window.innerHeight; // Refreshes drawing and updates height of canvas

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    // Visualiser.drawNetwork(networkCtx,car.brain);
    requestAnimationFrame(animate);
}