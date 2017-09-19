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

    window.addEventListener('resize', () => {
      this.resize();
    });

    window.addEventListener('keydown', (e) => {
      this.onKeydown(e)
    });

    WebFont.load({ 
      custom: {  
        families: [ 'Press Start 2P' ], 
        urls: [  
          'https://fonts.googleapis.com/css?family=Press+Start+2P' 
        ] 
      }, 
      loading: () => { 
        // ロードが開始されたとき 
        console.log('font loading');
      }, 
      active: () => { 
        // Web Fontが使用可能になったとき 
        console.log('font active');

        this.start();
      }, 
      inactive: () => { 
        // ブラウザがサポートしていないとき 
      }, 
      fontloading: (fontFamily, fontDescription) => { 
        // fontFamilyのロードが開始されたとき
        console.log('fontloading', fontFamily, fontDescription);
      }, 
      fontactive: (fontFamily, fontDescription) => { 
        // fontFamilyが使用可能になったとき
        console.log('fontactive', fontFamily, fontDescription);
      }, 
      fontinactive: (fontFamily, fontDescription) => { 
        // fontFamilyをブラウザがサポートしていないとき
        console.log('fontinactive');
      } 
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

    /* camera */
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.set(200, 300, 200);
    this.camera.lookAt(this.scene.position);

    /* light */
    let light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 ).normalize();
    this.scene.add( light );

    /* text */
    this.text = '0';
    this.material = new THREE.MeshBasicMaterial({
      map: this.createTexture(),
      side: THREE.DoubleSide,
      transparent: true,
    });
    
    let geometry = new THREE.PlaneGeometry(256, 256);

    let mesh = new THREE.Mesh(geometry, this.material);

    this.scene.add(mesh);

    this.update();
  }

  createTexture(){
    /* 2D canvas */
    this.textCanvasWidth = 256;
    this.textCanvasHeight = 256;
    let textCanvas = document.createElement('canvas');
    textCanvas.width = this.textCanvasWidth;
    textCanvas.height = this.textCanvasHeight;

    this.textCtx = textCanvas.getContext('2d');
    let texture = new THREE.Texture(textCanvas);
    texture.needsUpdate = true;

    return texture;
  }

  update(){
    requestAnimationFrame(() => {
      this.update();
    });

    this.renderer.render(this.scene, this.camera);
    this.scene.rotateY(0.005);
    this.text = Math.floor( Math.random() * 999999999 );

    let textCanvasWidth = 256;
    let textCanvasHeight = 256;
    this.textCtx.clearRect(0, 0, this.textCanvasWidth, this.textCanvasHeight);
    this.textCtx.fillStyle = 'rgba(0, 0, 0, 0.0)';
    this.textCtx.fillRect(0, 0, this.textCanvasWidth, this.textCanvasHeight);
    this.textCtx.font = '24px "Press Start 2P"';
    this.textCtx.fillStyle = '#ffffff';
    this.textCtx.textAlign = 'center';
    this.textCtx.fillText(this.text, this.textCanvasWidth / 2, this.textCanvasHeight / 2);
    this.material.map.needsUpdate = true;

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
})();