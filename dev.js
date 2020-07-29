const chokidar = require("chokidar");
const { spawn } = require("child_process");

// One-liner for current directory
chokidar.watch("./src").on("all", (event, path) => {
  if (["add", "change", "unlink"].includes(event)) {
    spawn("yalc", ["push"], { stdio: "inherit" });
  }
});
