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
