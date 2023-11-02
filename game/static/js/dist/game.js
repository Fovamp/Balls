class Balls_Game_Menu {
    constructor(root){
        this.root = root;
        this.$menu = $(`
<div class="balls-game-menu">
    <div class="balls-game-menu-field">
        <div class="balls-game-menu-field-item balls-game-menu-field-item-single-mode">
            单人游戏
        </div>
        <br>
        <div class="balls-game-menu-field-item balls-game-menu-field-item-multi-mode">
            多人游戏
        </div>
        <br>
        <div class="balls-game-menu-field-item balls-game-menu-field-item-setting">
            退出登录
        </div>
    </div>
</div>
`)
    this.root.$balls_game.append(this.$menu);
    this.$single_mode = this.$menu.find('.balls-game-menu-field-item-single-mode');
    this.$multi_mode = this.$menu.find('.balls-game-menu-field-item-multi-mode');
    this.$setting = this.$menu.find('.balls-game-menu-field-item-setting');
    this.start();
    }
    start(){
        this.add_listening_events();
    }
    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$setting.click(function(){
            console.log("click settings");
        });
    }


    show(){
        this.$menu.show();
    }
    hide(){
        this.$menu.hide();
    }
}
let BALLS_GAME_OBJECTS = [];
class Balls_Game_Object{
    constructor(){
        BALLS_GAME_OBJECTS.push(this);
        this.start();

        this.has_called_start = false; // 是否执行过start
        this.timedelta = 0; // 距离上一帧的时间间隔(ms)
    }
    start(){ // 第一帧执行一次

    }
    update(){ // 在每一帧都会执行一次

    }
    destroy(){ // 销毁
        for (let i = 0; i < BALLS_GAME_OBJECTS.length; i ++ ){
            if(BALLS_GAME_OBJECTS[i] === this){
                BALLS_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
    on_destroy(){ // 在销毁之前的操作

    }
}
let last_timestamp;
let BALLS_GAME_ANIMATION = function(timestamp){

    for (let i = 0; i < BALLS_GAME_OBJECTS.length; i ++ ){
        let obj = BALLS_GAME_OBJECTS[i];
        if(! obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    requestAnimationFrame(BALLS_GAME_ANIMATION);
}


requestAnimationFrame(BALLS_GAME_ANIMATION);
class GameMap extends Balls_Game_Object{
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext("2d");
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        console.log(this.ctx.canvas.width, this.ctx.canvas.height);
        this.playground.$playground.append(this.$canvas);

        this.start();
    }
    start(){

    }
    update(){
        this.render();
    }
    render(){
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    }
}
class Player extends Balls_Game_Object{
    constructor(playground, x, y, radius, color, speed, is_me){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.start();
    }
    start(){

    }
    update(){
        this.render();
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Balls_Game_Playground {
    constructor(root){
        this.root = root;
        this.$playground = $(`
<div class="balls-game-playground">游戏界面</div>
`);
        //this.hide();

        this.root.$balls_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        console.log(this.width, this.height);
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));
        this.start()
    }
    start(){
        this.add_listening_events();
    }
    add_listening_events(){

    }
    hide(){
        this.$playground.hide();
    }
    show(){
        this.$playground.show();
    }
}
export class Balls_Game {
    constructor(id){
        console.log("create project");
        this.id = id;
        this.$balls_game = $('#' + id);
        //this.menu = new Balls_Game_Menu(this);
        this.playground = new Balls_Game_Playground(this);
    }
}
