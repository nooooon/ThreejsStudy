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
    this.renderer.setClearColor(0xbb9966, 1);
    this.renderer.sortObjects = false;
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.resize();
    });

    window.addEventListener('keydown', (e) => {
      this.onKeydown(e)
    });

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
    // this.scene.background = new THREE.Color(0xffffff);
    this.scene.fog = new THREE.FogExp2( 0x999966, 0.01 );

    /* camera */
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(this.scene.position);

    /* light */
    let light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 3, 1 ).normalize();
    this.scene.add(light);

    let ambientLight = new THREE.AmbientLight(0x777777);
    this.scene.add(ambientLight);

    /* geometry */
    this.geometry = new THREE.PlaneGeometry(150, 150, 64, 64);
    this.geometry.computeFaceNormals();
    this.ground = new THREE.Mesh(this.geometry, new THREE.MeshPhongMaterial({color: 0xF99844, side: THREE.DoubleSide}));
    this.ground.rotation.x = Math.PI / -2;
    this.scene.add(this.ground);

    for (let i = 0; i < this.geometry.vertices.length; i++){
        let vertex = this.geometry.vertices[i];
        vertex.z = Math.random() * 30;
    }
  }

  update(){
    requestAnimationFrame(() => {
      this.update();
    });

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

}


(function(){
  const threeBase = new ThreeBase({container: document.getElementById('canvas')});

  threeBase.start();
  threeBase.update();
})();