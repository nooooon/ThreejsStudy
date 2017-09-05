/* index.js */
'use strict'

import Stats from 'libs/stats.min.js';
import dat from 'libs/dat.gui.min.js';

class ThreeBase{
  constructor(arg = {}){

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container = arg.container;

    /* renderer */
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.sortObjects = false;
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.container.appendChild(this.renderer.domElement);

    this.mouse = new THREE.Vector2();
    this.INTERSECTED;

    window.addEventListener('resize', () => {
      this.resize();
    });

    window.addEventListener('keydown', (e) => {
      this.onKeydown(e)
    });

    // document.addEventListener('mousemove', () => {
    //   // onDocumentMouseMove, false
    // });

    document.addEventListener( 'mousemove', (e) => {this.onDocumentMouseMove(e)}, false );

    /* stats */
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.style.zIndex = 100;
    document.body.appendChild(this.stats.domElement);
  }

  start(){
    /* scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    /* camera */
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.set(200, 300, 200);
    this.camera.lookAt(this.scene.position);

    /* light */
    let light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 ).normalize();
    this.scene.add( light );

    /* cubes */
    let geometry = new THREE.BoxBufferGeometry(8, 8, 8);
    for(let i = 0; i < 1000; i ++){
      let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0x666600 } ) );
        object.position.x = Math.random() * 400 - 200;
        object.position.y = Math.random() * 400 - 200;
        object.position.z = Math.random() * 400 - 200;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        this.scene.add(object);
    }

    this.raycaster = new THREE.Raycaster();
  }

  update(){
    requestAnimationFrame(() => {
      this.update();
    });

    this.raycaster.setFromCamera(this.mouse, this.camera);

    let intersects = this.raycaster.intersectObjects(this.scene.children);
    if(intersects.length > 0){
      if(this.INTERSECTED != intersects[0].object){
        if(this.INTERSECTED){
          this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
        }
        this.INTERSECTED = intersects[0].object;
        this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
        this.INTERSECTED.material.emissive.setHex(0xff0000);

        TweenLite.to(intersects[0].object.scale, 0.5, {x: 4, y: 4, z: 4, onComplete: () => {
          TweenLite.to(intersects[0].object.scale, 1, {x: 1, y: 1, z: 1});
        }});
        TweenLite.to(intersects[0].object.rotation, 0.2, {x: intersects[0].object.rotation.x + 5});
      }
    }else{
      if(this.INTERSECTED){
        this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
      }
      this.INTERSECTED = null;
    }

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  stop(){
    cancelAnimationFrame(this.update());
  }

  resize(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  onKeydown(e){
    console.log(e.key);
  }

  onDocumentMouseMove(e){
    e.preventDefault();
    
    this.mouse.x = ( e.clientX / this.width ) * 2 - 1;
    this.mouse.y = - ( e.clientY / this.height ) * 2 + 1;
  }
}


(function(){
  const threeBase = new ThreeBase({container: document.getElementById('canvas')});

  threeBase.start();
  threeBase.update();
})();