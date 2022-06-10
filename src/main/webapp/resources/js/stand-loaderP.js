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

    function clone3DText(userData) {
        let textValue = userData.textValue;
        let geometry1;
        let text;
        loaderText.load('../resources/helvetiker_regular.typeface.json', function (font) {

            geometry1 = new THREE.TextGeometry(textValue, {
                font: font,
                size: 0.1,
                height: 0.1,
            });


            text = new THREE.Mesh(geometry1, [
                new THREE.MeshPhongMaterial({color: 0xad4000}),
                new THREE.MeshPhongMaterial({color: 0x5c2301})
            ]);
            text.castShadow = true;
            text.material[0].color.set(userData.textColor);
            text.material[1].color.set("#111");
            text.position.set(userData.textPosition.x, userData.textPosition.y, userData.textPosition.z);
            text.rotation.set(userData.textRotation._x, userData.textRotation._y+1, userData.textRotation._z,userData.textRotation._order)
            text.scale.set(userData.textScale.x, userData.textScale.y, userData.textScale.z);
            scene.add(text);
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

    function getFileSity(settings) {
        return JSON.parse(settings);
    }
    let newScene = getFileSity(document.getElementById("scene").getAttribute("data"));
    for (let i = 0; i < newScene.children.length; i++) {
        scene.children[i] = new THREE.ObjectLoader().parse(newScene.children[i]);
        if(newScene.children[i].hasOwnProperty("geometries")){
            if(newScene.children[i].geometries[0].type === "TextGeometry") {
                clone3DText(newScene.children[i].object.userData);
            }
        }
    }
    addBackground(newScene.name[0]);
    addBackground(newScene.name[1]);
    setDistance(newScene.name[2]);
    addSound(newScene.name[3]);
}
loadScene();