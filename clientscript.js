const ws = new WebSocket('ws://192.168.7.85:3030');
ws.onopen = () => { 
    console.log('Now connected'); 
};
ws.onmessage = (data) => {
    console.log(data);
};
$(document).on("keypress", function (keypress) {
    ws.send(keypress);
});