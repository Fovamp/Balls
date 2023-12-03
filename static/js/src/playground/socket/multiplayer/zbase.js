class MultiPlayerSocket{
    constructor(playground){
        this.playground = playground;

        this.ws = new WebSocket("wss://fovamp.site:7000/wss/multiplayer/");
        this.start();
    }
    start(){

    }
}
