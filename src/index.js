import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
// import { Postprocessing } from './shaders/postProcessing'

import vertex from './shaders/vertex'
import lightvert from './shaders/lightvert'
import fragment from './shaders/fragment'
import lightfrag from './shaders/lightfrag'

import cubes from './images/3D-objects/creativeStudio.obj'
import butterfly from './images/3D-objects/al.obj'
import shark from './images/3D-objects/Bigmax_White_OBJ.obj'
import lego from './images/3D-objects/lego.obj'
import icosas from './images/3D-objects/icosas.obj'




import whiteMat from './images/matcaps/white.png';
import blackMat from './images/matcaps/black2.png';
import black2Mat from './images/matcaps/black3.png';
import greenMat from './images/matcaps/green.png';
import orangeMat from './images/matcaps/orange.png';
import yellowMat from './images/matcaps/yellow.png';
import beigeMat from './images/matcaps/beige.png';
import brownMat from './images/matcaps/brown.png';
import greyMat from './images/matcaps/gray.png';
import redMat from './images/matcaps/red.png';
import metalMat from './images/matcaps/metal.png';
import goldMat from './images/matcaps/gold3.png';

import * as dat from 'dat.gui'
// import datGuiImage from 'dat.gui.image'
// datGuiImage(dat)
import gsap from 'gsap'
import { math } from './math'

import { TimelineMax } from 'gsap'
import { OrthographicCamera } from 'three'
import { Expo } from 'gsap/gsap-core'
let OrbitControls = require('three-orbit-controls')(THREE);

// const createInputEvents = require('simple-input-events')
// const event = createInputEvents(window);

export default class Sketch {
    constructor(selector) {
        this.scene = new THREE.Scene();
        this.cube = [];
        this.current = 0;
        this.position = 0;
        this.speed = 0;
        this.siped = 0;
        this.rounded = 0;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(new THREE.Color('rgb(12, 4, 0)'));
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container = document.getElementById('container');
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            70, window.innerWidth / window.innerHeight,
            0.001,
            1000
        );
        this.texloader = new THREE.TextureLoader()
        this.matcaps = [
            this.texloader.load(whiteMat),
            this.texloader.load(greenMat),
            this.texloader.load(yellowMat),
            this.texloader.load(greyMat),
            this.texloader.load(redMat),
            this.texloader.load(brownMat),
            this.texloader.load(beigeMat),
            this.texloader.load(black2Mat),
            this.texloader.load(blackMat),
        ];
        this.threeObjcts = [];
        // let frustumSize = 10;
        // let aspect = window.innerWidth / window.innerHeight;
        // this.camera = new THREE.OrthographicCamera(frustumSize* aspect / -2, frustumSize*aspect);
        this.camera.position.set(0, 0, 2.5);
        
        window.innerHeight > window.innerWidth && this.camera.position.set(0.5, 0, 2.5);
        window.innerHeight > window.innerWidth && this.camera.lookAt(0.5, 0, 2.5);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.paused = false;
        this.threeD = new THREE.Object3D()
        this.threeD2 = new THREE.Object3D()
        this.threeD3 = new THREE.Object3D()
        this.threeD4 = new THREE.Object3D()
        this.threeD5 = new THREE.Object3D()
        this.threeD6 = new THREE.Object3D()

