import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const backgroundColor = 0x0b0c10; // Dark background color
scene.background = new THREE.Color( backgroundColor );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// Luces
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
scene.add( ambientLight );

const light = new THREE.DirectionalLight( 0xffffff, 1.2 );
light.position.set( 5, 10, 7 );
scene.add( light );

const pointLight = new THREE.PointLight( 0xffffff, 3, 0, 0 );
pointLight.position.set( 0, 2, 5 );   // de frente a los BMO
scene.add( pointLight );

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 2, 9 );
controls.update();

// Grid Helper
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

// Responsive resizing
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
}

window.addEventListener( 'resize', onWindowResize );

// ****************** OBJ + MTL (izquierda) ******************
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

mtlLoader.load( '../models/obj-mtl/BMO.mtl', ( mtl ) => {
    mtl.preload();
    objLoader.setMaterials( mtl );
    objLoader.load( '../models/obj-mtl/BMO.obj', ( root ) => {
        root.position.set( 2, 0, 3 );
        scene.add( root );
    });
});

// ****************** GLTF (derecha) ******************
const gltfLoader = new GLTFLoader();

gltfLoader.load( '../models/gltf/BMO.gltf', ( gltf ) => {
    const root = gltf.scene;
    root.position.set( 2, 0, -3 );
    scene.add( root );
});