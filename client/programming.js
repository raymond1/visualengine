function Programming(){
}

//returns true if test is between lowerBound and upperBound
Programming.between = function(test, lowerBound,upperBound){
  if (test >= lowerBound && test <= upperBound) return true;
  return false;
}

Programming.nothing = function(object){
  if (object == null||object == undefined) return true;
  else return false;
}


Programming.iterateListThroughRange = function(list,startIndex,endIndex, passedInFunction){
  for (var i = startIndex; i <= endIndex; i++){
    passedInFunction(list[i]);
  }
}

Programming.iterateThroughList = function(_array, _function){
  for (var i = 0; i < _array.length; i++){
    _function(_array[i]);
  }
}

Programming.getIndexThroughLinearSearch = function(stopCondition, inputArray){
  for (var i = 0; i < inputArray.length; i++){
    if (stopCondition(inputArray[i])){
      return i;
    }
  }
}

Programming.getArrayKeys = function(_array){
  var keys = [];
  for(var key in _array) {
    if(_array.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
}


//assumes _numericArray has at least on element
Programming.getIndexOfMax = function(_numericArray){
  var workingMax = _numericArray[0];
  var workingMaxIndex = 0;
  for (var i = 0; i < _numericArray.length; i++){
    if (_numericArray[i] > workingMax){
      workingMax = _numericArray[i];
      workingMaxIndex = i;
    }
  }
  return workingMaxIndex;
}

Programming.getIndexOfMin = function(_numericArray){
  var workingMin = _numericArray[0];
  var workingMinIndex = 0;
  for (var i = 0; i < _numericArray.length; i++){
    if (_numericArray[i] < workingMin){
      workingMin = _numericArray[i];
      workingMinIndex = i;
    }
  }
  return workingMinIndex;
}

Programming.insertAfter = function(elementToInsert, targetLocation){
  var parentElement = targetLocation.parentNode;
  parentElement.insertBefore(elementToInsert, targetLocation.nextSibling);
}


//JavaScript specific

//returns a new function that calls the old function before calling the new function
Programming.addFunctionToChain = function (newFunction, oldFunction){
  return function(){
    if (!Programming.nothing(oldFunction)){
      oldFunction();
    }
    newFunction();
  }
}

Programming.stringInList = function (string, list){
  for (var i = 0; i < list.length; i++){
    if (string == list[i]) return true;
  }
  return false;
}

//pass in a list of commands that can be processed
//return a function that checks if a given command is in that list before adding it to the command queue
Programming.getAddCommandToQueueFunction = function(commandList){
  var addCommandToQueue = function (commandString){
    if (Programming.stringInList(commandString, commandList)){
      var newCommand = new Command(commandString);
      this.commandQueue.add(newCommand);
    }
    return newCommand;
  }
  return addCommandToQueue;
}

//This will need to be changed in the future so that the user can enter in a list of commands and their respective actions
Programming.addCommandQueueCapability = function(object, commandList, commandProcessor) {
  object.commandQueue = new CommandQueue();

  //set up the list of allowed commands
  var setupAllowedCommands = function(object, commandQueueProcessor){
    object.addCommandToQueue = Programming.getAddCommandToQueueFunction(commandList);
  };

  setupAllowedCommands(object, commandList);


  //processCommandQueue is the function that goes through the command queue and executes the commands contained within
  object.processCommandQueue = commandProcessor.bind(object);
}



function Command(commandString){
  this.arguments = [];
  this.argument = this.arguments;
  this.commandString = commandString;
  this.addArgument = function(argument){
    this.arguments.push(argument);
  }
}

function CommandQueue(){
  this.queue = [];
  this.length = 0;
  this.add = function(command){
    this.queue.push(command);
    this.length++;
  }
}
