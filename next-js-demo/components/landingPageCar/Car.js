import React, { Fragment, useEffect, useState, useRef } from 'react';

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Stats from 'stats.js';

export default function Car({ sections }) {
	THREE.Cache.enabled = true;
	const canvasModel = useRef(null);

	useEffect(() => {
		// console.log('loaded model');

		const load_settings = () => {
			const loader = new GLTFLoader();
			const scene = new THREE.Scene();

			// scene.background = new THREE.Color(0x333333);
			scene.environment = new RGBELoader().load('/venice_sunset_1k.hdr');
			scene.environment.mapping = THREE.EquirectangularReflectionMapping;
			// scene.fog = new THREE.Fog(0x333333, 10, 20);

			const camera = new THREE.PerspectiveCamera(
				10,
				window.innerWidth / window.innerHeight,
				0.1,
				1000
			);

			const renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
			});

			return [loader, scene, camera, renderer];
		};

		const load_gltf = (scene, gltf_path, options) => {
			// const load_gltf = (loader, scene, gltf_path, model) => {

			const { receiveShadow, castShadow } = options;

			return new Promise((resolve, reject) => {
				const loader = new GLTFLoader();
				loader.load(
					gltf_path,
					(gltf) => {
						const obj = gltf.scene;
						obj.name = 'car';
						obj.position.y = 1.18;
						obj.position.x = 2;
						obj.receiveShadow = receiveShadow;
						obj.castShadow = castShadow;
						scene.add(obj);

						obj.traverse((child) => {
							if (child.isMesh) {
								child.castShadow = castShadow;
								child.receiveShadow = receiveShadow;
							}
						});

						resolve(obj);
					},
					undefined,
					(error) => {
						console.error(error);
						reject(error);
					}
				);
			});
		};

		const append_settings = (renderer) => {
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setPixelRatio(window.devicePixelRatio);

			canvasModel.current.appendChild(renderer.domElement);
		};

		const set_light = (scene) => {
			// const light = new THREE.DirectionalLight(0xffffff, 1);
			// light.position.set(0, 0, 1).normalize();

			const light2 = new THREE.DirectionalLight(0xffffff, 1);
			light2.position.set(-2, 4, 3);
			scene.add(light2);

			// const backLight = new THREE.DirectionalLight(0xffffff, 1);
			// backLight.position.set(0, 0, -10).normalize();

			// scene.add(light, backLight);

			const ambient = new THREE.AmbientLight(0x222222);
			scene.add(ambient);

			const light = new THREE.DirectionalLight(0xffffff);
			light.position.set(0, 0, 6).normalize();
			scene.add(light);
		};

		const createStats = () => {
			var stats = new Stats();
			stats.setMode(0);

			stats.domElement.style.position = 'fixed';
			stats.domElement.style.left = '0';
			stats.domElement.style.top = '0';

			return stats;
		};

		function isInViewport(element) {
			if (element == null) {
				return false;
			}

			var rect = element.getBoundingClientRect();

			const topVisible =
				rect.top >= 0 &&
				rect.top + window.innerHeight * (1 / 3) <= window.innerHeight; // TODO: Richtige Höhe

			const bottomVisible =
				rect.bottom >= window.innerHeight * (1 / 3) &&
				rect.bottom <= window.innerHeight;

			return bottomVisible || topVisible;
		}

		const [loader, scene, camera, renderer] = load_settings();

		let car;
		// let carElement = document.getElementById('test');

		load_gltf(scene, './scene.glb', {
			castShadow: false,
			receiveShadow: false,
		}).then((result) => {
			car = result;

			canvasModel.current.style.opacity = 1;
			onLoadOrScroll();
			new OrbitControls(camera, renderer.domElement);
		});

		append_settings(renderer);

		var lightNew = new THREE.DirectionalLight(0xffffff);
		lightNew.position.set(0, 10, 0);
		lightNew.castShadow = true; //Aktiviere die Schattenwerfung für das Licht
		lightNew.shadow.mapSize.width = 512; //Setze die Schattenkarte auf eine Größe von 512x512
		lightNew.shadow.mapSize.height = 512;
		lightNew.shadow.camera.near = 0.5; //Setze die nächste Kamera für die Schatten auf 0,5
		lightNew.shadow.camera.far = 500; //Setze die fernste Kamera für die Schatten auf 500

		scene.add(lightNew);

		set_light(scene);

		let grid;

		grid = new THREE.GridHelper(20, 40, 0x000000, 0x000000);
		grid.material.opacity = 0.1;
		grid.material.depthWrite = false;
		grid.material.transparent = true;
		scene.add(grid);

		let currentCameraPosition = {
			x: 0,
			y: 6.33498494651499,
			z: -38.25073235775218,
		};

		let currentLookAtPosition = { x: 0, y: 2.5, z: 0 };

		const animateCamera = (
			currentCameraPosition,
			aimCameraPosition,
			duration,
			currentLookAtPosition,
			aimLookAtPosition
		) => {
			const cameraPositionTween = new TWEEN.Tween(currentCameraPosition)
				.to(aimCameraPosition, duration)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onUpdate((object) => {
					camera.position.x = object.x;
					camera.position.y = object.y;
					camera.position.z = object.z;
				});

			const lookAtTween = new TWEEN.Tween(currentLookAtPosition)
				.to(aimLookAtPosition, duration)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onUpdate((object) => {
					camera.lookAt(object.x, object.y, object.z);
				});

			lookAtTween.start();
			cameraPositionTween.start();
		};

		let scrollOneTriggered = false;
		let scrollTwoTriggered = false;
		let scrollThreeTriggered = false;
		let scrollFourTriggered = false;

		let aimCameraPosition;
		let aimLookAtPosition;

		const onLoadOrScroll = () => {
			// let section1 = document.getElementById('section1');
			// let sectionTwo = sectionTwo.current;
			// let sectionThree = document.getElementById('sectionThree');
			// let sectionFour = document.getElementById('sectionFour');

			let sectionOne = sections.section1.current;
			let sectionTwo = sections.section2.current;
			let sectionThree = sections.section3.current;
			let sectionFour = sections.section4.current;

			// let sectionTwoText = document.querySelector('.sectionTwo-text-holder');
			// let sectionThreeText = document.querySelector('.sectionThree-text-holder');
			// let sectionFourText = document.querySelector('.sectionFour-text-holder');

			// console.log('Scrolling...');

			// let canv = document.querySelector('#test');

			// section1 = document.getElementById('section1');
			// sectionTwo = document.getElementById('sectionTwo');
			// sectionThree = document.getElementById('sectionThree');

			// Section 1
			if (
				isInViewport(sectionOne) &&
				!isInViewport(sectionTwo) &&
				!isInViewport(sectionThree) &&
				!isInViewport(sectionFour) &&
				!scrollOneTriggered
			) {
				// console.log('Section One...');
				aimCameraPosition = {
					x: 0,
					y: 6.33498494651499,
					z: -38.25073235775218,
				};

				aimLookAtPosition = { x: 0, y: 2.5, z: 0 };

				animateCamera(
					currentCameraPosition,
					aimCameraPosition,
					300,
					currentLookAtPosition,
					aimLookAtPosition
				);

				scrollOneTriggered = true;
				scrollTwoTriggered = false;
				scrollThreeTriggered = false;
				scrollFourTriggered = false;

				currentLookAtPosition = aimLookAtPosition;
				currentCameraPosition = aimCameraPosition;

				sectionOne.style.opacity = 1;
				sectionTwo.style.opacity = 0;
				sectionThree.style.opacity = 0;
				sectionFour.style.opacity = 0;
			}

			// Section 2
			if (
				!isInViewport(sectionOne) &&
				isInViewport(sectionTwo) &&
				!isInViewport(sectionThree) &&
				!isInViewport(sectionFour) &&
				!scrollTwoTriggered
			) {
				// console.log('Section Two...');
				aimCameraPosition = {
					x: -15.358196641012476,
					y: 11.875790235682425,
					z: -32.87071728072138,
				};

				aimLookAtPosition = { x: 5, y: 0.7, z: 0 };

				animateCamera(
					currentCameraPosition,
					aimCameraPosition,
					300,
					currentLookAtPosition,
					aimLookAtPosition
				);

				scrollOneTriggered = false;
				scrollTwoTriggered = true;
				scrollThreeTriggered = false;
				scrollFourTriggered = false;

				currentLookAtPosition = aimLookAtPosition;
				currentCameraPosition = aimCameraPosition;

				sectionOne.style.opacity = 0;
				sectionTwo.style.opacity = 1;
				sectionThree.style.opacity = 0;
				sectionFour.style.opacity = 0;
			}

			// Section 3
			if (
				!isInViewport(sectionOne) &&
				!isInViewport(sectionTwo) &&
				isInViewport(sectionThree) &&
				!isInViewport(sectionFour) &&
				!scrollThreeTriggered
			) {
				aimCameraPosition = {
					x: 35.73864259186667,
					y: 18.288628261634404,
					z: -30.23862528123354,
				};
				aimLookAtPosition = { x: -8, y: 0.2, z: 0 };

				animateCamera(
					currentCameraPosition,
					aimCameraPosition,
					300,
					currentLookAtPosition,
					aimLookAtPosition
				);
				scrollOneTriggered = false;
				scrollTwoTriggered = false;
				scrollThreeTriggered = true;
				scrollFourTriggered = false;

				currentLookAtPosition = aimLookAtPosition;
				currentCameraPosition = aimCameraPosition;

				sectionOne.style.opacity = 0;
				sectionTwo.style.opacity = 0;
				sectionThree.style.opacity = 1;
				sectionFour.style.opacity = 0;
			}

			// Section 4
			if (
				!isInViewport(sectionOne) &&
				!isInViewport(sectionTwo) &&
				!isInViewport(sectionThree) &&
				isInViewport(sectionFour) &&
				!scrollFourTriggered
			) {
				aimCameraPosition = {
					x: 0,
					y: 0,
					z: 45.179252543681194,
				};
				aimLookAtPosition = { x: 0, y: 0, z: 0 };

				animateCamera(
					currentCameraPosition,
					aimCameraPosition,
					300,
					currentLookAtPosition,
					aimLookAtPosition
				);
				scrollOneTriggered = false;
				scrollTwoTriggered = false;
				scrollThreeTriggered = false;
				scrollFourTriggered = true;

				currentLookAtPosition = aimLookAtPosition;
				currentCameraPosition = aimCameraPosition;

				sectionOne.style.opacity = 0;
				sectionTwo.style.opacity = 0;
				sectionThree.style.opacity = 0;
				sectionFour.style.opacity = 1;
			}

			// console.log(camera.position);
		};

		window.addEventListener('scroll', onLoadOrScroll, false);
		window.addEventListener('load', onLoadOrScroll, false);

		// const stats = createStats();
		// document.body.appendChild(stats.domElement);

		window.addEventListener(
			'resize',
			() => {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			},
			false
		);

		const cursor = { x: 0 };
		window.addEventListener(
			'mousemove',
			(_event) => {
				cursor.x = _event.clientX / window.innerWidth - 0.5;
			},
			false
		);

		const animate = () => {
			requestAnimationFrame(animate);

			if (car) {
				car.rotation.y += (cursor.x / 4 - car.rotation.y) / 30;
			}

			TWEEN.update();

			renderer.render(scene, camera);
			// stats.update();
		};

		animate();

		return () => {
			while (scene.children.length > 0) {
				scene.remove(scene.children[0]);
				// console.log('unloaded canvas');
			}
		};
	}, []);

	return <section id='test' ref={canvasModel}></section>;
}
