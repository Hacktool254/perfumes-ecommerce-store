const { execSync } = require('child_process');
try {
    console.log("Running Convex mutation to promote admin...");
    // By passing an array of arguments, spawn/execSync handles the quoting automatically.
    const { spawnSync } = require('child_process');
    const result = spawnSync('npx.cmd', ['convex', 'run', 'users:promoteToAdmin', '{"email":"admin@ummiesessence.com"}'], { stdio: 'inherit', shell: true });
    if (result.status === 0) {
        console.log("Successfully promoted to admin!");
    } else {
        console.error("Failed to promote to admin.");
    }
} catch (e) {
    console.error(e);
}
