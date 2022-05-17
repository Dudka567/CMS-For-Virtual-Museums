import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";

const idPointLight = "point-light";
const idAmbientLight = "ambient-light";
const idSpotLight = "spot-light";
const id3Model = "3D-model";
const id3Cube = "3D-cube";
const id3Sphere = "3D-sphere";
const id3Plane = "3D-plane";
const id3Text = "3D-text";

const idBack = "set-background";
const idSound = "set-music";

let scene;
let camera;
let renderer;
let container;

let object3Dgui; // класс свойств 3D обьекта
let gui = null; // отображение изменения своиств

let controls; // для перемещения по сцене
let loaderGLTF; // загрузка 3D моделей
let loaderText;
let loaderTextures;
let audioListener;
let audioLoader;

let raycaster;
let clickMouse;

let sceneObjects = new Array(100);
let sceneCounter = 0;
let lastPickObject = null;

function init() {
    initScene();
    initCamera();
    initRender();
    initOrbitControls();
    initLoaders();

    object3Dgui = {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1
    };

    // let romeAbak;
    // loaderGLTF.load('../resources/RomeAbak/RomeAbak.gltf', gltf => {
    //         romeAbak = gltf.scene;
    //         scene.add(romeAbak);
    //
    //         sceneObjects[sceneCounter] = romeAbak.children[0];
    //         sceneCounter++;
    //         console.log(sceneObjects);
    //     },
    //     function (error) {
    //         console.log('Error: ' + error)
    //     }
    // );


//Обработка кнопок, добавление событий на кнопки
    let elements = document.querySelectorAll('.add-button');
//перебираем все найденные элементы и вешаем на них события
    [].forEach.call(elements, function (el) {
        //вешаем событие
        el.onclick = function (e) {
            if (el.id === idPointLight) {
                addPointLight();
            } else if (el.id === idAmbientLight) {
                addAmbientLight();
            } else if (el.id === idSpotLight) {
                addSpotLight();
            } else if (el.id === id3Model) {
                add3DModel();
            } else if (el.id === id3Cube) {
                add3DCube();
            } else if (el.id === id3Sphere) {
                add3DSphere();
            } else if (el.id === id3Plane) {
                add3DPlane();
            } else if (el.id === id3Text) {
                //document.getElementsByTagName("input")[1].value
                add3DText();
            }
        }
    });

    //EventListeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', event => {
        event.preventDefault();
        clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function setOpacity(newObject) {
        lastPickObject = newObject;
        lastPickObject.material.transparent = true;
        lastPickObject.material.opacity = 0.5;
    }

    function backOpacity() {
        lastPickObject.material.opacity = 1.0;
    }

    function onClickRaycaster() {
        raycaster.setFromCamera(clickMouse, camera);

        const found = raycaster.intersectObjects(scene.children, true);
        if (found.length > 0) { //Если кликнули не в пустоту
            if (lastPickObject == null) {
                setOpacity(found[0].object);
            } else {
                if (found[0].object !== lastPickObject) {
                    backOpacity();
                    setOpacity(found[0].object);
                }
            }
            if (gui == null) {
                gui = new dat.GUI();
                if (lastPickObject.type === 'Mesh') {
                    gui.add(object3Dgui, 'rotationX').min(-4).max(4).step(0.001);
                    gui.add(object3Dgui, 'rotationY').min(-4).max(4).step(0.001);
                    gui.add(object3Dgui, 'rotationZ').min(-4).max(4).step(0.001);
                    gui.add(object3Dgui, 'positionX').min(-20).max(20).step(0.001);
                    gui.add(object3Dgui, 'positionY').min(-20).max(20).step(0.001);
                    gui.add(object3Dgui, 'positionZ').min(-20).max(20).step(0.001);
                    gui.add(object3Dgui, 'scaleX').min(0.1).max(4.0).step(0.001);
                    gui.add(object3Dgui, 'scaleY').min(0.1).max(4.0).step(0.001);
                    gui.add(object3Dgui, 'scaleZ').min(0.1).max(4.0).step(0.001);
                }
            }
            console.log(found[0].object);
            // if (found[0].object.userData.name == "RomeAbak")
        } else { //если кликнули в пустоту, то снять выделение со всех обьектов
            if (lastPickObject != null) {
                backOpacity()
            }
            if (gui != null) {
                gui.destroy();
                gui = null;
            }
            console.log(found[0]);
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //UpdateFrame
    function animate() {
        requestAnimationFrame(animate);
        // romeAbak.position.set(object3Dgui.positionX, object3Dgui.positionY, object3Dgui.positionZ);
        // romeAbak.rotation.set(object3Dgui.rotationX, object3Dgui.rotationY, object3Dgui.rotationZ);
        // romeAbak.scale.set(object3Dgui.scaleX, object3Dgui.scaleY, object3Dgui.scaleZ);

        onClickRaycaster();
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

//Функции добавления
function addPointLight() {
    let pointLight = new THREE.PointLight(0x2fa1d6, 1, 100);
    pointLight.position.set(0, 1, 0);
    pointLight.name = 'PointLight';
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 4096;
    pointLight.shadow.mapSize.height = 4096;

    sceneObjects[sceneCounter] = pointLight;
    sceneCounter++;
    console.log(sceneObjects);
    scene.add(pointLight);
}

function addAmbientLight() {
    let ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.position.set(10, 10, 10);
    ambientLight.name = 'AmbientLight';

    sceneObjects[sceneCounter] = ambientLight;
    sceneCounter++;
    console.log(sceneObjects);
    scene.add(ambientLight);
}

function addSpotLight() {
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(3, 3, 3);
    spotLight.name = 'SpotLight';

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    sceneObjects[sceneCounter] = spotLight;
    console.log(sceneObjects);
    sceneCounter++;
    scene.add(spotLight);
}

function add3DModel() {
    console.log(pathGLTF);
    let romeAbak1;
    loaderGLTF.load(pathGLTF, gltf => {
            romeAbak1 = gltf.scene;
            romeAbak1.position.set(0, 0, 0);
            scene.add(romeAbak1);
            romeAbak1.children[0].name = '3DModel'

            sceneObjects[sceneCounter] = romeAbak1.children[0];
            sceneCounter++;
            console.log(sceneObjects);
        },
        function (error) {
            console.log('Error: ' + error)
        }
    );
}

function addMesh(typeGeometry) {
    let geometry = typeGeometry;
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    return new THREE.Mesh(geometry, material);

}

function add3DCube() {
    let cube = addMesh(new THREE.BoxGeometry());
    cube.position.set(0, 0, 0);
    cube.name = 'Cube';
    sceneObjects[sceneCounter] = cube;
    sceneCounter++;
    scene.add(cube);
    console.log(sceneObjects);
}

function add3DSphere() {
    let sphere = addMesh(new THREE.SphereGeometry());
    sphere.position.set(0, 0, 0);
    sphere.name = 'Sphere';
    sceneObjects[sceneCounter] = sphere;
    sceneCounter++;
    scene.add(sphere);
    console.log(sceneObjects);
}

function add3DPlane() {
    let plane = addMesh(new THREE.PlaneGeometry());
    plane.position.set(0, 0, 0);
    plane.name = 'Plane';
    sceneObjects[sceneCounter] = plane;
    sceneCounter++;
    scene.add(plane);
    console.log(sceneObjects);
}

function add3DText() {
    let geometry1;
    let text;
    loaderText.load('./three.js-master/examples/fonts/helvetiker_regular.typeface.json', function (font) {

        geometry1 = new THREE.TextGeometry(textUser, {
            font: font,
            size: 0.1,
            height: 0.1,
        });

        text = new THREE.Mesh(geometry1, [
            new THREE.MeshPhongMaterial({color: 0xad4000}),
            new THREE.MeshPhongMaterial({color: 0x5c2301})
        ]);

        text.castShadow = true;
        text.position.set(0, 0, 0);
        text.name = 'Text';

        sceneObjects[sceneCounter] = text;
        sceneCounter++;
        console.log(sceneObjects);
        scene.add(text);
    });
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

function addSound(pathSound) {
    let sound = new THREE.Audio(audioListener);//./three.js-master/examples/sounds/358232_j_s_song.ogg
    audioLoader.load(pathSound, function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });
}

function initScene() {
    container = document.querySelector('.container');
    // Scene
    scene = new THREE.Scene();
}

function initCamera() {
    //Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 0;
    camera.position.y = 0;
    camera.position.x = 0;
}

function initRender() {
    //render
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
}

function initOrbitControls() {
    //OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true;
    controls.minDistance = 5;
}

function initLoaders() {
    // Sound
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    audioLoader = new THREE.AudioLoader();
    //Texture Loader
    loaderTextures = new THREE.TextureLoader();
    //3D Text
    loaderText = new THREE.FontLoader();
    //GLTFLoader
    loaderGLTF = new GLTFLoader();
    //Raycaster
    raycaster = new THREE.Raycaster();
    clickMouse = new THREE.Vector2();
}

init();
