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
            <div class="balls-game-settings-password balls-game-settings-password-first">
                <div class="balls-game-settings-item">
                    <input type="password" placeholder="密码">
                </div>
            </div>
            <div class="balls-game-settings-password balls-game-settings-password-second">
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
        this.$login = this.$settings.find(".balls-game-settings-login");
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
        this.$register.hide();
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
            outer.login();
        });
        this.$register_submit.click(function(){
            outer.register_on_remote();
        });
    }
    login_on_remote(){ // 在远程服务器登录用户
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        $.ajax({
            url: "http://fovamp.site:7000/settings/login/",
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
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();
        $.ajax({
            url: "http://fovamp.site:7000/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
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
            url: "http://fovamp.site:7000/settings/logout/",
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
            url: "http://fovamp.site:7000/settings/getinfo/",
            type: "GET",
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
