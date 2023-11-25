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
    this.hide();
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

        this.has_called_start = false; // 是否执行过start
        this.timedelta = 0; // 距离上一帧的时间间隔(ms)
    }
    start(){ // 第一帧执行一次

    }
    update(){ // 在每一帧都会执行一次

    }
    destroy(){ // 销毁
        this.on_destroy();
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
    last_timestamp = timestamp;
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
        this.playground.$playground.append(this.$canvas);

        this.start();
    }
    start(){

    }
    update(){
        this.render();
    }
    render(){
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    }
}
class Particle extends Balls_Game_Object{
    constructor(playground, x, y, radius, vx, vy, color, speed){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.friction = 0.9;
        this.eps = 1;
    }
    start(){

    }
    update(){
        if(this.speed < this.eps){
            this.destroy();
            return false;
        }
        this.x += this.vx * this.speed * this.timedelta / 1000;
        this.y += this.vy * this.speed * this.timedelta / 1000;
        this.speed *= this.friction;
        this.render();
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends Balls_Game_Object{
    constructor(playground, x, y, radius, color, speed, is_me){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;
        this.cur_skill = null;
    }
    start(){
        if(this.is_me){
            this.add_listening_events();
        }else{
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }
    add_listening_events(){

        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which === 3){
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            }else if(e.which === 1){
                if(outer.cur_skill === "fireball"){
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                    outer.cur_skill = null;
                }
            }
        });
        $(window).keydown(function(e){
            if(e.which === 81){ // q键
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }
    shoot_fireball(tx, ty){
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1.5;
        new FireBall(this.playground, this, x, y, radius, vx, vy, "orange", speed, move_length, this.playground.height * 0.01);
    }
    get_dist(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }
    is_attacked(angle, damage){
        for (let i = 0; i < 10 + Math.random() * 5; i ++ ){
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed);
        }
        this.radius -= damage;
        if(this.radius < 10){
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 1.2;


    }
    update(){
        this.spent_time += this.timedelta;
        if(! this.is_me && this.spent_time > 4000 && Math.random() < 1 / 300.0){
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];

            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(tx, ty);
        }
        if(this.damage_speed > this.eps){
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }else{
            if(this.move_length < this.eps){
                this.move_length = 0;
                this.vx = this.vy = 0;
                if(!this.is_me){
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx,ty);
                }
            }else{
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class FireBall extends Balls_Game_Object {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.player = player;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }
    start(){

    }
    update(){
        if(this.move_length < 10){
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
        for(let i = 0; i < this.playground.players.length; i ++ ){
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)){
                this.attack(player);
            }
        }
        this.render();
    }
    get_dist(x1,y1,x2,y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
    attack(player){
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }
    is_collision(player){
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if(distance < this.radius + player.radius){
            return true;
        }
        return false;
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
<div class="balls-game-playground"></div>
`);
        this.hide();

        this.start()
    }
    get_random_color(){
        let colors = ["blue", "red", "green", "grey", "pink"];
        return colors[Math.floor(Math.random() * 5)];
    }
    start(){


    }
    hide(){
        this.$playground.hide();
    }
    show(){
        this.$playground.show();

        this.root.$balls_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));


        for (let i = 0; i < 5; i ++ ){
            this.players.push(new Player(this,this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }
    }
}
class Settings{
    constructor(root){
        this.root = root;
        this.username = "";
        this.photo = "";
        this.$settings = $(`
        <div class="balls-game-settings">
        <div class="balls-game-settings-login">
            <div class="balls-game-settings-title">
                登录
            </div>
            <div class="balls-game-settings-username">
                <div class="balls-game-settings-item">
                    <input type="text" placeholder="用户名">
                </div>
            </div>
            <div class="balls-game-settings-password">
                <div class="balls-game-settings-item">
                    <input type="password" placeholder="密码">
                </div>
            </div>
            <div class="balls-game-settings-submit">
                <div class="balls-game-settings-item">
                    <button>登录</button>
                </div>
            </div>
            <div class="balls-game-settings-error-message">
            </div>
            <div class="balls-game-settings-option">
                注册
            </div>
            <br>
        </div>
        <div class="balls-game-settings-register">
            <div class="balls-game-settings-title">
                注册
            </div>
            <div class="balls-game-settings-username">
                <div class="balls-game-settings-item">
                    <input type="text" placeholder="用户名">
                </div>
            </div>
            <div class="balls-game-settings-password ac-game-settings-password-first">
                <div class="balls-game-settings-item">
                    <input type="password" placeholder="密码">
                </div>
            </div>
            <div class="balls-game-settings-password ac-game-settings-password-second">
                <div class="balls-game-settings-item">
                    <input type="password" placeholder="确认密码">
                </div>
            </div>
            <div class="balls-game-settings-submit">
                <div class="balls-game-settings-item">
                    <button>注册</button>
                </div>
            </div>
            <div class="balls-game-settings-error-message">
            </div>
            <div class="balls-game-settings-option">
                登录
            </div>
            <br>
        </div>
        </div>`);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".balls-game-settings-username input");
        this.$login_password = this.$login.find(".balls-game-settings-password input");
        this.$login_submit = this.$login.find(".balls-game-settings-submit button");
        this.$login_error_message = this.$login.find(".balls-game-settings-error-message");
        this.$login_register = this.$login.find(".balls-game-settings-option");

        //this.$login.hide();

        this.$register = this.$settings.find(".balls-game-settings-register");
        this.$register_username = this.$register.find(".balls-game-settings-username input");
        this.$register_password = this.$register.find(".balls-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".balls-game-settings-password-second input");
        this.$register_submit = this.$register.find(".balls-game-settings-submit button");
        this.$register_error_message = this.$register.find(".balls-game-settings-error-message");
        this.$register_login = this.$register.find(".balls-game-settings-option");

        //this.$register.hide();
        this.root.$balls_game.append(this.$settings);
        this.start();

    }
    start(){
        this.getinfo();
        this.add_listening_events();
    }
    add_listening_events(){
        this.add_listening_events_login();
        this.add_listening_events_register();
    }
    add_listening_events_login(){
        let outer = this;
        this.$login_register.click(function(){
            outer.register();
        });
        this.$login_submit.click(function(){
            outer.login_on_remote();
        });
    }
    add_listening_events_register(){
        let outer = this;
        this.$register_login.click(function(){
            outer.register();
        });
        this.$register_submit.click(function(){
            outer.login_on_remote();
        });
    }
    login_on_remote(){ // 在远程服务器登录用户
        let outer = this;
        let username = this.$login_username.value();
        let password = this.$login_password.value();
        this.$login_error_message.empty();
        $.ajax({
            url: "http://114.132.43.106:7000/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp){
                if(resp.result === "success"){
                    location.reload();
                }else{
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }
    register_on_remote(){ // 在远程服务器注册
        let outer = this;
        let username = this.$register_username.value();
        let password = this.$register_password.value();
        let password_confirm = this.$register_password_confirm.value();
        this.$register_error_message.empty();
        $.ajax({
            url: "http://114.132.43.106:7000/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: passowrd_confirm,
            },
            success: function(resp){
                if(resp.result === "success"){
                    location.reload();
                }else{
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }
    logout_on_remote(){
        $.ajax({
            url: "http://114.132.43.106:7000/settings/logout/",
            type: "GET",
            success: function(resp){
                if(resp.result === "success"){
                    location.reload();
                }
            }
        });
    }
    getinfo(){
        let outer = this;
        $.ajax({
            url: "http://114.132.43.106:7000/settings/getinfo/",
            type: GET"",
            success: function(resp){
                if(resp.result === "success"){
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                }else{
                    outer.login();
                }
            }
        });
    }
    register(){
        this.$login.hide();
        this.$register.show();
    }
    login(){
        this.$register.hide();
        this.$login.show();
    }
    hide(){
        this.$settings.hide();
    }
    show(){
        this.$settings.show();
    }
}
export class Balls_Game {
    constructor(id){
        console.log("create project");
        this.id = id;
        this.$balls_game = $('#' + id);

        this.settings = new Settings(this);
        this.menu = new Balls_Game_Menu(this);
        this.playground = new Balls_Game_Playground(this);
    }
}
