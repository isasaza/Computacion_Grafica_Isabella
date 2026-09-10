import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
 
// 1. ESCENA, CÁMARA Y RENDER
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a); // Noche azulada
 
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 12, 25);
 
const canvasElement = document.getElementById('miCanvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight - 56);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

 
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 10, 0);
controls.update();
 
// 2. ILUMINACIÓN Y PISO
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
 
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(15, 30, 20);
dirLight.castShadow = true;
scene.add(dirLight);
 
const floorGeo = new THREE.PlaneGeometry(40, 40);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);
 
// =========================================================
// TODO: CONSTRUIR LA RUEDA DE LA FORTUNA
// =========================================================

// En esta seccion, debes crear la rueda de la fortuna utilizando geometrías y materiales de Three.js. 
const numCabinas = 8;
const radioRueda = 6;
const cabinas = [];
 

// viga
function crearViga(x1, y1, x2, y2, grosor, color) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const longitud = Math.sqrt(dx * dx + dy * dy);
    const angulo = Math.atan2(dy, dx);
 
    const geo = new THREE.BoxGeometry(longitud, grosor, grosor);
    const mat = new THREE.MeshStandardMaterial({ color: color });
    const viga = new THREE.Mesh(geo, mat);
    viga.castShadow = true;
 
    viga.position.x = (x1 + x2) / 2;
    viga.position.y = (y1 + y2) / 2;
    viga.rotation.z = angulo;
 
    return viga;
}
 
// soporte fijo y eje central 
const alturaCentro = radioRueda + 3;
const separacionBase = 5;
const profundidadMarco = 4; 
 
const soporteGroup = new THREE.Group();
 
// patas de adelante
const pata1 = crearViga(-separacionBase, 0, 0, alturaCentro, 0.3, 0x475569);
pata1.position.z = profundidadMarco / 2;
const pata2 = crearViga(separacionBase, 0, 0, alturaCentro, 0.3, 0x475569);
pata2.position.z = profundidadMarco / 2;
 
//  patas de atras
const pata3 = crearViga(-separacionBase, 0, 0, alturaCentro, 0.3, 0x475569);
pata3.position.z = -profundidadMarco / 2;
const pata4 = crearViga(separacionBase, 0, 0, alturaCentro, 0.3, 0x475569);
pata4.position.z = -profundidadMarco / 2;
 
soporteGroup.add(pata1, pata2, pata3, pata4);
 
// eje horizontal centrado
const ejeGeo = new THREE.BoxGeometry(0.4, 0.4, profundidadMarco);
const ejeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
const eje = new THREE.Mesh(ejeGeo, ejeMat);
eje.position.set(0, alturaCentro, 0);
eje.castShadow = true;
soporteGroup.add(eje);
 
scene.add(soporteGroup);
 
// aro y radio
const wheelGroup = new THREE.Group();
wheelGroup.position.set(0, alturaCentro, 0);
scene.add(wheelGroup);
 
// aros (2)
const offsetAro = 1.1; 
const aroGeo = new THREE.TorusGeometry(radioRueda, 0.15, 12, 48);
const aroMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
 
const aroFrente = new THREE.Mesh(aroGeo, aroMat);
aroFrente.position.z = offsetAro;
aroFrente.castShadow = true;
wheelGroup.add(aroFrente);
 
const aroTrasero = new THREE.Mesh(aroGeo, aroMat);
aroTrasero.position.z = -offsetAro;
aroTrasero.castShadow = true;
wheelGroup.add(aroTrasero);
 
// radios 
for (let i = 0; i < numCabinas; i++) {
    const angulo = (i / numCabinas) * Math.PI * 2;
    const x2 = radioRueda * Math.cos(angulo);
    const y2 = radioRueda * Math.sin(angulo);
 
    const radioBarraFrente = crearViga(0, 0, x2, y2, 0.15, 0xcbd5e1);
    radioBarraFrente.position.z = offsetAro;
    wheelGroup.add(radioBarraFrente);
 
    const radioBarraTrasero = crearViga(0, 0, x2, y2, 0.15, 0xcbd5e1);
    radioBarraTrasero.position.z = -offsetAro;
    wheelGroup.add(radioBarraTrasero);
}
 
// casetas
const coloresCabina = [0xef476f, 0xffd166, 0x06d6a0, 0x118ab2, 0x9b5de5, 0xf15bb5, 0xfee440, 0x00bbf9];
 
for (let i = 0; i < numCabinas; i++) {
    const angulo = (i / numCabinas) * Math.PI * 2;
 
   
    const cabinaPivote = new THREE.Group();
    cabinaPivote.position.x = radioRueda * Math.cos(angulo);
    cabinaPivote.position.y = radioRueda * Math.sin(angulo);
    wheelGroup.add(cabinaPivote);
 
    
    const cestaGeo = new THREE.BoxGeometry(0.9, 0.9, offsetAro * 2 + 0.3);
    const cestaMat = new THREE.MeshStandardMaterial({
        color: coloresCabina[i % coloresCabina.length],
        roughness: 0.5,
    });
    const cesta = new THREE.Mesh(cestaGeo, cestaMat);
    cesta.position.y = -0.4;
    cesta.castShadow = true;
 
    cabinaPivote.add(cesta);
    cabinas.push(cabinaPivote); 
}

// Loop de Animación 
let velocidadGiro = 0.01;
 
function animate() {
    requestAnimationFrame(animate);
 
    wheelGroup.rotation.z += velocidadGiro;
 
    // codigo de rotación
    for (let i = 0; i < cabinas.length; i++) {
        cabinas[i].rotation.z = -wheelGroup.rotation.z;
    }
 
    controls.update();
    renderer.render(scene, camera);
}
 
animate();
 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
 