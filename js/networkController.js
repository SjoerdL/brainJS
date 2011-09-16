function loadNodesFromNetwork() {
    if ( network == null )
        return;
                
    resetCanvas(false);
    for ( i=0, index=0; i<network.layers.length; i++, index++ ) {
        if ( i==network.layers.length-1 && network.layers.length<nodes.length )
            index=nodes.length-1;        // Account for empty hidden layers
                        
        nodes[index] = getNumberOfNodes(network.layers[i]);
    }
                
    redrawCanvas();
    networkTrained = true;
}            

function newNode(pos) {
    for ( i=layerWidth,layer=0; i<=nodes.length*layerWidth; i+=layerWidth,layer++ ) {
        if ( pos.x <= i ) {
            if ( nodes[layer] < maxNodes[layer] ) {
                nodes[layer]++;
                network = null;
            }
            break;
        }
    }

    redrawCanvas();
}

function deleteSelectedNode() {
    $("#dialogDeleteNode").dialog( "open" );
} 

function selectNode(pos) {
    $("#editBox").hide();
    for ( j=layerWidth,layer=0; j<=nodes.length*layerWidth; j+=layerWidth,layer++ ) {
        if ( pos.x <= j ) {
            layerSelected = layer;
            checkLayerClickedNode(pos, nodes[layer], layerWidth/2+layer*layerWidth);
            break;
        }
    } 
}

/**
 * Shows info about a node (only when a network is trained)
 */
function infoSelectedNode() {
    var canvasOffset = $("#networkDesigner").offset();
    $("#infoBox").show();
    $("#infoBox").css("left", canvasOffset.left+layerWidth/2+layerSelected*layerWidth+nodeRadius+8);
    $("#infoBox").css("top", canvasOffset.top+nodeSelected*nodeRadius*3+10); 
                
    if ( network!=null && networkTrained ) {
        newLayerSelected = layerSelected;
        // Account for empty layers
        for ( i=1; i<nodes.length-1 && i<layerSelected; i++ ) {
            if ( nodes[i]==0 )
                newLayerSelected--;
        }

        var data = network.layers[newLayerSelected].nodes[nodeSelected];

        dataFound = false;
        var infoHTML = '<ul class="infoNode">';
        if ( data.bias != null ) {
            dataFound = true;
            infoHTML += '<li>Bias: '+data.bias.toFixed(5)+'</li>';
        }
        
        if ( data.weights != null ) {
            dataFound = true;
            infoHTML += '<li><a href="#" onclick="toggleInfoWeights();">Weights</a> (click to show)';
            infoHTML += '<ol class="weights">';
            $.each(data.weights, function(index, value){
                infoHTML += '<li>'+value.toFixed(5)+'</li>';
            });
            infoHTML += '</ol></li>'; 
        }
        
        if ( data.error != null ) {
            dataFound = true;
            infoHTML += '<li>Error: '+data.error.toFixed(4)+'</li>';
        }
        
        if ( !dataFound )
            infoHTML += '<li>No data available for this node</li>';
        
        infoHTML += '</ul>';

        $("#infoBox").html(infoHTML);
        $(".weights").hide();        
    } else {
        $("#infoBox").css("top", canvasOffset.top+nodeSelected*nodeRadius*3+nodeRadius-5); 
        $("#infoBox").html("Train network first");
    }
}

function toggleInfoWeights() {
    $(".weights").toggle();
}
            
/**
 * Calculate where to draw an edit box for a node
 */
function checkLayerClickedNode(pos, numberOfNodes, xOffset) {
    for ( i=0; i<numberOfNodes; i++ ) {
        var node = new Point(xOffset, nodeOffset+i*nodeRadius*3);
        if ( isClickedNode(pos, node) ) {
            drawEditBox(node);
            nodeSelected = i;
            break;
        }
    }           
}

/**
 * Checks whether or not a node is clicked
 */
function isClickedNode(click, node) {
    if ( click.x <= node.x+nodeRadius+20 && click.x >= node.x-nodeRadius-20 ) {
        return ( click.y <= node.y+nodeRadius+10 && click.y >= node.y-nodeRadius-10 );
    }
    return false;
} 