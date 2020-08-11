// yyw config
window.config = {
    env: "test", //develop | test | product
    server: 1
};
  
window.baseReqUrl = {
    "develop": "//10.10.9.70:8081/",
    "test": "//newfarm.mobimtech.com/",
    "product": "//animal.imifun.com/"
}

window.cdnstatic = {
    "develop": "//cdnstatic.happyia.com/www/ivp/",
    "test": "//static.mobimtech.com/ivp/",
    "product": "//cdnstatic.imifun.com/ivp/"
}

window.wxConfig = {
    fromType: "wx",
    env: "product"
}
window.loginReqUrl = {
    'develop': 'https://mini.imifun.com/',
    'test': 'https://minitest.imifun.com/',
    'product': 'https://mini.imifun.com/'
}

window.webSocketUrl = {
    "develop": "ws://10.10.9.68:8080/websocket/",
    "test": "ws://139.199.68.32:8003/websocket/",
    "product": {
        "http": "ws://animal.imifun.com/websocket/",
        "https": "wss://animal.imifun.com/websocket/"
    }
}

// module.exports = {
//     Config: config,
//     baseReqUrl: baseReqUrl,
//     cdnstatic: cdnstatic,
//     webSocketUrl: webSocketUrl
// };