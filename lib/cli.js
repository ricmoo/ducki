#!/bin/env node
import { join } from "path";
import { Script } from "./script.js";
const argv = process.argv.slice(2);
if (argv.length !== 1) {
    console.log("Usage: node cli PROJECT_PATH");
    process.exit(1);
}
(async function () {
    const script = new Script(join(argv[0], "ducki.js"));
    await script.run();
})().catch((e) => {
    console.log("ERROR");
    console.log(e);
});
//# sourceMappingURL=cli.js.map