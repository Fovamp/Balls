class Balls_Game_Menu {
    constructor(root){
        this.root = root;
        this.$menu = $(`
<div class="balls-game-menu">

</div>
`)
    this.root.$balls_game.append(this.$menu);
    }
}
class Balls_Game {
    constructor(id){
        console.log("create project");
        this.id = id;
        this.$balls_game = $('#' + id);
        this.menu = new Balls_Game_Menu(this);
    }
}
