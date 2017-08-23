/* index.js */
'use strict'

import Stats from './libs/stats.min.js';
import dat from './libs/dat.gui.min.js';

class ThreeBase{
  constructor(arg = {}){

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container = arg.container;

    /* renderer */
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    // this.renderer.setClearColor(0xeeee66, 1);
    this.renderer.setClearColor(0x000000, 1);
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

    /* camera */
    // this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -200, 500);
    this.camera.position.set(200, 300, 200);
    this.camera.lookAt(this.scene.position);

    /* particle image */
    let loader = new THREE.TextureLoader();
    loader.load('images/particle_A.png', (texture) => {
      this.createParticles(texture);
    });
  }

  update(){
    requestAnimationFrame(() => {
      this.update();
    });
    this.particles.rotation.x += this.controls.rotationX;
    this.particles.rotation.y += this.controls.rotationY;
    this.particles.rotation.z += this.controls.rotationZ;
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

  createParticles(texture){
    let pGeometry = new THREE.Geometry();
    for (let i = 0; i < 3000; i++) {
      pGeometry.vertices.push(
        new THREE.Vector3(
          Math.random() * 400 - 200, 
          Math.random() * 400 - 200,
          Math.random() * 400 - 200
        )
      );
    }

   let pMaterial = new THREE.PointsMaterial({
      map: texture,
      size: 5, 
      blending: THREE.AdditiveBlending, 
      transparent: true, 
      depthTest: false
    });

   this.particles = new THREE.Points(pGeometry, pMaterial);

   this.scene.add(this.particles);

  /* dat gui */
  const that = this;
  this.controls = new function(){
    this.rotationX = 0.01;
    this.rotationY = 0.0;
    this.rotationZ = 0.0;
  }
  this.gui = new dat.GUI({
    height : 5 * 32 - 1
  });
  this.gui.add(this.controls, 'rotationX', 0, 0.1).onChange(() => {
    // console.log(this.controls.rotationX);
  });
  this.gui.add(this.controls, 'rotationY', 0, 0.1);
  this.gui.add(this.controls, 'rotationZ', 0, 0.1);


   this.update();
  }
}


(function(){
  const threeBase = new ThreeBase({container: document.getElementById('canvas')});

  threeBase.start();
  // threeBase.update();
})();