DucKi
=====

A simple scripting language for interacting with Kicad, mostly for
the purpose of creating 3D renders, scheamtics, etc. for README files
in projects.


Usage
-----

Create a file in a Kicad project files called `ducki.js`, which will
have a global variable called `project` which can be used to create
various output files.

All file paths are relative to the project folder.

```
// Create a 3D Render
project.render({
    perspective: true,
    rotate: { x: -25, y: 25, z: 10 },
    size: { width: 1024 },
    zoom: 0.7
}, "output/render-front.jpg");
```


License
-------

MIT License.
