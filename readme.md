<!-- Banner -->
<div align="center">
    <img align="center" style="display: block; margin: 0 auto" src="images/readme/banner.gif">
</div>

<h1 align="center">Hi There, Welcome to WezBot repository ! </h1>
<h3 align="center">A multifunctional French bot</h3>

<!-- Repo views -->

<!-- Social media -->

<!-- Presentation -->
# 📜 Presentation
WezBot is a multifunction bot that takes over the commands necessary for the proper functioning of a Discord server. For convenience, you can directly [add](https://discord.com/api/oauth2/authorize?client_id=1049396684075053077&permissions=8&scope=applications.commands%20bot) WezBot to your server.

[Installation](#🛠️-installation) is quick and easy

<!-- Languages and Tools -->
# 🚧 Prerequisites
- [Node.js 16+](https://nodejs.org/en/download/)

<!-- Installation -->
# 🛠️ Installation
> To install the bot, you must first clone the repository :
```javascript
git clone https://github.com/IweZix/WezBot.git
```
> Then, you must install the dependencies :
```javascript
npm i
```
> Finally, you will need to modify [token](#🔐-token) and [ownerID](#ownerid) in the config.js file

```javascript
module.exports = {
    token: "[TOKEN]",
    ownerID: "[YOUR_DISCORD_ID]",
    version: "1.0.0",
}
```

#### 🔐 Token
<div align="center">
    <img align="center" style="display: block; margin: 0 auto" src="images/readme/token.png">
</div>

#### 🆔 OwnerID
<div align="center">
    <img align="center" style="display: block; margin: 0 auto" src="images/readme/ownerID.png">
</div>
<br>

> You can now start the bot :
```javascript
node main.js
```

# 📝 License

WeZbot is licensed under the [GNU GPL v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)

If you want to use WezBot's code to create your own Discord bot, please upload your new code on GitHub mentioning IweZix

For any questions or requests, please contact me either by Discord **IweZix#8370** or **contact@iwezix.xyz**
