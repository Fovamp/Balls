class Balls_Game_Playground {
    constructor(root){
        this.root = root;
        this.$playground = $(`
<div class="balls-game-playground">游戏界面</div>
`);
        this.hide();

        this.root.$balls_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
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
