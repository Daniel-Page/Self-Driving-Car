class NeuralNetwork{
    constructor(neuronCounts) {
        this.levels = [];
        for (let i=0;i<neuronCounts.length-1;i++) {
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs,network) {
        let outputs = Level.feedForward(
            givenInputs,network.levels[0]
        );

        for (let i=1;i<network.levels.length;i++) {
            outputs = Level.feedForward(
                outputs,network.levels[i]
            );
        }
        return outputs;
    }
}

class Level{
    constructor(inputCount,outputCount) {
        this.inputs = new Array(inputCount); // Creating empty arrays
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount); // Each output neuron has a bias - a value above which it will fire

        this.weights = [];
        for (let i=0;i<inputCount;i++) { // Connecting every input neuron to every output neuron
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomise(this);
    }

    static #randomise(level) { // Methods don't serialise, hence static
        for (let i=0;i<level.inputs.length;i++) {
            for (let j=0;j<level.outputs.length;j++) {
                level.weights[i][j] = Math.random()*2-1; // Between -1 and 1
            }
        }

        for (let i=0;i<level.biases.length;i++) {
            level.biases[i] = Math.random()*2-1;
        }
    }

    static feedForward(givenInputs,level) {
        for (let i=0;i<level.inputs.length;i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i=0;i<level.outputs.length;i++) {
            let sum = 0;
            for (let j=0;j<level.inputs.length;j++) {
                sum += level.inputs[j]*level.weights[j][i];
            }
            if (sum > level.biases[i]) {
                level.outputs[i] = 1; // Neuron turned on
            } else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}