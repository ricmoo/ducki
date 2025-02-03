DucKi
=====

A simple scripting language for interacting with KiCad, mostly for
the purpose of creating 3D renders, scheamtics, etc. for README files
in projects.


Setting Up
----------

Unfortunatly, the latest stable version of KiCad does not include the
`render` sub-module in the `kicad-cli`, so a nightly build or
[RC for v9](https://forum.kicad.info/t/stable-version-9-0-0-rc1-available/56966)
must be installed to use this tool.

It should be installed in your home folder `~/.ducki/KiCad`.


Usage
-----

Create a file in a KiCad project files called `ducki.js`, which will
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
