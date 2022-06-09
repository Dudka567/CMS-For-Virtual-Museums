import {OrbitControls} from './lib/OrbitControls.js'
import {GLTFLoader} from "./lib/GLTFLoader.js";

const idPointLight = "point-light";
const idAmbientLight = "ambient-light";
const idSpotLight = "spot-light";
const id3Model = "3D-model";
const id3Cube = "3D-cube";
const id3Sphere = "3D-sphere";
const id3Plane = "3D-plane";
const id3Text = "3D-text";
const DEFAULT_ADD_ID_NAME = "Object";

let scene;
let camera;
let renderer;
let container;

let object3Dgui;
let gui;

let controls;
let loaderGLTF;
let loaderText;
let loaderTextures;
let audioListener;
let audioLoader;
let sound;

let raycaster;
let clickMouse;

let sceneObjects;
let sceneCounter;
let deleteObjects;
let namesObjects;
let idObjectName;

let lastPickObject;
let temp;
let target;
let node;
let sceneProperties;

let result;
let settingsScene;
let nameScene;
let titleScene;
let idScene;

function initFields() {
    sceneProperties = new Array(4);
    sceneObjects = new Array(100);
    sceneCounter = 1;
    deleteObjects = 0;
    namesObjects = new Array(100);
    namesObjects[1] = null;
    lastPickObject = null;
    target = false;
    gui = null;
    sceneProperties[0] = "#bfbec3";
    sceneProperties[1] = "resources/";
    sceneProperties[2] = 5;
    sceneProperties[3] = "resources/";
    scene.name = sceneProperties;
}

function deleteHTML() {
    while (sceneCounter !== 1) {
        deleteObject(sceneCounter - 1, "Object" + (sceneCounter - 1));
    }
}



