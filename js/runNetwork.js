function singleRun() {
    if ( !networkTrained ) {
        messageDialog("In order to make a single run the network must be trained first.");
        selectMode(1, 'node');
    } else {                
        var canvasOffset = $("#networkDesigner").offset();
        $("#singleInputBox").show();
        $("#singleInputBox").css("left", canvasOffset.left+layerWidth/2+nodeRadius+15);
        $("#singleInputBox").css("top", canvasOffset.top+nodeRadius/2);

        $("#singleInputBox").html('<form id="formSingleRun" method="post" action="#">');
        $("#singleInputBox").append(singleRunInputBoxes());
        $("#singleInputBox").append('<input type="button" name="calculate" value="Run Network &gt;" onclick="singleRunExecute();" class="calculate" />')
        $("#singleInputBox").append("</form>");
    }
}
 
function singleRunExecute() {
    for ( i=0; i<nodes[0]; i++ ) {
        val = $("#inputNode"+i).val();
        if ( !isNaN(val) )
            nodeInputs[i] = parseFloat(val);
        else
            nodeInputs[i] = 0;
    }

    if ( network == null )
        network = createNetwork();
    var output = runNetwork(network);

    var canvasOffset = $("#networkDesigner").offset();
    $("#singleOutputBox").show();
    $("#singleOutputBox").css("left", canvasOffset.left+4*layerWidth+layerWidth/2+nodeRadius+15);
    $("#singleOutputBox").css("top", canvasOffset.top+nodeRadius/2);
    $("#singleOutputBox").html(singleRunOutputs(output));
}

function singleRunInputBoxes() {
    var inputs = "";
    for ( i=0; i<nodes[0]; i++ )
        inputs += '<input type="number" name="node'+i+'" id="inputNode'+i+'" value="'+nodeInputs[i]+'" step="0.05" min="0" max="1" class="inputValues" />\n';
    return inputs;
}

function singleRunOutputs(output) {
    var outputs = "";
    for ( i=0; i<nodes[nodes.length-1]; i++ ) {
        if ( output[i] != null )
            outputs += '<input type="number" name="output'+i+'" value="'+output[i].toFixed(6)+'" readonly="readonly" class="inputValues" />\n';
    }
    return outputs;
}

function processTrainData() {
    var lines = trainInput.split("\n");
    trainInputFormatted = "";
    for ( i=0; i<lines.length; i++ ) {
        errorLineNr = i;
        var io = lines[i].split(";");
        if ( io.length == 2 ) {
            var inputsTmp = io[0].split(":");
            var outputsTmp = io[1].split(":");
            if ( $.trim(inputsTmp[0].toLowerCase())=="input"  && inputsTmp.length == 2 && 
                $.trim(outputsTmp[0].toLowerCase())=="output" && outputsTmp.length == 2 ) {
                var inputs = inputsTmp[1].split(",");
                var outputs = outputsTmp[1].split(",");
                if ( inputs.length == nodes[0] && outputs.length == nodes[nodes.length-1] ) {
                    for ( j=0; j<inputs.length; j++ ) {
                        parsedValue = parseFloat(inputs[j]);
                        if ( isNaN(inputs[j]) || parsedValue<0 || parsedValue>1 ) {
                            error = "The (input) data seems to contain non-numeric items";
                            return false;
                        }
                    }
                    for ( k=0; k<outputs.length; k++ ) {
                        parsedValue = parseFloat(outputs[k]);
                        if ( isNaN(outputs[k]) || parsedValue<0 || parsedValue>1 ) {
                            error = "The (output) data seems to contain non-numeric items";
                            return false;
                        }
                    }
 
                    trainInputFormatted += "{input: ["+inputsTmp[1]+"], output: ["+outputsTmp[1]+"]},";
                } else {
                    error = "The number of nodes in the training data does not correspond to the number of nodes in the graph";
                    return false;
                }
            } else {
                error = "The data is not formatted correctly.";
                return false;
            }
        } else {
            error = "The data is not formatted correctly.";
            return false;
        }
    }

    if ( lines.length == 0 ) {
        error = "No data was found to process";
        errorLineNr = 0;
        return false;
    }

    trainInputFormatted = trainInputFormatted.substr(0, trainInputFormatted.length-1);
    trainInputFormatted = "["+trainInputFormatted+"]";
    return true;
}