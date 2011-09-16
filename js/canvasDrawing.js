/**
 * Sets up a basic canvas
 */
function drawCanvas() {            
    var height = canvas.height;
    context.fillStyle = '#000000';
    context.strokeRect(0.5, 0, layerWidth, height);
    context.strokeRect(layerWidth+0.5, 0, layerWidth*3, height);
    context.strokeRect(layerWidth*4+0.5, 0, layerWidth, height);           

    context.beginPath();
    context.strokeStyle = "#c9c9c9";
    context.moveTo(layerWidth*2+0.5, 0);           // Hidden layers
    context.lineTo(layerWidth*2+0.5, height-30);
    context.moveTo(layerWidth*3+0.5, 0);
    context.lineTo(layerWidth*3+0.5, height-30);
    context.stroke();
    context.closePath();
                
    context.strokeStyle = '#000000';
    context.fillStle = '#000000';
    context.fillText("Input Layer", 20, height-35);
    context.fillText("Nodes: "+nodes[0]+"/"+maxNodes[0], 25, height-20);
    context.fillText("Hidden Layers", layerWidth+20, height-35);
    context.fillText("Nodes: "+nodes[1]+"/"+maxNodes[1], layerWidth*1+25, height-20);
    context.fillText("Nodes: "+nodes[2]+"/"+maxNodes[2], layerWidth*2+25, height-20);
    context.fillText("Nodes: "+nodes[3]+"/"+maxNodes[3], layerWidth*3+25, height-20);
    context.fillText("Output Layer", layerWidth*4+20, height-35); 
    context.fillText("Nodes: "+nodes[nodes.length-1]+"/"+maxNodes[maxNodes.length-1], layerWidth*4+25, height-20);
}

/** 
 * Resets the canvas and all network parameters
 */
function resetCanvas(resetNetwork) {
    canvas.height = canvas.height;
    drawCanvas();
    nodes = [0, 0, 0, 0, 0];
    iterations = 1000;
    learningRate = 0.5;
    if ( resetNetwork )
        network = null;
    networkTrained = false;
    for ( i=0; i<maxNodes[0]; i++ )
        nodeInputs[i] = 0;                
}
 
/**
 * Redraws the canvas by drawing a new canvas and all nodes and connections
 */
function redrawCanvas() {
    canvas.height = canvas.height;
    drawCanvas();
                
    for ( layer=0; layer<nodes.length; layer++ ) {
        for ( node=0; node<nodes[layer]; node++ ) {
            drawNode(new Point(layerWidth/2+layer*layerWidth, nodeOffset+node*nodeRadius*3));
        }
    }
                
    for ( layer=0; layer<nodes.length; layer++ ) {
        for ( node=0; node<nodes[layer]; node++ ) {
            drawConnectionsFromNode(node, layer);
        }
    }                 
}
 
function drawNode(pos) {
    context.strokeStyle = "#000000";
    context.beginPath();
    context.arc(pos.x, pos.y, nodeRadius, 0, Math.PI*2, false);
    context.stroke();
    context.closePath();
}
  
function removeNode(pos) {
    context.clearRect(pos.x-nodeRadius-2, pos.y-nodeRadius-2, nodeRadius*2+4, nodeRadius*2+4);
}
 
function getNumberOfNodes(layer) {
    counter = 0;
    $.each(layer.nodes, function(key, value) {
        counter++
    });
    return counter;
}

/**
 * Draws the links coming from a node
 */
function drawConnectionsFromNode(node, layer) {
    if ( layer >= nodes.length-1 )
        return;
                
    var nextLayer = layer;
    do {
        nextLayer++;
    } while ( nodes[nextLayer]==0 && nextLayer<nodes.length );
    var from = new Point(layer*layerWidth+layerWidth/2+nodeRadius, nodeOffset+node*nodeRadius*3);
    context.beginPath();
    for ( n=0; n<nodes[nextLayer]; n++ ) {
        var to = new Point((nextLayer)*layerWidth+layerWidth/2-nodeRadius, nodeOffset+n*nodeRadius*3);                
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y); 
    }
    context.strokeStyle = "#ccccff";
    context.stroke(); 
    context.closePath();
}

/**
 * Draws an edit box for node editting
 */
function drawEditBox(node) {
    $("#editBox").show();
    var canvasOffset = $("#networkDesigner").offset();                
    $("#editBox").css("left", canvasOffset.left+node.x+nodeRadius+5);
    $("#editBox").css("top", canvasOffset.top+node.y-nodeRadius-10);
}

/**
 * Selects the mode the user is currently in
 */
function selectMode(nrMode, id) {
    mode = nrMode;
    $(".tool").removeClass("selected");
    $("#"+id+"Tool").addClass("selected");

    $("#editBox").hide();
    $("#infoBox").hide();
    $("#singleInputBox").hide();
    $("#singleOutputBox").hide();
}

/**
 * Handles clicking events in the canvas based on the current mode
 */
function canvasOnClick(e) {
    var pos = getCursorPosition(e);
   
    $("#infoBox").hide();
    if ( mode == 1 )        // New node
        newNode(pos);
    else if ( mode == 2 )   // Parameters
        ;
    else if ( mode == 3 )   // Select node
        selectNode(pos);
}

function getCursorPosition(e) {
    var x; 
    var y;
    if ( e.pageX != undefined && e.pageY != undefined ) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
        y = e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
    }
                
    x-=canvas.offsetLeft;
    y-=canvas.offsetTop;

    var point = new Point(x, y);
    return point;
} 