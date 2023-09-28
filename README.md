# Web3 Blog Template

## Project design

![image](https://github.com/ychenz/web3-fvm-blog-template/assets/10768904/7b2ba761-6aeb-413a-aba6-46bb1bfa8f1d)

This project work closely with the other 3 components shown in the above architecture:

- [Web3 blog creator](https://github.com/ychenz/web3-blog-creator)
- [Web3 blog creator API](https://github.com/ychenz/web3-blog-creator-api)
- [The smart contract](https://github.com/ychenz/web3-blog-creator-tables-contract)

For the project to work you will need to set them up in the following order:

1. The smart contract
2. (Current repo) Blog template (creator created blog site)
3. Web3 blog creator API
4. Web3 blog creator

## Local Development

1. Install dependencies by running `yarn`
2. To develop this locally, you will need to build a production release by runnning `yarn build`, and copy the `build` folder.
3. Setup the [Web3 blog creator API](https://github.com/ychenz/web3-blog-creator-api), by following the API's README, you should have pasted the `build` folder to the API's root and rename it to `blog_template`.
4. Setup the [Web3 blog creator](https://github.com/ychenz/web3-blog-creator), and create a new blog site. Once the site is created successfully, your should be able to get a CID from the Lighthouse url.
5. Open [helpers.ts file](https://github.com/ychenz/web3-fvm-blog-template/blob/main/src/helpers.ts) and paste the CID inside the `getSiteCid` function, it should look like this:
```
export const getSiteCid = (url: string) => {
    // Split the URL by "/" and get the second last element
    if (url === "http://localhost:3002/") {
        // TODO: Replace this with your own test site CID
        return "your CID";
    } else {
        const siteCid = url.split("/")[url.split("/").length - 2];

        return siteCid;
    }
};
```

6. Start development server by running `yarn start`. Make sure you have create the `.env` file using the example, this make sure the app will run on port 3002, not conflicting with other apps.
7. Now every time you make some changes to the blog using the blog creator (such as creating a new blog), you can see the changes by refreshing the page.
