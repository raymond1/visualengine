function Debugger(attachmentPoint){
  //debugAreas is in the form:
  //[
  // "areaname", element
  //]
  //, where element is an HTML DOM element
  this.debugAreas = [];

  if (!(attachmentPoint == null || attachmentPoint == undefined)){
    this.attachmentPoint = attachmentPoint;
  } else{
    this.attachmentPoint = null;
  }

  this.disableMessages = false;
  this.attachmentPoint = attachmentPoint;
  
  this.getUniqueID = Programming.getUniqueIDMaker();
  
  //_ is a protected area name
  //value is the value you want printed in the sticky area
  //areaName is the name of the sticky area
  //this function will clobber whatever else is in the area
  this.stickyMessage = function(value, areaName){
    if (this.disableMessages) return;
    if (areaName == null){
      areaName = "_";
    }
    
    if (this.debugAreas[areaName] == null){
      this.generateDebugArea(areaName);
    }
    this.debugAreas[areaName].innerHTML = value + "<br><br>\n";
  }
  
  //debug messages will be put at the element location
  this.attach = function(element){
    this.attachmentPoint = element;
  }
  
  function createArea(){
  }

  //debugArea is a string which is the name of the debug area to which the message will be appended
  //message is a string message
  this.debugMessage = function (message, debugArea){
    //create an area to write messages if none exist
    if (this.debugAreas.length == 0){
      this.generateDebugArea();
    }
    if (this.debugAreas[debugArea] == null){
      this.generateDebugArea(debugArea);
    }

    if (!this.disableMessages){
      if (debugArea == null|| debugArea == undefined){
        this.debugAreas[""].innerHTML += "<br><br>\n\n" + message;
      }
      else{
        this.debugAreas[debugArea].innerHTML += "<br><br>\n\n" + message;
      }
    }
  }

  //areaName is optional
  this.generateDebugArea = function (areaName){
    if (areaName == null || areaName == undefined){
      areaName = "";
    }

    //area with that name already exists
    if (this.debugAreas[areaName] != null){
      return;
    }
    
    var debugArea = document.createElement('div');
    var uniqueNumber = this.getUniqueID();
    debugArea.setAttribute('id','debug' + uniqueNumber);
    
    this.attachmentPoint.parentNode.insertBefore(debugArea, this.attachmentPoint.nextSibling);
    
    debugArea.setAttribute('style', 'background: #ffffff; float: left; display: block; clear: both;');
    
    
    this.debugAreas[areaName] = debugArea;
  }

  function Area(name){
    this.keyValuePairs = [];
  }
  
}

//Adds strings to the debug log
Debugger.debugLogMessages = ''
Debugger.enabled = false
Debugger.mode = 'console' //Options are 'console', 'save to memory'
Debugger.debugLog = function(input_string){
  if (Debugger.enabled == true){
    if (Debugger.mode == 'save to memory'){
      Debugger.debugLogMessages += input_string + '\n'
    }
    else if (Debugger.mode == 'console'){
      console.log(input_string)
    }
  }
}


