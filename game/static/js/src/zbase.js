class Balls_Game {
    constructor(id){
        console.log("create project");
        this.id = id;
        this.$balls_game = $('#' + id);
        this.menu = new Balls_Game_Menu(this);
    }
}
