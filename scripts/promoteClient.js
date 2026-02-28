const { ConvexHttpClient } = require("convex/browser");

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
    console.error("Missing NEXT_PUBLIC_CONVEX_URL");
    process.exit(1);
}

const client = new ConvexHttpClient(url);

client.mutation("users:promoteToAdmin", { email: "admin@ummiesessence.com" })
    .then((res) => {
        console.log("Success:", res);
    })
    .catch((err) => {
        console.error("Error:", err);
    });
