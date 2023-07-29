import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals

} from "webgi";

import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        // useRgbm: false,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add a popup(in HTML) with download progress when any asset is downloading.
    // await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    // await viewer.addPlugin(GBufferPlugin)
    // await viewer.addPlugin(new ProgressivePlugin(32))
    // await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    // await viewer.addPlugin(GammaCorrectionPlugin)
    // await viewer.addPlugin(SSRPlugin)
    // await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    // await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)
    // and many more...

    // or use this to add all main ones at once.
    await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    // viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true

    // viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})


    viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true // in case its set to false in the glb

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})
    
    // Import and add a GLB file.
    const model = await viewer.load("./assets/drill3.glb")
    console.log(model)

    function setupScrollAnimation() {
        const tl = gsap.timeline()

        // First Section
        tl
        .to(
            position,
            {
                x: 1.56, y: -2.26, z: -3.85,
                scrollTrigger: {
                    trigger: ".second",
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                    immediateRender: false
                },
                onUpdate
            }
        )
            
        .to(
            ".section--first-container",
            {
                xPercent: '-150',
                opacity: 0,
                scrollTrigger: {
                    trigger: ".second",
                    start: "top bottom",
                    end: "top 80%",
                    scrub: true,
                    immediateRender: false
                },
            }
        )
        
        .to(
            target,
            {
                x: -1.37,
                y: 1.99,
                z: -0.37,
                scrollTrigger: {
                    trigger: ".second",
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                    immediateRender: false
                },
            }
        )


        // Last Section
        .to(
            position,
            {
                x: -3.4,
                y: 0.6,
                z: 1.71,
                scrollTrigger: {
                    trigger: ".third",
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                    immediateRender: false
                },
                onUpdate
            }
        )
        .to(
            target,
            {
                x: -1.5,
                y: 2.13,
                z: -0.4,
                scrollTrigger: {
                    trigger: ".third",
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                    immediateRender: false
                },
            }
        )

    }

    setupScrollAnimation()

    // WebGi Update
    let needsUpdate = true
    
    function onUpdate() {
        needsUpdate = true
        viewer.renderer.resetShadows()
        // viewer.setDirty()
    }

    viewer.addEventListener('preFrame',() => {
        if (needsUpdate) {
            // camera.positionUpdated(true)
            // camera.targetUpdated(true)
            camera.positionTargetUpdated(true)
            needsUpdate = false
        }
    })

    // Know More Event
    document.querySelector('.button--hero')?.addEventListener('click', () => {
        const element = document.querySelector('.second')
        window.scrollTo({
            top: element?.getBoundingClientRect().top,
            left: 0,
            behavior: 'smooth'
        })
    })

    // Scroll To Top
    document.querySelectorAll('.button--footer')?.forEach(item => {
        item.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        })
    })

    // Customize
    const sections = document.querySelector('.container') as HTMLElement
    const mainContainer = document.getElementById('webgi-canvas-container') as HTMLElement
    document.querySelector('.button--customize')?.addEventListener('click', () => {
        // viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false })
        sections.style.display = 'none'
        mainContainer.style.pointerEvents = 'all'
        document.body.style.cursor = 'grab'

        gsap.fromTo(position,
            {
                x: -3.4,
                y: 0.6,
                z: 1.71,
                onUpdate
            },
            {
                x: -2.6, y: 0.2, z: -9.6,
                duration: 2,
                ease: "power3.inOut",
                onUpdate
            })
        gsap.fromTo(target,
            {
                x: -1.5,
                y: 2.13,
                z: -0.4,
                onUpdate
            },
            {
                x: -0.15, y: 1.18, z: 0.12,
                duration: 2,
                ease: "power3.inOut",
                onUpdate,
                onComplete: enableControllers
            })
    })

    function enableControllers() {
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true })
    }

    // Exit Customizer
    document.querySelector('.button--exit')?.addEventListener('click', () => {
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false })
        sections.style.display = 'block'
        mainContainer.style.pointerEvents = 'none'
        document.body.style.cursor = 'default'

        gsap.fromTo(position,
            {
                x: -2.6, y: 0.2, z: -9.6,
                onUpdate
            },
            {
                x: -5.3, y: 0.4, z: 5.6,
                duration: 0,
                ease: "power3.inOut",
                onUpdate
            })
        gsap.fromTo(target,
            {
                x: -0.15, y: 1.18, z: 0.12,
                onUpdate
            },
            {
                x: -1.4, y: 1.2, z: -0.6,
                duration: 0,
                ease: "power3.inOut",
                onUpdate,
                onComplete: enableControllers
            })
    })

}

setupViewer()
