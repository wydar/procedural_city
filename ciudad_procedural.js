 // File 3.js
 function draw_scene(){
  
  const marginBlock = 5;
  const blockSeparation = 5;
  const blockSize = 60;
 //Create the Three.js WebGL renderer
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( 1024, 768 ); 
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor(0xEEEEEE);
  
  // Create the Three.js scene
  var scene = new THREE.Scene();
  
  // Create a camera and set it into world space
  // This camera will provide a perspective projection
  // Arguments are (fov, aspect, near_plane, far_plane)
  
  var camera = new THREE.PerspectiveCamera(70, 1024/768, 0.1, 1200);
  var camera2 = new THREE.OrthographicCamera(-1024/2 , 1024/2, 768/2, -768/2, 0.1, 1200);

	// Create the controller to move camera with mouse

  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
  mouseControls.staticMoving = true;
  mouseControls.dynamicDampingFactor = 0.3; 
	
	
  var axes = new THREE.AxisHelper( 500 );
  scene.add(axes);  
  
	var controls = new function(){
	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 600;
		this.camerax_prev = 200;
	  this.cameray_prev = 200;
	  this.cameraz_prev = 600;
	  this.colormesh = 0xff0000;
	  this.colorlight = 0xffffff;
	  this.color2 = 0x0000ff;
    this.poslight_x = 0;
    this.poslight_y = 200;
    this.poslight_z = 300;
    this.wireframe = false;
    this.cualcamera = 0;
		
		this.updateMat = function (e){
	    material.color = new THREE.Color(e);
			material.needsUpdate = true;
	  }
		this.updateLight = function (e){
	    light_point.color = new THREE.Color(e);			
	  }
		this.updateCamx = function (e){
	    camera.position.x = e;
			camera2.position.x = e;
	  }
	  this.updateCamy = function (e){
	    camera.position.y = e;
			camera2.position.y = e;
	  }
	  this.updateCamz = function (e){
	    camera.position.z = e;
      camera2.position.z = e;      
	  }
		
  }
    
  var geometry = new THREE.BoxGeometry( blockSize, 5, blockSize );
  //var geometry = new THREE.CylinderGeometry( 100, 100, 300, 32, 1);
  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals();
  var material = new THREE.MeshLambertMaterial( {color: controls.colormesh} );
	var caja = new THREE.Mesh(geometry, material);
	
	
  var block_coordinates = [];
  
  for (var i = -4; i < 5; i++){
    for (var j = -4; j < 5; j++) {
        var geom2 = geometry.clone();
        var mesh2 = new THREE.Mesh(geom2, material);
        mesh2.position.set(j*80, 0, i*80);
        scene.add(mesh2);
        block_coordinates.push([j*80,i*80]);
        block_coordinates.push([-j*80,-i*80]);
        
    }
  }



//************************************************************************************************************************************************************** 
  var map_geometry = new THREE.BoxGeometry(720,20,720);
  var map_material = new THREE.MeshLambertMaterial({color:0x00ff00});
  var map = new THREE.Mesh(map_geometry, map_material);
  map.position.set(0,-10,0);
  scene.add(map);
 
  var b_geometry = new THREE.BoxGeometry(10,30,10);
  var b_material = new THREE.MeshBasicMaterial({color:0x888888});
  var b = new THREE.Mesh(b_geometry, b_material);
  b.position.set(-320,0,-320);
  console.log(block_coordinates);
  scene.add(b);


  function getSubdivisions(){
    return Math.floor(Math.random() * 4) + 1;
  }

  function getRandomInt(){
    return Math.floor(Math.random());
  }

  function generateTexture() {
    // build a small canvas 32x64 and paint it in white
    var canvas  = document.createElement( 'canvas' );
    canvas.width = 32;
    canvas.height    = 64;
    var context = canvas.getContext( '2d' );
    // plain it in white
    context.fillStyle    = '#ffffff';
    context.fillRect( 0, 0, 32, 64 );
    // draw the window rows - with a small noise to simulate light variations in each room
    for( var y = 2; y < 64; y += 2 ){
        for( var x = 0; x < 32; x += 2 ){
            var value   = Math.floor( Math.random() * 64 );
            context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
            context.fillRect( x, y, 2, 1 );
        }
    }

  }
  

  function newBlockCenter(center){
    var rnd = Math.random()*0.42;
    console.log("prop: "+rnd);
    return [Math.floor(center[0] + ((blockSize/2) * rnd)), Math.floor(center[1] + ((blockSize/2) * rnd))];
  }

  function getQuadrantArea(center,ncenter,quadrant,subDivisions){
    var width;
    var depth;
    if(quadrant == 1){
      if(subDivisions==2){
        width = blockSize;
        depth = blockSize/2 + (ncenter[1] - center[1]);
      }else{
        width = blockSize/2 + (ncenter[0] - center[0]);
        depth = blockSize/2 - (ncenter[1] - center[1]);
      }    
    }else if(quadrant == 2){
      if(subDivisions == 2){
        width = blockSize;
        depth = blockSize/2 - (ncenter[1] - center[1]);
      }else{
        width = blockSize/2 - (ncenter[0] - center[0]);
        depth = blockSize/2 - (ncenter[1] - center[1]);
      }
    }else if(quadrant == 3){
      if(subDivisions ==3){
        width = blockSize;
        depth = blockSize/2 + (ncenter[1] - center[1]);
      }else{
        width = blockSize/2 + (ncenter[0] - center[0]);
        depth = blockSize/2 + (ncenter[1] - center[1]);
      }
    }else{
      width = blockSize/2 - (ncenter[0] - center[0]);
      depth = blockSize/2 + (ncenter[1] - center[1]);
    }
    return {width: width, depth: depth};
  }

  function setBuildingPosition(building, ncenter, quadrant, subDivisions, ocenter){
    if(quadrant == 1){
      if(subDivisions == 2){
        building.position.set(ocenter[0] , 0,ncenter[1] - building.geometry.parameters.depth/2 - blockSeparation);
      }else{
        building.position.set(ncenter[0] - building.geometry.parameters.width/2 - blockSeparation, 0,ncenter[1] + building.geometry.parameters.depth/2 + blockSeparation);
      }  
    }else if(quadrant == 2){
      if(subDivisions == 2){
        building.position.set(ocenter[0], 0, ncenter[1] + building.geometry.parameters.depth/2 + blockSeparation);
      }else{
        building.position.set(ncenter[0] + building.geometry.parameters.width/2 + blockSeparation, 0, ncenter[1] + building.geometry.parameters.depth/2 + blockSeparation);
      }
    }else if(quadrant == 3){
      if(subDivisions ==3){
        building.position.set(ocenter[0], 0, ncenter[1] - building.geometry.parameters.depth/2);
      }else{
        building.position.set(ncenter[0] - building.geometry.parameters.width/2 - blockSeparation, 0, ncenter[1] - building.geometry.parameters.depth/2 - blockSeparation);
      }
    }else{
      building.position.set(ncenter[0] + building.geometry.parameters.width/2 + blockSeparation, 0, ncenter[1] - building.geometry.parameters.depth/2 - blockSeparation);
    }
  }

  function generatesBuldings(coords){
    var subDivisions = getSubdivisions();
    //var g_material = new THREE.MeshLambertMaterial({color:0x888888});
    var g_geometry;

    var texture       = new THREE.Texture( generateTexture() );
    texture.anisotropy = renderer.getMaxAnisotropy();
    texture.needsUpdate    = true;

    // build the mesh
    var g_material  = new THREE.MeshLambertMaterial({
      map     : texture,
      vertexColors    : THREE.VertexColors
    });

    if( subDivisions == 1){
      //var g_material_1 = new THREE.MeshLambertMaterial({color:0x888fff});
      g_geometry = new THREE.BoxGeometry(blockSize - marginBlock ,70 ,blockSize - marginBlock);
      g = new THREE.Mesh(g_geometry, g_material);
      g.position.set(coords[0], 0, coords[1]);
      scene.add(g);
    }else{
      //if(subDivisions==3)
      var newCenter = newBlockCenter(coords);
      var area;
      //if(subDivisions==3)
      for(var i = 1; i<subDivisions+1; i++){
        area = getQuadrantArea(coords, newCenter, i, subDivisions);
        console.log("area: "+area.width+ " "+ area.depth);
        g_geometry = new THREE.BoxGeometry(area.width - marginBlock -5, 100, area.depth - marginBlock - 5);
        if(subDivisions==3 && i ==2){
          g_geometry = new THREE.BoxGeometry(area.width - marginBlock - 5, 150, area.depth - marginBlock - 5);
          var g_material_2 = new THREE.MeshLambertMaterial({color:0x558fff});
          g = new THREE.Mesh(g_geometry, g_material_2);
        }else if(subDivisions==3 && i ==3){
          g_geometry = new THREE.BoxGeometry(area.width - marginBlock -5, 150, area.depth - marginBlock - 5);
          var g_material_2 = new THREE.MeshLambertMaterial({color:0x444fff});
          g = new THREE.Mesh(g_geometry, g_material_2);
        }else
        g = new THREE.Mesh(g_geometry, g_material);
        setBuildingPosition(g, newCenter, i, subDivisions, coords);
        scene.add(g);
        console.log(g.position);
        
      
      }
      if(subDivisions == 2)
        console.log("centro: "+ coords + " nuevo centro: "+ newCenter + " subdivisiones: " + subDivisions);
      
    }
  }

  

  for(var i=0; i<block_coordinates.length; i++){
    generatesBuldings(block_coordinates.pop());
  }

//*************************************************************************************************************************************** */
  var light_point = new THREE.PointLight(controls.colorlight, 1);
	var sunMat = new THREE.MeshBasicMaterial({color: 'yellow'});
  var sunGeom = new THREE.SphereGeometry(10, 16, 8);
  sun = new THREE.Mesh(sunGeom, sunMat);
	sun.add(light_point);	
  sun.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
	scene.add(sun);
	
	camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
	camera2.position.set(controls.camerax, controls.cameray, controls.cameraz);
  
  
  var gui = new dat.GUI();
  var f1 = gui.addFolder('Camera');
  var controlx = f1.add(controls, 'camerax', -900,900).onChange(controls.updateCamx);
  var controly = f1.add(controls, 'cameray', -900,900).onChange(controls.updateCamy);
  var controlz = f1.add(controls, 'cameraz', -900,900).onChange(controls.updateCamz);
  f1.add(controls, 'cualcamera', {Perspective: 0, Ortographic: 1});
  
  var f2 = gui.addFolder('Colors');
  f2.addColor(controls, 'colormesh').onChange(controls.updateMat);
  f2.addColor(controls, 'colorlight').onChange(controls.updateLight);;
  
  var f3 = gui.addFolder('Point Light position');
  f3.add(controls, 'poslight_x', -900,900);
  f3.add(controls, 'poslight_y', -900,900);
  f3.add(controls, 'poslight_z', -900,900);
  
  
  
  
  f1.open();
  f2.open();
  f3.open();
  
  function render() { 
    
		mouseControls.update();
	  sun.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
		// Feedback of GUI with camera position set by TrackballControls
    if (controls.camerax_prev != camera.position.x){
		controls.camerax = camera.position.x;
		controls.camerax_prev = camera.position.x;
		controlx.updateDisplay();
	}
	if (controls.cameray_prev != camera.position.y){
		controls.cameray = camera.position.y;
		controls.cameray_prev = camera.position.y;
		controly.updateDisplay();
	}
	if (controls.cameraz_prev != camera.position.z){
		controls.cameraz = camera.position.z;
		controls.cameraz_prev = camera.position.z;
		controlz.updateDisplay();
	}
		
		// Animation loop
		requestAnimationFrame( render );
    if (controls.cualcamera == 0){
      camera.lookAt(scene.position);
      renderer.render( scene, camera );
    }
    else {
      camera2.lookAt(scene.position);
      renderer.render( scene, camera2 );
    }
		
  } 
  render();
  }
 