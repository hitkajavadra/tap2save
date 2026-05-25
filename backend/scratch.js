const { instagramGetUrl } = require("instagram-url-direct");

async function test() {
  try {
    let res = await instagramGetUrl("https://www.instagram.com/reel/C9Fm1qKpsQO/");
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  }
}
test();