        this.setupResize();
        this.addObjects();
        this.windowEvents();
        this.resize();
        this.render();
        this.postProcesses();
        // this.settings();
    }
    settings() {
        let that = this;
        this.settings = {
            time: 0,
        };
        this.gui = new dat.GUI();
        this.gui.add(this.settings, 'time', 0, 100, 0.01);
        this.gui.addImage(this.settings, 'texturePath').onChange((image) => {
            body.append(image);
        });
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.imageAspect = 853 / 1280;
        let a1; let a2;
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a2 = (this.height / this.width) * this.imageAspect;
            a1 = 1;
        }
        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        // const dist = this.camera.position.z;
        // const height = 1;
        // this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

        // if (this.width / this.height > 1) {
        //     this.plane.scale.x = this.camera.aspect;
        //     // this.plane.scale.y = this.camera.aspect;
        // } else {
        //     this.plane.scale.y = 1 / this.camera.aspect;
        // }

        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        let that = this;
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: '#extension GL_OES_standard_derivatives : enable'
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                motion: { type: "f", value: 0.01},
                offset: { type: "f", value: 1 },
                light: { value: new THREE.Vector3(0, 0, 0) },
                matcap1: { type: "t", value: this.matcaps[5] },
                matcap2: { type: "t", value: this.matcaps[8] },
                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate: {
                    value: new THREE.Vector2(1, 1)
                }
            },
            // wireframe: true,
            vertexShader: vertex,
            fragmentShader: fragment
        });
        // this.GlLoader = new GLTFLoader();
        // this.GlLoader.load(leaf, gl =>{
        //     gl.scene.children[0].material = this.material;
        //     this.leaf = gl.scene;
        //     this.threeObjcts.push(this.leaf);
        //     this.leaf.scale.multiplyScalar(0.2);
        //     this.leaf.scale.z *= 1.2;
        //     this.leaf.position.z = 3.5;
        //     this.leaf.rotation.y = Math.PI / 2;
        //     this.scene.add(gl.scene);
        //     // console.log(gl);
        // })
        let loader = new OBJLoader();
        loader.load(butterfly, obj => {
            // console.log(obj)
            this.butterfly = [];
            for(let i = 0; i < 26; i++) {
                    this.butterfly.push(
                        obj.children[i],
                    );
                }
            this.butterfly.forEach((obj, i) => {
                obj.material = this.material;
                // obj.material = new THREE.MeshMatcapMaterial({
                //     matcap: new THREE.TextureLoader().load(blackMat)
                // });
                obj.scale.multiplyScalar(0.4);
                obj.position.x += 0.5;
                obj.position.y += 0.2;
                this.threeD2.add(obj);
            })
            this.threeObjcts.push(this.threeD2);
            this.scene.add(this.threeD2)

        })
        loader.load(lego, obj => {
            // console.log(obj)
            this.lego = [];
            this.lego = [obj.children[0], obj.children[1]];

            this.lego.forEach((obj, i) => {
                obj.material = this.material;
                // obj.material = new THREE.MeshMatcapMaterial({
                //     matcap: new THREE.TextureLoader().load(blackMat)
                // });
                obj.scale.multiplyScalar(0.3);
                obj.position.x += 0.5;
                obj.position.y -= 1;
                this.threeD4.add(obj);
            })
            this.threeD4.position.z = 3.5
            this.threeObjcts.push(this.threeD4);
            this.scene.add(this.threeD4)
            
        })
//         loader.load(shark, obj => {
//             console.log(obj)
//             this.shark = [];
//             this.shark = [obj.children[0], obj.children[1], obj.children[2], obj.children[3], obj.children[4], obj.children[5], obj.children[6]];

//             this.shark.forEach((obj, i) => {
//                 obj.material = this.material;
//                 // obj.material = new THREE.MeshMatcapMaterial({
//                 //     matcap: new THREE.TextureLoader().load(blackMat)
//                 // });
//                 obj.scale.multiplyScalar(0.035);
//                 obj.position.x += 0.5;
//                 obj.position.y -= 1.2;
//                 this.threeD6.add(obj);
//             })
//             this.threeD6.position.z = 3.5
//             this.threeObjcts.push(this.threeD6);
//             this.scene.add(this.threeD6);

