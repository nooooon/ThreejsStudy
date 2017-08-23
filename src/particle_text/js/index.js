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
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    // this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -200, 500);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(this.scene.position);

    /* text */
    this.textCanvasWidth = 160;
    this.textCanvasHeight = 40;
    let textCanvas = document.createElement('canvas');
    let textCtx = textCanvas.getContext('2d');
    textCtx.font = '30px "Arial"';
    textCtx.fillStyle = '#ffffff';
    textCtx.textAlign = 'center';
    textCtx.fillText('Particles', this.textCanvasWidth / 2, 30);

    let textPixcelColors = textCtx.getImageData(0, 0, this.textCanvasWidth, this.textCanvasHeight).data;
    this.textPixcelList = [];

    for (let x = 0; x < this.textCanvasWidth; x++){
      this.textPixcelList[x] = [];
      for (let y = 0; y < this.textCanvasHeight; y++){
        this.textPixcelList[x][y] = (textPixcelColors[(x + y * this.textCanvasWidth) * 4 + 3] == 0);
      }
    }

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
    this.pGeometry.verticesNeedUpdate = true;
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

    let timeLine = new TimelineMax({
      onComplete: () => {
        console.log("timeLine onComplete");
      }
    });

    this.pGeometry = new THREE.Geometry();
    for (let x = 0; x < this.textCanvasWidth; x++){
      for (let y = 0; y < this.textCanvasHeight; y++){
        if(this.textPixcelList[x][y]){
          this.pGeometry.vertices.push(
            new THREE.Vector3(
              Math.random() * 400 - 200, 
              Math.random() * 400 - 200,
              Math.random() * 400 - 200
            )
          );
          timeLine.to(this.pGeometry.vertices[this.pGeometry.vertices.length - 1], 2.0, {x: x - this.textCanvasWidth/2, y: this.textCanvasHeight/2 - y, z: 0, ease: Back.easeOut.config(1.4)}, 1.0);
        }
      }
    }

    let pMaterial = new THREE.PointsMaterial({
      map: texture,
      size: 3, 
      blending: THREE.AdditiveBlending, 
      transparent: true, 
      depthTest: false
    });

   this.particles = new THREE.Points(this.pGeometry, pMaterial);

   this.scene.add(this.particles);

   this.update();
  }
}


(function(){
  const threeBase = new ThreeBase({container: document.getElementById('canvas')});

  threeBase.start();
  // threeBase.update();
})();