function createNetwork() {
    var hiddenNodes = new Array();
    var nodeCounter = 0;
    for ( i=1; i<=nodes.length-2; i++ ) {
        if ( nodes[i]>0 ) {
            hiddenNodes[nodeCounter]=nodes[i];
            nodeCounter++;
        }
    }

    var netOptions = {
        hidden: hiddenNodes,
        learningRate: learningRate
    }; 

    networkTrained = false;
    return new brain.NeuralNetwork(netOptions);
}

function runNetwork(net) {
    var netInputs = new Array();
    for ( i=0; i<nodes[0]; i++ ) 
        netInputs[i] = nodeInputs[i];
                        
    return net.toFunction()(netInputs);
}

function trainNetwork() {
    if ( network == null )
        network = createNetwork();

    var inputObject = eval(trainInputFormatted);
    network.train(inputObject);

    networkTrained = true;
}