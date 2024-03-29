//A Graph refers to the plot that is going to be plotted.
function Graph(options){
  this.debuggingEnabled = true
  this.objectType = "Graph"


  this.mainScene = null;
  this.mainSceneCamera = null;
  this.mainSceneCameraOrientation = null;

  this.debugArea = null;//area for debug messages

//This snippet is meant for documenting the commandProcessor function
//Commands needed:
//
//set scene begin
//  [many]
//  set point
//  end set point
//
//  [many]
//  set line
//  end set line
//
//  [many]
//  set triangle
//  end set triangle
//
//  [many]
//  set mesh
//  end set mesh
//set scene end
//
//set number begin
//  set 1
//  set 0
//set number end
//
//set 3-tuple begin
//  set number begin
//    set 1
//    set 0
//    set 1
//  set number end
//
//  set number begin
//    set number end
//    set number begin
//  set number end
//set 3-tuple end
//
//set triangle begin
//  set 3-tuple begin
//  set 3-tuple end
//  set 3-tuple begin
//  set 3-tuple end
//  set 3-tuple begin
//  set 3-tuple end
//set triangle end
//
//set mesh begin
//  [many]
//  set triangle begin
//  set triangle end
//set mesh end


  var commandList = []
  commandList.push(
    new Command(
      'demo',
       function(){
        if (!this.initialized){
          this.initialize()
        }

        window.requestAnimationFrame(this.rotationDemo)
      }.bind(this)
    )
  )
  commandList.push(new Command('load scene from memory', function(){
    alert('test')
  }))


  Programming.addCommandQueueCapability(this, commandList);

  this.sceneString = '' //used to input a scene in text form.

  //This function takes the value from this.sceneString, parses it, and creates a Scene object out of it
  this.loadScene = function(){
/*
    //basic normalization
    if (typeof this.sceneString != 'string'){
      this.sceneString = ''
    }

    //blank scene = default state

    //current contexts = [''] //could be ['set scene'] or ['set scene', 'set number'], etc.
    //list_of_expected_strings = 'set scene begin'
    //Look for the string 'set scene begin'.
    this.sceneString.search('set scene begin')
    for (var i = 0; i < list_of_expected_strings.length; i++){
      if (stringUnderConsideration.search(list_of_expected_strings[i]) > -1){
      }
      else{
        //end processing...
      }
    }

    //if found, parse the stuff inside
    //if not found, create the null scene. 
*/
  }

  if (options == null){
    options = {};
  }

  this.options = options;
  function calculateGraphRadius(centroid,datapoints){
    var distances = [];
    for (var i = 0; i < datapoints.length; i++){
      var distance = Vector.distance(centroid,datapoints[i]);
      distances[i] = distance;
    }
    var greatestDistance = MyMath.max(distances);
    return greatestDistance;
  }
  
  //assumes an array of vectors is passed in
  //calculates a 3d centroid
  function calculateCentroid(datapoints){
    var numberOfPoints = datapoints.length;
    var totalX = 0;
    var totalY = 0;
    var totalZ = 0;
    for (var i = 0; i < numberOfPoints; i++){
      totalX += datapoints[i].getX();
      totalY += datapoints[i].getY();
      totalZ += datapoints[i].getZ();
    }
    var averageX = totalX/numberOfPoints;
    var averageY = totalY/numberOfPoints;
    var averageZ = totalZ/numberOfPoints;
    return new Vector(averageX,averageY,averageZ);
  }
  
  //generating buttons should be separate from generating hotkeys, but this is something that may never be fully implemented
  this.generateButtons = function (_initializationObject){
    window.graph.hotkeyFunctionMap = []
    var canvasParent = window.graph.canvas.parentNode;
    var br = document.createElement('br');
    Programming.insertAfter(br, window.graph.canvas);
    var previouslyInsertedElement = br;
    for (var i = 0; i < _initializationObject.length; i++){
      var newButton = document.createElement("button");
      var _buttonID = _initializationObject[i][0];
      var _function = _initializationObject[i][1];
      var _label = _initializationObject[i][2];
      var _hotkey = _initializationObject[i][3];

      newButton.setAttribute("id", _buttonID);
      newButton.addEventListener("click", _function);


      var labelText = document.createTextNode(_label);
      if (_initializationObject[i][3] != null){
        window.graph.hotkeyFunctionMap[_hotkey] = _function
        labelText.nodeValue += " (" + _hotkey +")";
      }
      newButton.appendChild(labelText);
      newButton.setAttribute("style", "");

      Programming.insertAfter(newButton, previouslyInsertedElement);

      previouslyInsertedElement = newButton;
    }
  }

  function generatePoint(){
    var datapoints = []
    datapoints.push(new Vector(0,0,120))
    return datapoints
  }
  
  function generateSquareCorners(){
    var datapoints = [];
    datapoints.push(new Vector(-10,-10,10));
    datapoints.push(new Vector(-10,10,10));
    datapoints.push(new Vector(10,10,10));
    datapoints.push(new Vector(10,-10,10));
    return datapoints;
  }

  function generateCircle(){
    var datapoints = [];
    var radius = 50;
    
    for (var angle = 0; angle < 360; angle = angle + 36){
      var y = Math.sin(angle * Math.PI/180) * radius;
      var x = Math.cos(angle * Math.PI/180) * radius;
      datapoints.push(new Vector(x,y,10));
    }

    radius = 25
    for (var angle = 0; angle < 180; angle = angle + 36){
      var y = Math.sin(angle * Math.PI/180) * radius;
      var x = Math.cos(angle * Math.PI/180) * radius;
      datapoints.push(new Vector(x,y,10));
    }

    return datapoints;
  }

  
  //draws a square with vertices (-10,-10,10), (-10,10,10), (10,-10,10), (10,10,10)
  function generateSquare(){
    var datapoints = [];

    for (var i = -10; i < 10; i++){
      datapoints.push(new Vector(10,i,10));
    }

    for (var i = -10; i < 11; i++){
      datapoints.push(new Vector(i,10,10));
    }

    for (var i = 9; i > -11; i--){
      datapoints.push(new Vector(-10,i,10));
    }

    for (var i = 9; i > -10; i--){
      datapoints.push(new Vector(i,-10,10));
    }    
    return datapoints;
  }
    
  function getDatapoints(){
    return this.datapoints;
  }
  
  function cameraInFocusMode(){
    if (window.graph.cameraMode == "focus point"){
      return true;
    }
    else{
      return false;
    }
  }
  
  //degrees is a number of degrees from -360 to +360.
  //axis is a string, either "y" or "x"
  function rotateCameraAroundFocusPoint(degrees, rotationAxis, focusPoint, camera){
    
    var radiansToRotate = degrees * Math.PI/180;
    var vectorToRotate = Vector.getVectorAB(focusPoint, camera.position);
    
    if (Vector.isNull(vectorToRotate)){
      //If the camera is already at the focus point, move the camera backwards, focus, then move towards the focus point
      camera.moveBackward(100);
      vectorToRotate = Vector.getVectorAB(focusPoint, camera.position);
      camera.position = Vector.add(focusPoint, Vector.rotate3dAroundOrigin(vectorToRotate, rotationAxis,radiansToRotate));
      camera.focus(focusPoint);
      camera.position = focusPoint;
    }else{
      camera.position = Vector.add(focusPoint, Vector.rotate3dAroundOrigin(vectorToRotate, rotationAxis,radiansToRotate));
      camera.focus(focusPoint);
    }
  }
  
  //This function does the following:
  //1)Makes sure the camera is focused on the focus point
  //2)Plane of rotation is defined by x axis of the camera and the focus point and the position of the camera
  //The y axis of the camera is perpendicular to this plane.
  //
  //rotates the camera's position
  function rotateCameraLeftAroundFocusPoint(){
    rotateCameraAroundFocusPoint(1, new Vector(0,1,0), window.graph.focusPoint, window.graph.camera);
  }

  function rotateCameraRightAroundFocusPoint(){
    rotateCameraAroundFocusPoint(-1, new Vector(0,1,0), window.graph.focusPoint, window.graph.camera);
  }

  function rotateCameraUpAroundFocusPoint(){
    rotateCameraAroundFocusPoint(1, new Vector(1,0,0), window.graph.focusPoint, window.graph.camera);
  }

  function rotateCameraDownAroundFocusPoint(){
    rotateCameraAroundFocusPoint(-1, new Vector(1,0,0), window.graph.focusPoint, window.graph.camera);
  }
  
  this.render = function(){
    this.renderer.renderScene();
  }.bind(this)

  function panLeftHead(){
    if (cameraInFocusMode()){
      rotateCameraLeftAroundFocusPoint()
    } else
    {
      panLeft()
    }
  }
  
  function _panLeft(){
    this.camera.panLeft();    
  }
  
  function panLeft(){
    panLeftHead()
    render()
  }

  function _panRight(){
    window.graph.camera.panRight();
  }
  
  function panRightHead(){
    if (cameraInFocusMode()){
      rotateCameraRightAroundFocusPoint()
    }
    else{
      _panRight()
    }
  }
  
  function panRight(){
    panRightHead()
    render()
  }

  function _panUp(){
    window.graph.camera.panUp();
  }
  
  function panUp(){
    if (cameraInFocusMode()){
      rotateCameraUpAroundFocusPoint()
    }
    else{
      _panUp()
    }
    window.renderer.renderScene();
  }
  
  function _panDown(){
    window.graph.camera.panDown();
  }
  
  function panDown(){
    if (cameraInFocusMode()){
      rotateCameraDownAroundFocusPoint()
    }
    else{
      _panDown()
    }
    window.renderer.renderScene();
  }

  function rotateClockwise(){
    window.graph.camera.rotateClockwise(this.angleStep);
    window.renderer.renderScene();
  }
  
  function rotateCounterclockwise(){
    window.graph.camera.rotateCounterclockwise(this.angleStep);
    window.renderer.renderScene();
  }
  
  function _moveForward(){
    window.graph.camera.moveForward();
  }
  
  function moveCameraTowardFocus(){
    window.graph.camera.focus(window.graph.focusPoint);
    window.graph.camera.moveForward(100);
    
    //if the camera ends up behind the focus point, then make it stop at the focus point
    if (!Vector.inSameDirections(window.graph.camera.getZAxis(), Vector.getVectorAB(window.graph.camera.position,window.graph.focusPoint))){
      window.graph.camera.moveTo(window.graph.focusPoint);
    }
  }
  
  function moveForward(){
    if (cameraInFocusMode()){
      moveCameraTowardFocus()
    }
    else{
      _moveForward()
    }
    this.renderer.renderScene();
  }
  
  function moveBackward(){
    window.graph.camera.moveBackward();
    window.renderer.renderScene();
  }
  
  function moveRight(){
    window.graph.camera.moveRight();
    window.renderer.renderScene();
  }
  
  function moveLeft(){
    window.graph.camera.moveLeft();
    window.renderer.renderScene();
  }
 
  function moveUp(){
    window.graph.camera.moveUp();
    window.renderer.renderScene();
  }
  
  function moveDown(){
    window.graph.camera.moveDown();
    window.renderer.renderScene();
  }

  function increaseFocalLength(){
    window.graph.camera.focalLength = window.graph.camera.focalLength * 1.1;
    window.renderer.renderScene();
  }
  
  function decreaseFocalLength(){
    window.graph.camera.focalLength = window.graph.camera.focalLength / 1.1;
    window.renderer.renderScene();
  }

  function increaseMagnification(){
    window.graph.renderer.camera.magnification *= 2;
    window.graph.renderer.renderScene();
  }
  
  function decreaseMagnification(){
    window.graph.renderer.camera.magnification = window.graph.renderer.camera.magnification / 1.1;
    window.graph.renderer.renderScene();    
  }
  
  function generateExponentialPoints(){
    var datapoints = [];
    //x axis is the sum of factors
    //y axis is the base
    //z axis is base ^ (sum of factors/base)
    for (var x = 1; x < 20; x = x + 1){
      for (var z = 0; z < 20; z = z + 1){
        var y = Math.log(Math.pow(x, z/x));
        datapoints.push(Vector.scalarMultiply(10,new Vector(x,y,z)));
      }
    }
    return datapoints;
  }

  function getHighestDatapoint(datapoints){
    var maxDatapoint = datapoints[0];
    for (var i = 0; i < datapoints.length; i++){
      if (datapoints[i].getZ() > maxDatapoint.getZ()){
        maxDatapoint = datapoints[i];
      }
    }
    return maxDatapoint;
  }
  
  function getLowestDatapoint(datapoints){
    var minDatapoint = datapoints[0];
    for (var i = 0; i < datapoints.length; i++){
      if (datapoints[i].getZ() < minDatapoint.getZ()){
        minDatapoint = datapoints[i];
      }
    }
    return minDatapoint;
  }
  
  function switchCameraMode(){
    if (window.graph.cameraMode == "focus point"){
      setCameraMode("free camera");
    }
    else{
      setCameraMode("focus point");
    }
  }
  
  function getKeyPress(e){
    var evtobj=window.event? event : e;
    var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var key=String.fromCharCode(unicode)

    if (window.graph.hotkeyFunctionMap[key] != null){
      window.graph.hotkeyFunctionMap[key]();
    }


    if (key=='p') window.graph.customDebugger.disableMessages = !window.graph.customDebugger.disableMessages;
    //0 key activates the debugging messages
//    if (key=='0'){
//    }
  }

  this.initialized = false;


  this.rotationDemo = function(){
    rotateCameraAroundFocusPoint(1, new Vector(1/Math.sqrt(3),1/Math.sqrt(3),1/Math.sqrt(3)), this.focusPoint, this.camera)

    this.renderer.renderScene()
    window.requestAnimationFrame(this.rotationDemo)
  }.bind(this)


  //displays a scene
  this.display = function(scene){
    //if init has not been performed, then perform it
    if (!this.initialized){
      this.initialize();
    }
    this.renderer.renderScene();
  }

  //distance moved by mouse is the angle to rotate in radians
  this.calculateDragRotationAngle = function(mouseDragDistance, focusPointDistance){
    return mouseDragDistance
//    return Math.atan(mouseDragDistance/focusPointDistance) ;
  }

  //When dragged, the points on the page will be rotated around the centroid of the graph
  //Imagine a sphere with a small square window. It behaves like a trackball.
  //Square has sides = 1
  //Sphere has radius = (1/2)sqrt(2)
  //
  //                                ,,,,,,
  //                            ,,,,,,,,,,,,,,
  //                         ,,,,,,,,,,,,,,,,,,,,
  //                       ,......................,
  //                      ,,......................,,
  //                     ,,,......................,,,
  //                    ,,,,......................,,,,
  //                    ,,,,......................,,,,
  //                    ,,,,......................,,,,
  //                    ,,,,......................,,,,
  //                     ,,,......................,,,
  //                      ,,......................,,
  //                       ,......................,
  //                         ,,,,,,,,,,,,,,,,,,,,
  //                            ,,,,,,,,,,,,,,
  //                                ,,,,,,
  
  //Coordinates in this piece of code are not for the objects inside the scene. They are relative to only the mouse coordinate system, with positive z being into the page
  //Let A be the point where the user clicks down
  //Let B be the point where the mouse currently is after some dragging
  //Let C be the centre of the rotational sphere located at (width/2, height/2, 0)
  var dragAction = function(){

    //calculated assuming the focus point is in the middle of the display area
    var getRotationalSphereHeight = function(radius, x,y){
      return Math.sqrt(Math.pow(radius,2) - Math.pow(x,2) - Math.pow(y,2))
    }


    var A = new Vector(this.mouse.buttonDownPosition.x, this.mouse.buttonDownPosition.y, 0)

    var C = new Vector(this.canvas.width/2, this.canvas.height/2, 0) //The centre of the sphere, in mouse space
    var sphereRadius = Math.sqrt(Math.pow(C.getX(),2) + Math.pow(C.getY(),2))

    //sphereHeightAPrime is the height on a theoretical sphere centred on the display area when the user first clicks on the mouse
    var sphereHeightAPrime = getRotationalSphereHeight(sphereRadius, A.getX() - C.getX(),A.getY() - C.getY())



    var APrime = new Vector(A.getX()- C.getX(), A.getY()-C.getY(), sphereHeightAPrime)//vector from C to A, but with a z value that depends on the location of A relative to the centre C






    var B = new Vector(A.getX() + this.mouse.draggingVector.x, A.getY() + this.mouse.draggingVector.y, 0)

    //sphereHeightB is the height of B on the theoretical sphere
    var sphereHeightBPrime = getRotationalSphereHeight(sphereRadius, B.getX()-C.getX(), B.getY() - C.getY())

    var BPrime = new Vector(B.getX() - C.getX(), B.getY() - C.getY(), sphereHeightBPrime)



    //The axis of rotation will be the cross product of the dragging vector with the z axis(out of the page)
    //var axisOfRotation = Vector.getUnitVector(Vector.crossProduct(new Vector(0,0,1), new Vector(this.mouse.draggingVector.x, this.mouse.draggingVector.y, 0)))

this.customDebugger.stickyMessage('APrime ' + Vector.toString(APrime), 'APrime')
this.customDebugger.stickyMessage('BPrime' + Vector.toString(BPrime), 'BPrime')
    var axisOfRotation = Vector.getUnitVector(Vector.crossProduct(APrime, BPrime))
this.customDebugger.stickyMessage('axisOfRotation ' + Vector.toString(axisOfRotation), 'axisOfRotation')

    if (Vector.magnitude(axisOfRotation) == 0){ //When mouse is in same spot it started in, axisOfRotation becomes the 0 vector
      axisOfRotation = new Vector(1,0,0) //arbitrary in case of rotation by 0 degrees
    }


    //The number of degrees to rotate around the axis of rotation
//    var draggingVectorAsVector = new Vector(this.mouse.draggingVector.x,this.mouse.draggingVector.y, 0)
//    var angleToRotate = this.calculateDragRotationAngle(Vector.magnitude(draggingVectorAsVector), 10)
    var angleToRotate = Vector.angleBetween(APrime, BPrime) * (180/Math.PI) 
this.customDebugger.stickyMessage('angleToRotate: ' + angleToRotate, 'angleToRotate')


    this.camera = this.dragStartCamera.clone()

    rotateCameraAroundFocusPoint(angleToRotate, axisOfRotation, this.focusPoint, this.camera)

    this.renderer.camera = this.camera //this line indicates a possible design flaw: When the camera is updated for the graph, the corresponding camera for the renderer is not updated. This can be interpreted to be an error.
    this.renderer.renderScene()

  }.bind(this)

  var dragStartAction = function(){
    this.dragStartCamera = this.camera.clone()

  }.bind(this)

  this.setupMouse = function(){
    this.mouse = new Mouse(this.canvas);

    this.mouse.setAction('drag start', dragStartAction);
    this.mouse.setAction('drag', dragAction);

    //updates the size of the bounding element for the display area where the mouse is active
    this.mouse.updateBoundingClientRect(this.canvas);
  }

  this.setupCanvas = function(){
    this.canvasWrapper = document.createElement("div");
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(this.canvasWrapper);

    this.canvas = document.createElement('canvas');
    this.canvasWrapper.appendChild(this.canvas);

    this.canvas.height = 500;
    this.canvas.width = 500;
  }

  this.setupDebuggingSystem = function(){
    window.graph.debuggingEnabled = true;

    this.customDebugger = new Debugger();
    window.graph.customDebugger = this.customDebugger;
    this.mouse.customDebugger = this.customDebugger;

    this.customDebugger.attach(this.canvasWrapper);

    window.customDebugger = this.customDebugger;
    this.mouse.updateMouseStatus();
  }

  this.setupRenderer = function(){
    this.context = this.canvas.getContext("2d")
    this.camera = new Camera(new Vector(0,0,0))

    //there are two available camera modes: "focus point" and "free camera"
    this.cameraMode = "focus point"


    var scene = new Scene()

    for (var i = 0; i < this.datapoints.length; i++){
      var colourString;
      if (this.height == 0){
        colourString = "#000000";
      }else{
        colourString = Colour.getNeutralString(Math.floor(((this.datapoints[i].getZ() - this.lowestDatapoint.getZ())/this.height)* Colour.maxGrayNumber));
      }
      
      var colourPoint = new ColourPoint
      (
        new Vector(this.datapoints[i].getX(), this.datapoints[i].getY(), this.datapoints[i].getZ()),
        colourString
      );
      scene.addColourPoint(colourPoint);
    }

    //Adds the centroid point to the scene
    scene.addColourPoint(new ColourPoint(new Vector(this.centroid.getX(), this.centroid.getY(), this.centroid.getZ()), "#00ff00"))
    
    this.scene = scene;
    this.mainScene = scene;

    this.renderer = new Renderer(this.camera, this.scene, this.canvas, this.context);
  }

  this.setupDatapoints = function(){
    this.datapoints = generateExponentialPoints()
//generateSquare()//generateCircle()
  }

  this.calculateGraphAttributes = function(){
    this.highestDatapoint = getHighestDatapoint(this.datapoints);
    this.lowestDatapoint = getLowestDatapoint(this.datapoints);
    this.height = this.highestDatapoint.getZ() - this.lowestDatapoint.getZ();
    this.centroid = calculateCentroid(this.datapoints);
    this.focusPoint = this.centroid;

    //graphRadius is the distance from the centroid of the graph to the farthest extremity
    this.graphRadius = calculateGraphRadius(this.centroid, this.datapoints);
  }

  this.setupKeyboard = function(){
    document.onkeypress = getKeyPress;
  }

  this.setupCamera = function(){
    if (this.options.cameraMode == "free camera"){
      setCameraMode("free camera");
    }
    else if (this.options.cameraMode == "focus point"){
      setCameraMode("focus point");
    }

    //initial camera location for focus point
    if (this.cameraMode == "focus point"){
      this.camera.position = new Vector(0,0,2 * this.graphRadius);
      this.camera.focus(this.focusPoint);
    }


    if (this.debuggingEnabled){
      this.customDebugger.stickyMessage("centroid:" + this.centroid.getX() + ',' + this.centroid.getY() + ',' + this.centroid.getZ(), "centroid");
    }
  }


  this.setupConstants = function(){
    this.angleStep = 10;
  }

  this.initialize = function(){
    this.setupCanvas();
    this.setupMouse();
    this.setupDebuggingSystem();
    this.setupDatapoints();
    this.calculateGraphAttributes();
    this.setupRenderer();
    this.setupKeyboard();    
    this.setupCamera();
    this.setupConstants();


    var initializationObject = 
    [  
 /*
      ["panRight", panRight, "Pan right", "d"],
      ["panLeft", panLeft, "Pan left", "a"],
      ["panUp", panUp, "Pan up", "w"],
      ["panDown", panDown, "Pan down", "s"],
      ["rotateClockwise", rotateClockwise, "Rotate clockwise", "e"],
      ["rotateCounterclockwise", rotateCounterclockwise, "Rotate counterclockwise", "q"],
      ["moveForward", moveForward, "Move forwards", "i"],
      ["moveBackward", moveBackward, "Move backwards", "o"],

      ["moveUp", moveUp, "Move up", "t"],
      ["moveDown", moveDown, "Move down", "g"],
      ["moveLeft", moveLeft, "Move left", "f"],
      ["moveRight", moveRight, "Move right", "h"],
      ["increaseFocalLength", increaseFocalLength, "Zoom out", "l"],
      ["decreaseFocalLength", decreaseFocalLength, "Zoom in", "k"],
      
      ["switchCameraMode", switchCameraMode, "Switch camera mode", "j"],*/
      ["increaseMagnification", increaseMagnification, "Increase Magnification", "+"],
      ["decreaseMagnification", decreaseMagnification, "Decrease Magnification", "-"]
    ];

    
    this.generateButtons(initializationObject);

    this.initialized = true;
  }

  function setCameraMode(cameraMode){
    window.graph.cameraMode = cameraMode;
    window.graph.customDebugger.stickyMessage("Camera Mode: " + window.graph.cameraMode, "camera mode");
  }

}
