import {OrbitControls} from './lib/OrbitControls.js'
import {GLTFLoader} from "./lib/GLTFLoader.js";

let scene;
let camera;
let renderer;
let container;
let controls;

let loaderGLTF;
let loaderText;
let loaderTextures;
let audioListener;
let audioLoader;
let sound;

function loadScene() {
    container = document.querySelector('.container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#474B4F");

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 0;
    camera.position.y = 0;
    camera.position.x = 0;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#474B4F");
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true;
    controls.minDistance = 5;

    audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    audioLoader = new THREE.AudioLoader();
    loaderTextures = new THREE.TextureLoader();
    loaderText = new THREE.FontLoader();
    loaderGLTF = new GLTFLoader();

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    function addSound(pathSound) {
        if (pathSound === "") {
            sound.disconnect();
        }
        sound = new THREE.Audio(audioListener);
        audioLoader.load(pathSound, function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            sound.play();
        });
    }

    function setDistance(value) {
        controls.minDistance = value;
    }

    function addBackground(pathImageOrColor) {
        if (pathImageOrColor.charAt(0) === '#') {
            scene.background = new THREE.Color(pathImageOrColor);
        } else {
            loaderTextures.load(pathImageOrColor, function (texture) {
                scene.background = texture;
            });
        }
    }

    function getFileSity(fileName) {
        let request = new XMLHttpRequest();
        request.open('GET', fileName, false);
        request.send(null);
        return JSON.parse(request.responseText);
    }
    let newScene = getFileSity(document.getElementById("scene").getAttribute("datasrc"));
    scene = new THREE.ObjectLoader().parse(newScene);
    addBackground(scene.name[0]);
    addBackground(scene.name[1]);
    setDistance(scene.name[2]);
    addSound(scene.name[3]);
}
loadScene();