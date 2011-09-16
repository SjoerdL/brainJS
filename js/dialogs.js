$(document).ready(function() {
    $("#editBox").hide();
    $("#infoBox").hide();
    $("#singleInputBox").hide();
    $("#singleOutputBox").hide();

    $( "#dialogParameter" ).dialog({
        autoOpen: false,
        resizable: true,
        modal: true,
        height: 280,
        width: 400,
        close: function() {
            selectMode(1, "node");
        },
        buttons: {
            "Save": function() {
                var objIterations = $("#inputIterations");
                var objLearningRate = $("#inputLearningRate");
                var foundError = false;
                objIterations.removeClass("ui-state-error");
                objLearningRate.removeClass("ui-state-error");  
                $(".validateTips").text("").removeClass("ui-state-highlight");

                if ( isNaN(objIterations.val()) || objIterations.val()<0 ) {
                    updateDialogTips(objIterations, "The field 'Iterations' needs to be a number and equal to or larger than 0");
                    foundError = true;
                }

                if ( isNaN(objLearningRate.val()) || objLearningRate.val()<0 ) {
                    updateDialogTips(objLearningRate, "The file 'Learning Rate' needs to be a number and equal to or larger than 0");
                    foundError = true;
                }

                if ( !foundError ) {
                    iterations = objIterations.val();
                    learningRate = objLearningRate.val();
                    network = null;
                    $(this).dialog("close");
                }
            },
            "Cancel": function() {
                $(this).dialog("close");
            }
        }
    });

    $( "#parameterDialog" ).click(function() {
        $( "#dialogParameter" ).dialog( "open" );
        return false;
    }); 

    $("#dialogResetCanvas").dialog({
        autoOpen: false,
        resizable: false, 
        height: 200, 
        modal: true, 
        close: function() {
            selectMode(1, 'node');
        },
        buttons: {
            "Reset canvas": function() {
                resetCanvas(true);
                selectMode(1, 'node');
                $(this).dialog("close");
            }, 
            "Cancel": function() {
                $(this).dialog("close");
            }
        }  
    });

    $("#dialogDeleteNode").dialog({
        autoOpen: false,
        resizable: false,
        height: 200,
        modal: true,
        buttons: {
            "Ok": function() {
                nodes[layerSelected]--;
                network = null;
                redrawCanvas();
                $("#editBox").hide();
                $(this).dialog("close");
            }, 
            "Cancel": function() {
                $(this).dialog("close");
            }
        }
    });

    $("#dialogMessage").dialog({
        autoOpen: false,
        resizable: false,
        height: 200,
        modal: true,
        buttons: {
            "Ok": function() {
                $(this).dialog("close");
            }
        }
    });

    $("#dialogTrainData").dialog({
        autoOpen: false,
        resizable: true,
        height: 460,
        width: 510,
        modal: true,
        close: function(){
            selectMode(1, 'node');
            trainInput = $("#inputTrainingData").val();   
        },
        buttons: {
            "Ok": function() {
                trainInput = $("#inputTrainingData").val();
                $(".jsonTips").text("").removeClass("ui-state-hightlight");
                if ( !processTrainData() ) {
                    $(".jsonTips")
                    .text("The training data is not correct. Please check the notation is the same as used in the example above. An error is found on line "+errorLineNr+"; "+error)
                    .addClass( "ui-state-highlight" );
                } else {
                    trainNetwork();
                    $(this).dialog("close");
                    messageDialog("The network was trained successfully. Try a single run to see your network in action");
                    selectMode(4, 'run');
                    singleRun();
                }
            }, 
            "Cancel": function() {
                $(this).dialog("close");
            }
        }
    });

    $("#dialogLoadNetwork").dialog({
        autoOpen: false,
        resizable: true,
        height: 450,
        width: 510,
        modal: true,
        close: function() {
            selectMode(1, 'node');
        },
        buttons: {
            "Ok": function() {
                selectMode(1, 'node');
                $(this).dialog("close");

                if ( network == null )
                    network = createNetwork();
                var networkJSON = $("#inputLoadNetwork").val();
                network.fromJSON(JSON.parse(networkJSON));
                loadNodesFromNetwork();
            },
            "Cancel": function() {
                $(this).dialog("close");
            }
        }
    });

    $("#dialogSaveNetwork").dialog({
        autoOpen: false,
        resizable: true,
        height: 450,
        width: 510,
        modal: true,
        close: function() {
            selectMode(1, 'node')
        },
        buttons: {
            "Ok": function() {
                $(this).dialog("close");
            }
        }
    });
});

//--- Dialog functions
function updateDialogTips(obj, text) {
    $(".validateTips")
    .text(text)
    .addClass( "ui-state-highlight" );
                
    obj.addClass("ui-state-error");
}

function messageDialog(msg) {
    $("#dialogMessage").dialog( "open" );
    $("#dialogMessage").html('<p id="msg">'+msg+'</p>');
}

function resetCanvasDialog() {
    $("#dialogResetCanvas").dialog("open");
}

function inputTrainDataDialog() {
    $("#dialogTrainData").dialog("open");
    $("#inputTrainingData").val(trainInput);
}

function saveNetworkDialog() {
    $("#dialogSaveNetwork").dialog("open");
    if ( network == null )
        $("#inputSaveNetwork").val("No network found. Create and train a network first");
    else 
        $("#inputSaveNetwork").val(JSON.stringify(network.toJSON()));
}

function loadNetworkDialog() {
    $("#dialogLoadNetwork").dialog("open");
}