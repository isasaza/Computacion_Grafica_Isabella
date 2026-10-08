import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const backgroundColor = 0x0b0c10; // Dark background color
scene.background = new THREE.Color( backgroundColor );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
scene.add( ambientLight );

const pointLight = new THREE.PointLight( 0xffffff, 150, 100 );
pointLight.position.set( 0, 3, 10 );
scene.add( pointLight );

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, -1.5, 9 );
controls.update();

// Grid  Helper
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

// Axes Helper
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

function animate( time ) {
  renderer.render( scene, camera );
  controls.update();
}

// 2. Handle Responsive Resizing
function onWindowResize() {
  // Update camera aspect ratio based on the new container bounds
  camera.aspect = window.innerWidth / window.innerHeight;
  
  // Crucial: Update the projection matrix to apply changes
  camera.updateProjectionMatrix();

  // Update renderer size and pixel ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// 3. Listen for the resize event
window.addEventListener('resize', onWindowResize);

const objLoader = new OBJLoader();

const mtlLoader = new MTLLoader();
mtlLoader.load('../models/obj-mtl/BMO.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('../models/obj-mtl/BMO.obj', (root) => {
        scene.add(root);
    });
});