from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player

def register(request):
    data = request.GET
    username = data.get("username")
    password = data.get("password")
    password_confirm = data.get("password_confirm")
    print(username, password, password_confirm)
    if not username or not password:
        return JsonResponse({
            'result': "用户名和密码不能为空",
        })
    if password != password_confirm:
        return JsonResponse({
            'result': "两次密码不一致",
        })
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result': "用户名已存在",
        })
    user = User(username=username)
    user.set_password(password)
    user.save()
    Player.objects.create(user=user, photo="https://tse1-mm.cn.bing.net/th/id/OIP-C.Lycm3YLPdvzMNPeAVbYp5gHaKW?rs=1&pid=ImgDetMain")
    login(request, user)
    return JsonResponse({
        'result': "success",
    })
