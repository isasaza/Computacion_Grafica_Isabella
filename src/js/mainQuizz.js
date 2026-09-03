const escena = new THREE.Scene();

const camara = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.4,
  2000
);
camara.position.set(0, 25, 45);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("miCanvas"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);



const luzSol = new THREE.PointLight(0x8700ff, 2, 300);
escena.add(luzSol);
escena.add(new THREE.AmbientLight(0x333333));
 

const sol = new THREE.Mesh(
  new THREE.SphereGeometry(2.2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffcc33 })
);
sol.position.set(0, 0, 0);
escena.add(sol);
 

const listaPlanetas = [
  { nombre: "Mercurio", radio: 0.35, distancia: 4,  color: 0x9c9c9c, giro: 0.02,  orbita: 0.020 },
  { nombre: "Venus",    radio: 0.55, distancia: 6,  color: 0xe0b97d, giro: 0.015, orbita: 0.015 },
  { nombre: "Tierra",   radio: 0.58, distancia: 8,  color: 0x3d7dd8, giro: 0.03,  orbita: 0.012 },
  { nombre: "Marte",    radio: 0.42, distancia: 10, color: 0xc1440e, giro: 0.028, orbita: 0.010 },
  { nombre: "Jupiter",  radio: 1.4,  distancia: 13, color: 0xd8ae7e, giro: 0.05,  orbita: 0.006 },
  { nombre: "Saturno",  radio: 1.2,  distancia: 16, color: 0xe6d2a8, giro: 0.045, orbita: 0.005 },
  { nombre: "Urano",    radio: 0.9,  distancia: 19, color: 0x9fe3e6, giro: 0.035, orbita: 0.003 },
  { nombre: "Neptuno",  radio: 0.85, distancia: 22, color: 0x4169e1, giro: 0.035, orbita: 0.002 },
];
 
const planetas = [];
 
listaPlanetas.forEach((datos) => {
  const esfera = new THREE.Mesh(
    new THREE.SphereGeometry(datos.radio, 32, 32),
    new THREE.MeshStandardMaterial({ color: datos.color, roughness: 0.8 })
  );
  esfera.position.set(datos.distancia, 0, 0); 
  escena.add(esfera);
  planetas.push({ malla: esfera, ...datos, angulo: 0 });
});
 

const saturno = planetas.find((p) => p.nombre === "Saturno").malla;
 
const anilloSaturno = new THREE.Mesh(
  new THREE.RingGeometry(1.6, 2.6, 64),
  new THREE.MeshBasicMaterial({
    color: 0xcdbd93,
    side: THREE.DoubleSide,
    
    opacity: 0.8,
  })
);
anilloSaturno.rotation.x = Math.PI / 2; 
saturno.add(anilloSaturno); 
 

const urano = planetas.find((p) => p.nombre === "Urano").malla;
const anilloUrano = new THREE.Mesh(
  new THREE.RingGeometry(1.1, 1.4, 64),
  new THREE.MeshBasicMaterial({
    color: 0x9fd6d8,
    side: THREE.DoubleSide,
   
    opacity: 0.2,
  })
);
anilloUrano.rotation.x = Math.PI / 2;
anilloUrano.rotation.z = Math.PI / 8; 
urano.add(anilloUrano);
 

let clickeado = false;
let ultimoX = 0, ultimoY = 0;
let anguloX = 0.5, anguloY = 0, zoomCam = 45;
 
renderer.domElement.addEventListener("mousedown", (e) => {
  clickeado = true;
  ultimoX = e.clientX;
  ultimoY = e.clientY;
});
window.addEventListener("mouseup", () => (clickeado = false));
window.addEventListener("mousemove", (e) => {
  if (!clickeado) return;
  anguloY += (e.clientX - ultimoX) * 0.005;
  anguloX += (e.clientY - ultimoY) * 0.005;
  anguloX = Math.max(0.1, Math.min(2.2, anguloX));
  ultimoX = e.clientX;
  ultimoY = e.clientY;
});
renderer.domElement.addEventListener("wheel", (e) => {
  zoomCam = Math.max(10, Math.min(120, zoomCam + e.deltaY * 0.02));
});
 
function moverCamara() {
  camara.position.x = zoomCam * Math.sin(anguloX) * Math.sin(anguloY);
  camara.position.z = zoomCam * Math.sin(anguloX) * Math.cos(anguloY);
  camara.position.y = zoomCam * Math.cos(anguloX);
  camara.lookAt(0, 0, 0);
}
 

function animar() {
  requestAnimationFrame(animar);
 
  sol.rotation.y += 0.002;
 
  planetas.forEach((p) => {
    p.malla.rotation.y += p.giro; 
 
    p.angulo += p.orbita; 
    p.malla.position.x = p.distancia * Math.cos(p.angulo);
    p.malla.position.z = p.distancia * Math.sin(p.angulo);
  });
 
  moverCamara();
  renderer.render(escena, camara);
}
animar();
 

window.addEventListener("resize", () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
 