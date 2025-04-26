// 初始化地图
function initMap() {
    try {
        // 创建地图实例
        var map = new BMap.Map("map");

        // 固定起点和终点为 BMap.Point 对象，使用准确的经纬度
        var startPoint = new BMap.Point(104.157703, 35.935098);
        var endPoint = new BMap.Point(103.819419, 36.044262);

        // 初始化地图，设置中心点坐标和缩放级别
        map.centerAndZoom(startPoint, 12);

        // 启用滚轮缩放
        map.enableScrollWheelZoom();

        // 添加地图控件
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());

        // 添加起点和终点标记
        var startMarker = new BMap.Marker(startPoint);
        var endMarker = new BMap.Marker(endPoint);
        map.addOverlay(startMarker);
        map.addOverlay(endMarker);

        // 添加路线规划
        var driving = new BMap.DrivingRoute(map, {
            renderOptions: {
                map: map,
                autoViewport: true,
                polylineOptions: {
                    strokeColor: "green", // 设置路线颜色为绿色
                    strokeWeight: 5, // 设置路线宽度
                    strokeOpacity: 0.8 // 设置路线透明度
                }
            }
        });
        driving.search(startPoint, endPoint);

        // 添加点击事件
        map.addEventListener('click', function (e) {
            alert('点击位置经纬度: ' + e.point.lng + ', ' + e.point.lat);
        });

        return map;
    } catch (error) {
        console.error('地图初始化过程中出现错误: ', error);
    }
}

// 生成 Canvas 图标
function createCanvasIcon() {
    const canvas = document.createElement('canvas');
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');

    // 绘制三角形
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(30, 30);
    ctx.lineTo(0, 30);
    ctx.closePath();
    ctx.fillStyle = 'blue'; // 设置填充颜色
    ctx.fill();

    return canvas.toDataURL();
}

// 模拟移动函数
function simulateMovement(map, startPoint, endPoint, speed) {
    // 创建用户位置标记，使用 Canvas 生成的图标
    const userIcon = new BMap.Icon(createCanvasIcon(),
        new BMap.Size(30, 30), {
            offset: new BMap.Size(15, 30),
            imageOffset: new BMap.Size(0, 0)
        });
    const userMarker = new BMap.Marker(startPoint, { icon: userIcon });
    map.addOverlay(userMarker);

    // 获取路线规划结果
    const driving = new BMap.DrivingRoute(map, {
        renderOptions: {
            map: map,
            autoViewport: true,
            polylineOptions: {
                strokeColor: "green", // 设置路线颜色为绿色
                strokeWeight: 5, // 设置路线宽度
                strokeOpacity: 0.8 // 设置路线透明度
            }
        },
        onSearchComplete: function (results) {
            if (driving.getStatus() === BMAP_STATUS_SUCCESS) {
                const plan = results.getPlan(0);
                const route = plan.getRoute(0);
                const path = route.getPath();

                let currentIndex = 0;

                const interval = setInterval(() => {
                    if (currentIndex >= path.length - 1) {
                        clearInterval(interval);
                        // 显示图片特效
                        showSpecialEffect();
                        return;
                    }

                    // 移动到下一个路径点
                    currentIndex++;
                    const currentPoint = path[currentIndex];

                    // 移动用户标记
                    userMarker.setPosition(currentPoint);
                }, 1000 / speed);
            } else {
                console.error('搜索路线失败，错误码: ', driving.getStatus());
            }
        }
    });

    driving.search(startPoint, endPoint);
}

// 特效函数，显示图片
function showSpecialEffect() {
    const specialEffectImg = document.getElementById('special-effect-img');
    specialEffectImg.style.display = 'block';
    // 你可以在这里添加更多的样式或者动画效果，比如淡入淡出等
}

// 页面加载完成后初始化地图
window.onload = function () {
    var map = initMap();

    // 创建开始按钮
    var btn = document.createElement('button');
    btn.textContent = '开始移动';
    btn.style.position = 'absolute';
    btn.style.top = '60px';
    btn.style.left = '10px';
    btn.style.zIndex = '1000';
    btn.style.padding = '5px 10px';
    document.body.appendChild(btn);

    // 固定起点和终点为 BMap.Point 对象，使用准确的经纬度
    var startPoint = new BMap.Point(104.157703, 35.935098);
    var endPoint = new BMap.Point(103.819419, 36.044262);

    // 添加图片元素
    const specialEffectImg = document.createElement('img');
    specialEffectImg.id = 'special-effect-img';
    specialEffectImg.src = '3.gif'; // 请替换为实际的图片 URL
    specialEffectImg.style.display = 'none';
    specialEffectImg.style.position = 'fixed';
    specialEffectImg.style.top = '50%';
    specialEffectImg.style.left = '50%';
    specialEffectImg.style.transform = 'translate(-50%, -50%)';
    specialEffectImg.style.zIndex = '1001';
    document.body.appendChild(specialEffectImg);

    // 添加按钮点击事件
    btn.addEventListener('click', function () {
        // 禁用按钮避免重复点击
        btn.disabled = true;
        // 模拟10km/s的移动
        simulateMovement(map, startPoint, endPoint, 100);
    });
};    