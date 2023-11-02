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
