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

    // Import and add a GLB file.
    await viewer.load("./assets/drill3.glb")

    function setupScrollAnimation() {
        const tl = gsap.timeline()

        // First Section
        tl
        .to(
            position,
            {
                x: 1.56,
                y: -2.26,
                z: -3.85,
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
    }

    viewer.addEventListener('preFrame',() => {
        if (needsUpdate) {
            camera.positionUpdated(true)
            camera.targetUpdated(true)
            needsUpdate = false
        }
    })

}

setupViewer()
