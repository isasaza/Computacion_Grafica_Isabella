import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const backgroundColor = 0x0b0c10; // Dark background color
scene.background = new THREE.Color( backgroundColor );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
scene.add( ambientLight );

const light = new THREE.DirectionalLight( 0xffffff, 1.2 );
light.position.set( 5, 10, 7 );
scene.add( light );

// Definition of primitive shapes
const shapesData = [
    {
        name: 'Cube',
        geometry: new THREE.BoxGeometry( 1, 1, 1 ),
        color: 0x00ffff, 
        posX: -5
    },
    {
        name: 'Sphere',
        geometry: new THREE.SphereGeometry( 1, 32, 32 ),    
        color: 0x00e676,
        posX: -3    
    },
    {
        name: 'Cylinder',   
        geometry: new THREE.CylinderGeometry( 1, 1, 4, 32 ),
        color: 0xff9800,
        posX: 0
    },
    {
        name: 'Torus',
        geometry: new THREE.TorusGeometry( 1, 0.4, 16, 100 ),
        color: 0x9c27b0,
        posX: 3
    },
    {
        name: 'Cone',
        geometry: new THREE.ConeGeometry( 1, 4, 32 ),   
        color: 0xf44336,
        posX: 6
    }

];

const meshes = [];
let isWireframe = false;

// Generate meshes for each shape and add them to the scene
shapesData.forEach( ( shapeData ) => {
    const material = new THREE.MeshStandardMaterial( { color: shapeData.color, wireframe: isWireframe, roughness: 0.3, metalness: 0.2} );
    const mesh = new THREE.Mesh( shapeData.geometry, material );
    mesh.position.x = shapeData.posX;
    scene.add( mesh );
    meshes.push( mesh );
} );

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

const wireframeBtn = document.getElementById( 'wireframeBtn' );

wireframeBtn.addEventListener( 'click', () => {
    if ( isWireframe === false ) {
        isWireframe = true;
    } else {
        isWireframe = false;
    }

    meshes.forEach( ( mesh ) => {
        if ( isWireframe === true ) {
            mesh.material.wireframe = true;
        } else {
            mesh.material.wireframe = false;
        }
    } );

    if ( isWireframe === true ) {
        wireframeBtn.textContent = 'Wireframe: ON';
    } else {
        wireframeBtn.textContent = 'Wireframe: OFF';
    }
} );



function animate( time ) {
  meshes.forEach( ( mesh ) => {
    const speed = 0.0009;
    mesh.rotation.x = time * speed;
    mesh.rotation.y = time * speed;
  } );

  renderer.render( scene, camera );
  controls.update();
}
