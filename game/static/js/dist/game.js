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
class Balls_Game_Playground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div>游戏界面</div>`);
        this.hide();

        this.root.$balls_game.append(this.$playground);

        this.start()
    }
    start(){

    }
    hide(){
        this.$playground.hide();
    }
    show(){
        this.$playground.show();
    }
}
class Balls_Game {
    constructor(id){
        console.log("create project");
        this.id = id;
        this.$balls_game = $('#' + id);
        //this.playground = new Balls_Game_Playground(this);
        this.menu = new Balls_Game_Menu(this);
        this.playground = new Balls_Game_Playground(this);
    }
}