function init() {
    initScene();
    initCamera();
    initRender();
    initOrbitControls();
    initLoaders();
    initAddButtonListeners();
    initAddInputListenerScene();
    initSceneActionButtonListeners();
    initFields();
    deleteHTML();

    object3Dgui = {
        name: "",
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        color: "",
        intensity: 1,
        distance: 100
    };

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', event => {
        event.preventDefault();
        clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function onClickRaycaster() {
        raycaster.setFromCamera(clickMouse, camera);

        const found = raycaster.intersectObjects(scene.children, true);
        if (found.length > 0) {
            removeTemp();
            if (found[0].object.name !== 'temp') {
                if (lastPickObject !== found[0].object) {
                    closeChangeGUI();
                }
                lastPickObject = found[0].object;
                openChangeGUI();
            }
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (lastPickObject !== null && gui !== null) {

            if ("positionX" in object3Dgui && "positionY" in object3Dgui && "positionZ" in object3Dgui) {
                lastPickObject.position.set(object3Dgui.positionX, object3Dgui.positionY, object3Dgui.positionZ)
            }
            if ("rotationX" in object3Dgui && "rotationY" in object3Dgui && "rotationZ" in object3Dgui) {
                lastPickObject.rotation.set(object3Dgui.rotationX, object3Dgui.rotationY, object3Dgui.rotationZ);
            }
            if ("scaleX" in object3Dgui && "scaleY" in object3Dgui && "scaleZ" in object3Dgui) {
                lastPickObject.scale.set(object3Dgui.scaleX, object3Dgui.scaleY, object3Dgui.scaleZ);
            }
            if ("color" in object3Dgui) {
                if (lastPickObject.type === "Mesh") {
                    if (lastPickObject.geometry.type === "TextGeometry") {
                        lastPickObject.material[0].color.set(object3Dgui.color);
                        lastPickObject.material[1].color.set("#111");

                    } else if (lastPickObject.geometry.type === "SphereGeometry" || lastPickObject.geometry.type === "BoxGeometry" || lastPickObject.geometry.type === "PlaneGeometry") {
                        lastPickObject.material.color.set(object3Dgui.color);
                    }
                } else {
                    lastPickObject.color.set(object3Dgui.color);
                }
            }
            if ("intensity" in object3Dgui) {
                lastPickObject.intensity = object3Dgui.intensity;
            }
            if ("distance" in object3Dgui) {
                lastPickObject.distance = object3Dgui.distance;
            }
            if ("name" in object3Dgui) {
                changeName();
            }

        }
        onClickRaycaster();
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

function closeChangeGUI() {
    if (gui != null) {
        gui.destroy();
        gui = null;
    }
}

function changeName() {
    document.getElementById(lastPickObject.name + "H").innerHTML = object3Dgui.name;
}

function openChangeGUI() {
    if (gui === null) {
        gui = new dat.GUI();

        object3Dgui.name = document.getElementById(lastPickObject.name + "H").innerHTML;
        object3Dgui.positionX = lastPickObject.position.x;
        object3Dgui.positionY = lastPickObject.position.y;
        object3Dgui.positionZ = lastPickObject.position.z;
        object3Dgui.rotationX = lastPickObject.rotation.x;
        object3Dgui.rotationY = lastPickObject.rotation.y;
        object3Dgui.rotationZ = lastPickObject.rotation.z;

        gui.add(object3Dgui, 'name');
        gui.add(object3Dgui, 'positionX').min(-30).max(30).step(0.0001);
        gui.add(object3Dgui, 'positionY').min(-30).max(30).step(0.0001);
        gui.add(object3Dgui, 'positionZ').min(-30).max(30).step(0.0001);
        gui.add(object3Dgui, 'rotationX').min(-4).max(4).step(0.001);
        gui.add(object3Dgui, 'rotationY').min(-4).max(4).step(0.001);
        gui.add(object3Dgui, 'rotationZ').min(-4).max(4).step(0.001);
        addAttributesLastPickObject();

    }
}

function addScaleGUI() {
    object3Dgui.scaleX = lastPickObject.scale.x;
    object3Dgui.scaleY = lastPickObject.scale.y;
    object3Dgui.scaleZ = lastPickObject.scale.z;
    gui.add(object3Dgui, 'scaleX').min(0.1).max(10.0).step(0.001);
    gui.add(object3Dgui, 'scaleY').min(0.1).max(10.0).step(0.001);
    gui.add(object3Dgui, 'scaleZ').min(0.1).max(10.0).step(0.001);
}

function addAttributesLastPickObject() {
    if (lastPickObject.type === "PointLight") {
        object3Dgui.color = "#" + lastPickObject.color.getHexString();
        object3Dgui.intensity = lastPickObject.intensity;
        object3Dgui.distance = lastPickObject.distance;
        gui.add(object3Dgui, 'color');
        gui.add(object3Dgui, 'intensity').min(1).max(10).step(1);
        gui.add(object3Dgui, 'distance').min(1).max(300).step(1);
    } else if (lastPickObject.type === "AmbientLight" || lastPickObject.type === "SpotLight" || lastPickObject.type === "PointLight") {
        object3Dgui.color = "#" + lastPickObject.color.getHexString();
        gui.add(object3Dgui, 'color');
    } else if (lastPickObject.geometry.type === "BufferGeometry") {
        addScaleGUI();
    } else if (lastPickObject.geometry.type === "TextGeometry") {
        object3Dgui.color = "#" + lastPickObject.material[0].color.getHexString();
        gui.add(object3Dgui, 'color');
        addScaleGUI();
    } else if (lastPickObject.geometry.type === "SphereGeometry" || lastPickObject.geometry.type === "BoxGeometry" || lastPickObject.geometry.type === "PlaneGeometry") {
        object3Dgui.color = "#" + lastPickObject.material.color.getHexString();
        gui.add(object3Dgui, 'color');
        addScaleGUI();
    }
}

function addPointLight() {
    let pointLight = new THREE.PointLight(0x2fa1d6, 1, 100);
    pointLight.position.set(0, 1, 0);
    preCreate();
    pointLight.name = idObjectName;
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 4096;
    pointLight.shadow.mapSize.height = 4096;

    sceneObjects[sceneCounter] = pointLight;
    scene.add(pointLight);
    createLi();
}

function addAmbientLight() {
    let ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.position.set(10, 10, 10);
    preCreate();
    ambientLight.name = idObjectName;

    sceneObjects[sceneCounter] = ambientLight;
    scene.add(ambientLight);
    createLi();
}

function addSpotLight() {
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(3, 3, 3);
    preCreate();
    spotLight.name = idObjectName;

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    sceneObjects[sceneCounter] = spotLight;
    scene.add(spotLight);
    createLi();
}

function add3DModel() {
    let pathGLTF = prompt('Enter the path to the file .gltf', 'resources/RomeAbak/RomeAbak.gltf');
    let modelObject;
    loaderGLTF.load(pathGLTF, gltf => {
            modelObject = gltf.scene;
            modelObject.position.set(0, 0, 0);
            preCreate();
            modelObject.children[0].name = idObjectName;
            modelObject.name = idObjectName;
            sceneObjects[sceneCounter] = modelObject.children[0];
            scene.add(modelObject);
            createLi();
        },
        function (error) {
            console.log('Error: ' + error)
        }
    );
}

function addSelectMesh(targetObject, typeGeometry) {
    let geometry;
    if (typeGeometry === "SphereGeometry") {
        geometry = new THREE.SphereGeometry(targetObject.radius);
    } else if (typeGeometry === "BoxGeometry") {
        geometry = new THREE.BoxGeometry(targetObject.width, targetObject.height);
    } else if (typeGeometry === "PlaneGeometry") {
        geometry = new THREE.PlaneGeometry(targetObject.width, targetObject.height);
    }

    let material = new THREE.MeshBasicMaterial({color: 0xffffff});
    return new THREE.Mesh(geometry, material);
}

function addMesh(typeGeometry) {
    let geometry = typeGeometry;
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    return new THREE.Mesh(geometry, material);

}

function updateDelete(numberObject) {
    deleteObjects = 0;
    for (let i = 1; i <= numberObject; i++) {
        if (namesObjects[i] === null) {
            deleteObjects++;
        }
    }
}

function preCreate() {
    for (let i = 1; i <= sceneCounter; i++) {
        if (namesObjects.indexOf(DEFAULT_ADD_ID_NAME + i) <= -1) {
            idObjectName = DEFAULT_ADD_ID_NAME + i;
            namesObjects[i] = idObjectName;
            break;
        }

    }
    if (deleteObjects === sceneCounter) {
        deleteObjects = 0;
    }

}

function createLi() {
    let ul = document.getElementById("objects");
    let li = document.createElement("li");

    node = document.createElement("h5");
    node.innerHTML = idObjectName;
    node.id = idObjectName + "H";
    li.appendChild(node);
    li.setAttribute("id", idObjectName);
    li.className = 'object-point';

    let selectButton = document.createElement("button");
    let changeButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    selectButton.id = idObjectName + 's';
    changeButton.id = idObjectName + 'c';
    deleteButton.id = idObjectName + 'd';

    selectButton.className = 'object-action';
    changeButton.className = 'object-action';
    deleteButton.className = 'object-action';

    selectButton.innerHTML = 'select';
    changeButton.innerHTML = 'change';
    deleteButton.innerHTML = 'delete';

    selectButton.setAttribute('style', "margin-left:20px;background-color: #32c3b6;color: rgb(255, 255, 255);font-size: 14px;font-family: Montserrat-Regular;font-weight:200;letter-spacing: 1px;border-radius:10px;border-color:#32c3b6;height:35px;width:70px;");
    changeButton.setAttribute('style', "margin-left:20px;background-color: #32c3b6;color: rgb(255, 255, 255);font-size: 14px;font-family: Montserrat-Regular;font-weight:200;letter-spacing: 1px;border-radius:10px;border-color:#32c3b6;height:35px;width:70px;");
    deleteButton.setAttribute('style', "margin-left:20px;background-color: #32c3b6;color: rgb(255, 255, 255);font-size: 14px;font-family: Montserrat-Regular;font-weight:200;letter-spacing: 1px;border-radius:10px;border-color:#32c3b6;height:35px;width:70px;");

    selectButton.setAttribute('onmouseover', "this.style.backgroundColor='#37d4c6';");
    changeButton.setAttribute('onmouseover', "this.style.backgroundColor='#37d4c6';");
    deleteButton.setAttribute('onmouseover', "this.style.backgroundColor='#37d4c6';");

    selectButton.setAttribute('onmouseout', "this.style.backgroundColor='#32c3b6';");
    changeButton.setAttribute('onmouseout', "this.style.backgroundColor='#32c3b6';");
    deleteButton.setAttribute('onmouseout', "this.style.backgroundColor='#32c3b6';");

    li.appendChild(selectButton);
    li.appendChild(changeButton);
    li.appendChild(deleteButton);
    let beforeElemCount = 1 + parseInt(idObjectName.substring(6, idObjectName.length));
    let beforeElem = document.getElementById("Object" + beforeElemCount);
    ul.insertBefore(li, beforeElem);
    sceneCounter++;
}

function add3DCube() {
    let cube = addMesh(new THREE.BoxGeometry());
    cube.position.set(0, 0, 0);
    preCreate();
    cube.name = idObjectName;
    sceneObjects[sceneCounter] = cube;
    scene.add(cube);
    createLi();
}

function add3DSphere() {
    let sphere = addMesh(new THREE.SphereGeometry());
    sphere.position.set(0, 0, 0);
    preCreate();
    sphere.name = idObjectName;
    sceneObjects[sceneCounter] = sphere;
    scene.add(sphere);
    createLi();
}

function add3DPlane() {
    let plane = addMesh(new THREE.PlaneGeometry());
    plane.position.set(0, 0, 0);
    preCreate();
    plane.name = idObjectName;
    sceneObjects[sceneCounter] = plane;
    scene.add(plane);
    createLi();
}

function add3DText() {
    let textValue = prompt("Enter the text", 'default 3D text');
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
        text.position.set(0, 0, 0);
        preCreate();
        text.name = idObjectName;
        sceneObjects[sceneCounter] = text;
        scene.add(text);
        createLi();

    });
}

function addBackground(pathImageOrColor) {
    if (pathImageOrColor.charAt(0) === '#') {
        scene.background = new THREE.Color(pathImageOrColor);
        sceneProperties[0] = '#'+scene.background.getHexString();
    } else {
        loaderTextures.load(pathImageOrColor, function (texture) {
            scene.background = texture;
            sceneProperties[1] = pathImageOrColor;
        });
    }
}


function addSound(pathSound) {
    sceneProperties[3] = pathSound;
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

function initScene() {
    container = document.querySelector('.container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#bfbec3");
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 0;
    camera.position.y = 0;
    camera.position.x = 0;
}

function initRender() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#bfbec3");
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
}

function initOrbitControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true;
    controls.minDistance = 5;
}

function initLoaders() {
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    audioLoader = new THREE.AudioLoader();
    loaderTextures = new THREE.TextureLoader();
    loaderText = new THREE.FontLoader();
    loaderGLTF = new GLTFLoader();
    raycaster = new THREE.Raycaster();
    clickMouse = new THREE.Vector2();
}

function addSelectLight(type) {
    return type === "AmbientLight" || type === "SpotLight" || type === "PointLight";
}

function selectObject(objectName) {
    for (let i = 1; i <= sceneCounter; i++) {
        if (sceneObjects[i].name === objectName) {
            closeChangeGUI();
            lastPickObject = sceneObjects[i];
            if (!target) {
                if (addSelectLight(sceneObjects[i].type)) {
                    let geometry = new THREE.BoxGeometry();
                    let material = new THREE.MeshBasicMaterial({color: 0xffffff});
                    temp = new THREE.Mesh(geometry, material);
                } else {
                    temp = addSelectMesh(sceneObjects[i], sceneObjects[i].geometry.type);
                }
                temp.name = "temp";
                temp.position.set(sceneObjects[i].position.x, sceneObjects[i].position.y, sceneObjects[i].position.z);
                temp.scale.set(1.2, 1.2, 1.2);
                temp.material.transparent = true;
                temp.material.opacity = 0.2;
                scene.add(temp);
                target = true;
            }

            controls.target.copy(sceneObjects[i].position);
            camera.position.set(sceneObjects[i].position.x, sceneObjects[i].position.y, sceneObjects[i].position.z + 5);
            break;
        }
    }
}

function changeObject(objectName) {
    for (let i = 1; i <= sceneCounter; i++) {
        if (sceneObjects[i].name === objectName) {
            if (sceneObjects[i] !== lastPickObject) {
                closeChangeGUI();
            }
            lastPickObject = sceneObjects[i];
            openChangeGUI();

            controls.target.copy(sceneObjects[i].position);
            camera.position.set(sceneObjects[i].position.x, sceneObjects[i].position.y, sceneObjects[i].position.z + 5);
            break;
        }
    }
}

function deleteObject(numberObject, objectName) {
    closeChangeGUI();
    updateDelete(numberObject);
    let li = document.getElementsByClassName('object-point');
    namesObjects[numberObject] = null;
    li[numberObject - deleteObjects].parentNode.removeChild(li[numberObject - deleteObjects]);
    scene.remove(scene.getObjectByName(objectName));
    sceneObjects[numberObject] = null;
    sceneCounter--;
}

function initObjectButtonListeners() {
    let elementsObjects = document.querySelectorAll('.object-action');
    [].forEach.call(elementsObjects, function (el) {
        el.onclick = function () {
            if (el.id.charAt(el.id.length - 1) === 's') {
                removeTemp();
                selectObject(el.id.substring(0, el.id.length - 1));
            } else if (el.id.charAt(el.id.length - 1) === 'c') {
                removeTemp();
                changeObject(el.id.substring(0, el.id.length - 1));
            } else if (el.id.charAt(el.id.length - 1) === 'd') {
                removeTemp();
                deleteObject(el.id.substring(6, el.id.length - 1), el.id.substring(0, el.id.length - 1));
            }

        }
    });
}

function removeTemp() {
    if (target) {
        scene.remove(scene.getObjectByName("temp"));
        target = false;
        temp = null;
    }
}

function initAddInputListenerScene() {
    let elements = document.getElementsByTagName("input");
    elements[0].onchange = function () {
        addBackground(elements[0].value);
    }
    elements[1].onchange = function () {
        addBackground(elements[1].value);
    }
    elements[2].onchange = function () {
        setDistance(elements[2].value);
    }
    elements[3].onchange = function () {
        addSound(elements[3].value);
    }

}


function setDistance(value) {
    sceneProperties[2] = value;
    controls.minDistance = value;
}

function post(path, params, method='post'){

    const form = document.createElement('form');
    form.method = method;
    form.action = path;
    form.enctype = "multipart/form-data";

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function initSceneActionButtonListeners() {
    document.getElementById("newScene").onclick = function () {
        let sceneSetting = document.getElementsByTagName("input");
        deleteHTML();
        initFields();
        sceneSetting[0].value = "#bfbec3";
        addBackground(sceneSetting[0].value);
        sceneSetting[1].value = "resources/";
        addBackground(sceneSetting[1].value);
        sceneSetting[2].value = "5";
        setDistance(sceneSetting[2].value);
        sceneSetting[3].value = "resources/";

    }

    document.getElementById("deleteScene").onclick = function () {
        if(document.getElementById("objects").getAttribute('data') !== "NewScene"){
            notNewPost('/deleteScene');
        }
    }

    document.getElementById("saveScene").onclick = function () {
        if(document.getElementById("objects").getAttribute('data') === "NewScene"){
            // saveJSON();
            let saveScene = new Object();
            saveScene.name = scene.name;
            saveScene.children = scene.children[0].toJSON();
            let sceneJSON = JSON.stringify(saveScene);
            // console.log(scene.children[0].toJSON());


            settingsScene = sceneJSON;
            let nameScene = prompt("Enter the name scene", "");
            let titleScene = prompt("Enter the path file image", "resources/img/.png");
            post('/addScene',{id : 1,settings: settingsScene,name: nameScene, title: titleScene});

            // let saveScene = new Object();
            // saveScene.name = scene.name;
            // saveScene.children = scene.children;
            // let sceneJSON = JSON.stringify(saveScene);
            // console.log(sceneJSON);
        }
        else{
            notNewPost('/updateScene');
        }

    }

}

function notNewPost(url){
    saveJSON();
    nameScene = document.getElementById("objects").getAttribute('data');
    titleScene = document.getElementById("saveScene").getAttribute('data');
    idScene = document.getElementById("points").getAttribute('data');
    post(url,{id : idScene,settings: settingsScene,name: nameScene, title: titleScene});
}

function saveJSON(){
    scene.updateMatrixWorld();
    let saveScene = new Object();
    saveScene.name = scene.name;
    saveScene.children = scene.children;
    settingsScene = JSON.stringify(saveScene);
    // result = scene.toJSON();
    // settingsScene = JSON.stringify(result);
}

function loadScene(){
        let sceneSetting = document.getElementsByTagName("input");
        function getFileSity(settings) {
            console.log(settings);
            return JSON.parse(settings);
        }
        let newScene = getFileSity( document.getElementById("newScene").getAttribute('data'));
        scene = new THREE.ObjectLoader().parse(newScene);

        let newSceneObjects = scene.children;

        for (let i = 0; i < newSceneObjects.length; i++) {
            preCreate();
            sceneObjects[sceneCounter] = newSceneObjects[i];
            createLi();
        }
        addBackground(scene.name[0]);
        sceneSetting[0].value = scene.name[0];
        addBackground(scene.name[1]);
        sceneSetting[1].value = scene.name[1];
        setDistance(scene.name[2]);
        sceneSetting[2].value = scene.name[2];
        addSound(scene.name[3]);
        sceneSetting[3].value = scene.name[3];
}

function initAddButtonListeners() {
    let elements = document.querySelectorAll('.add-button');
    [].forEach.call(elements, function (el) {
        el.onclick = function () {
            if (el.id === idPointLight) {
                addPointLight();
                initObjectButtonListeners()
            } else if (el.id === idAmbientLight) {
                addAmbientLight();
                initObjectButtonListeners()
            } else if (el.id === idSpotLight) {
                addSpotLight();
                initObjectButtonListeners()
            } else if (el.id === id3Model) {
                add3DModel();
                initObjectButtonListeners()
            } else if (el.id === id3Cube) {
                add3DCube();
                initObjectButtonListeners()
            } else if (el.id === id3Sphere) {
                add3DSphere();
                initObjectButtonListeners()
            } else if (el.id === id3Plane) {
                add3DPlane();
                initObjectButtonListeners()
            } else if (el.id === id3Text) {
                add3DText();
                initObjectButtonListeners()
            }
        }
    });
}

init();
loadScene();