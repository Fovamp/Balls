export class Balls_Game {
    constructor(id){
        this.id = id;
        this.$balls_game = $('#' + id);

        this.settings = new Settings(this);
        this.menu = new Balls_Game_Menu(this);
        this.playground = new Balls_Game_Playground(this);
    }
}