//         })
        loader.load(cubes, obj => {

            this.cube = [obj.children[0], obj.children[1], obj.children[2], obj.children[3], obj.children[4], obj.children[5]];
            this.cube.forEach(obj => {
                obj.material = this.material;
                // obj.material = new THREE.MeshMatcapMaterial({
                    //     matcap: new THREE.TextureLoader().load(blackMat)
                    // });
                    obj.scale.multiplyScalar(0.2);
                    obj.position.x += 0.5;
                    obj.position.y -= 1;
                    this.threeD.add(obj);
                })
                this.threeD.position.z = 3.5
                this.threeObjcts.push(this.threeD);
                this.scene.add(this.threeD)

        })
        loader.load(icosas, obj => {
            // console.log(obj)
            // this.icosas = [];
            this.icosas = [obj.children[0], obj.children[1], obj.children[2], obj.children[3], obj.children[4], obj.children[5]];
            this.icosas.forEach((obj, i) => {
                obj.material = this.material;
                // obj.material = new THREE.MeshMatcapMaterial({
                //     matcap: new THREE.TextureLoader().load(blackMat)
                // });
                obj.scale.multiplyScalar(0.2);
                obj.position.x += 0.5;
                obj.position.y -= 0.8;
                this.threeD3.add(obj);
            })
            this.threeD3.position.z = 3.5
            this.threeObjcts.push(this.threeD3);
            this.scene.add(this.threeD3)

        })
        this.light = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 10, 10),
            new THREE.ShaderMaterial({
                extensions: {
                    derivatives: '#extension GL_OES_standard_derivatives : enable'
                },
                side: THREE.DoubleSide,
                uniforms: {
                    time: { type: "f", value: 0 },
                    light: { value: new THREE.Vector3(0, 0, 0) },
                    matcap: { type: "t", value: this.matcaps[4] },
                    resolution: { type: "v4", value: new THREE.Vector4() },
                    uvRate: {
                        value: new THREE.Vector2(1, 1)
                    }
                },
                // wireframe: true,
                // transparent: true,
                vertexShader: lightvert,
                fragmentShader: lightfrag
            })
        );
        this.scene.add(this.light);

        this.geometry = new THREE.PlaneBufferGeometry(10, 5, 50, 50);
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane2 = new THREE.Mesh(this.geometry, new THREE.ShaderMaterial({
            extensions: {
                derivatives: '#extension GL_OES_standard_derivatives : enable'
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                motion: { type: "f", value: 0 },
                offset: { type: "f", value: 0.8 },
                matcap1: { type: "t", value: this.matcaps[5] },
                matcap2: { type: "t", value: this.matcaps[8] },
                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate: {
                    value: new THREE.Vector2(1, 1)
                }
            },
            // wireframe: true,
            // transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment
        }));
        this.plane2.rotation.x = Math.PI/2;
        this.plane.position.z = -1;
        this.plane2.position.y = -1.2;
        this.scene.add(this.plane);
        this.scene.add(this.plane2);
    }


    windowEvents() {
        this.content = document.querySelector('.content');
        this.clicker = document.querySelector('.clickme');
        this.spanner = [...document.querySelectorAll('span')];
        this.scrollbar = document.querySelector('.bar');
        this.wrapper = [...document.querySelectorAll('.wrapper')]
        this.hech3 = [...document.querySelectorAll('h3')]
        this.ptag = [...document.querySelectorAll('p')]
        console.log(this.spanner)
        
        this.rayPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(20,20,1,1),
            new THREE.MeshBasicMaterial()
            );
            this.rayPlane.position.z = 2;
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop()
            } else {
                this.play();
            }
        });
        window.addEventListener('mousemove', e => {
            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            let intersects = this.raycaster.intersectObjects([this.rayPlane]);
            if (intersects.length>0){
                this.light.position.copy(intersects[0].point);
            }
        });
        window.addEventListener('wheel', e => {
            this.siped = Math.sign(e.wheelDeltaY);
            this.speed += e.deltaY * 0.003;
            // console.log()
        });
        this.clicker.addEventListener('click', () => {
            this.next();
        })
        const tl = new TimelineMax()
        tl.staggerFromTo(this.spanner, 0.5, {
            opacity: 0,
            duration: Infinity
        }, {
            opacity: 1,
            duration: Infinity
        }, 0.05)
        const intersection = entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tl.staggerFromTo(entry.target.children[0].children, 0.8, {
                        y: 200,
                        opacity:0,
                        ease: Expo.easeInOut,
                    }, {
                        y:0,
                        opacity: 1,
                        ease: Expo.easeInOut,
                    }, 0.08)
                }else{
                    tl.staggerFromTo(entry.target.children[0].children, 0.8, {
                        y: 0,
                        opacity: 1,
                    }, {
                        y: -200,
                        opacity: 0,
                    }, 0.08)
                }
            })
        }

        let observer = new IntersectionObserver(intersection, { threshold: 0.2, rootMargin: '100px' });
        this.wrapper.forEach(wr => {
            observer.observe(wr)
        })
        
    }
    UIAnim() {
        this.position += this.speed;
        this.speed *= 0.8;
        this.rounded = Math.round(this.position);
        let diff = (this.rounded - this.position);
        this.position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;
        let trans = -  math.clamp(this.position, 0, 6.97);

        // console.log(trans)
        // this.content.style.transform = `translate3d(0, -${this.position*100}px, 0)`
        gsap.to(this.content, {
            top: this.siped < 0 ? -window.innerHeight : 0,
            ease: Expo.easeIn,
            duration: 0.2,
        });
        gsap.to(this.material.uniforms.motion, {
            value: this.siped < 0 ? trans : 0,
            ease: Expo.easeIn,
            duration: 0.8,
        });
        gsap.to(this.plane2.material.uniforms.motion, {
            value: this.siped < 0 ? trans : 0,
            ease: Expo.easeIn,
            duration: 0.8,
        });
        
        gsap.to(this.scrollbar, {
            y: this.siped < 0 ? 150 : 0,
            ease: Expo.easeIn,
            duration: 0.2,
        });
        
    }
    stop() {
        this.paused = true;
    }

    play() {
        this.paused = false;
    }
    next() {
        if (this.isRunning) return;
        this.isRunning = true;
        let len = this.threeObjcts.length;
        let nextTexture = this.threeObjcts[(this.current + 1) % len];
        
        gsap.to(nextTexture.position, {
            z: -1.5,
            ease: Expo.easeInOut,
            onComplete: () => {
                console.log('FINISH');
                nextTexture.position.z = 3.5;
		this.current = (this.current + 1) % len;
                nextTexture = this.threeObjcts[(this.current + 1) % len]
                this.isRunning = false;
                gsap.to(nextTexture.position, {
                    z: 0,
                    ease: Expo.easeInOut,
                    onComplete: () => {
			this.current = (this.current + 1) % len;
			
                    //     console.log('FINISH');
                    //     nextTexture.position.z = 3.5;
                    //     this.current = (this.current + 1) % len;
                    //     this.isRunning = false;
                    }
                })
            }
        })
    }

    postProcesses() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        this.noisePass = new ShaderPass(BloomPass);
        // this.noisePass.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight)
        // this.noisePass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
        this.composer.addPass(this.noisePass);
    }
    render() {
        if (this.paused) return;
        this.time += 0.05;
        this.material.uniforms.time.value = this.time;
        if (this.light) this.light.material.uniforms.light.value = this.light.position;
        this.material.uniforms.light.value = this.light.position;
        if (this.cube) this.cube.forEach(obj => {
            obj.rotation.y += 0.03;
        })
        if (this.butterfly) this.butterfly.forEach(obj => {
            obj.rotation.y += Math.sin(this.time/1.2)*0.015;
        })
        if (this.icosas) this.icosas.forEach(obj => {
            obj.rotation.y += 0.03;
        })
        if (this.lego) this.lego.forEach(obj => {
            obj.rotation.y += Math.sin(this.time / 1.2) * 0.015;
        })
        if (this.shark) this.shark.forEach(obj => {
            obj.rotation.y += Math.sin(this.time / 1.2) * 0.015;
        })
        this.UIAnim();
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        // if(this.composer)this.composer.render();

    }

}
new Sketch('container');
