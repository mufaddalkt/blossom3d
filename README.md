# Blossom School 3D

An interactive school diorama built from supplied reference photographs.
The campus rotates automatically and can be explored from every side.

## Requested layout

- Dam and flowing water on the left in the default front view.
- Upper and lower roads joined along the right side.
- Entrance moved to the right boundary, covered in cherry blossom flowers.
- Two-storey white-and-blue school, classroom windows, corridors, rooftop
  pavilion, lawns, garden paths, benches, boundary walls, street lights and traffic.

## Use

Open `public/index.html` in a modern browser. Everything needed to display the
scene is embedded in the HTML, so it also works offline.

Drag to orbit, scroll or pinch to zoom, and right-drag to pan. Use the view buttons
for the school, dam and blossom gate. The entrance gates can be opened and closed.

## Downloads

- [Offline interactive viewer](public/Blossom-School-3D.html)
- [Animated 3D model (GLB)](public/Blossom-School.glb)
- [360-degree preview video](public/Blossom-School-360.mp4)
- [Overview image](public/Blossom-School-preview.png)
- [Complete original package](public/Blossom-School-Complete.zip)
- [Instructions](public/READ-ME.txt)

The GLB contains embedded textures and a 30-second turntable animation.
Water, vehicles, petals and interactive gate movement run in the HTML viewer.
Dimensions and surfaces hidden in the reference photographs are inferred.

## Edit and rebuild

Edit `src/scene.js` for geometry and animation, or `src/shell.html` for the viewer.
With Python 3 installed, rebuild the two self-contained HTML files:

```sh
python scripts/build.py
```

The rebuild does not regenerate the GLB, preview video, image or original ZIP.
Use the viewer's **3D model** and **Save image** buttons to export updated assets.

## Vercel

Import this repository, choose the **Other** framework preset, leave the build
and install commands empty, and use `public` as the output directory. These
settings are included in `vercel.json`. No environment variables are required.

## Third-party software

Three.js, OrbitControls and GLTFExporter are bundled at version 0.160.1.
The Three.js MIT license is in [vendor/LICENSE.three.txt](vendor/LICENSE.three.txt).
