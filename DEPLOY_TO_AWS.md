# AWS EC2 部署指南 (针对中国访问优化)

本指南将帮助你将项目部署到 AWS EC2 上，并确保中国用户可以顺利访问。

## 1. 准备工作

### 1.1 注册/登录 AWS
访问 [AWS Console](https://aws.amazon.com/console/) 并登录。如果是新用户，你将拥有 12 个月的免费套餐 (Free Tier)。

### 1.2 创建 EC2 实例 (虚拟机)
1.  **切换区域 (Region)**: 在右上角选择 **Tokyo (东京)** 或 **Singapore (新加坡)**。
    *   *重要*: 这两个区域离中国最近，访问速度最快。不要选美国区域。
2.  点击 **Launch Instances (启动实例)**。
3.  **Name**: 输入 `WebHosting-Server`。
4.  **OS (操作系统)**: 选择 **Ubuntu** (Server 22.04 LTS 或 24.04 LTS)。
5.  **Instance Type**: 选择 **t2.micro** 或 **t3.micro** (标有 Free tier eligible)。
6.  **Key Pair (密钥对)**:
    *   点击 "Create new key pair"。
    *   Type: RSA。
    *   Format: `.pem` (如果你用 Mac/Linux/Win10+ PowerShell) 或 `.ppk` (如果你用 PuTTY)。
    *   下载并保存好这个文件！(例如 `myserver.pem`)。
7.  **Network Settings (网络设置)**:
    *   点击 "Edit"。
    *   确保 "Auto-assign public IP" 是 Enable。
    *   **Security Group (防火墙)**:
        *   添加规则: Allow SSH (Port 22) from Anywhere (0.0.0.0/0).
        *   添加规则: Allow HTTP (Port 80) from Anywhere.
        *   添加规则: Allow HTTPS (Port 443) from Anywhere.
        *   添加规则: Custom TCP (Port **4000**) from Anywhere (这是我们的应用端口).
8.  **Storage (存储)**: 免费套餐通常包含 30GB EBS。默认 8GB 可能有点小，建议改为 20GB。
9.  点击 **Launch Instance**。

## 2. 连接服务器

1.  找到你实例的 **Public IPv4 address** (例如 `13.123.45.67`)。
2.  打开你电脑的终端 (Terminal 或 PowerShell)。
3.  定位到你下载 `.pem` 密钥的目录。
4.  连接命令:
    ```bash
    # 如果是 Linux/Mac，先给密钥权限
    chmod 400 myserver.pem
    
    # 连接 (ubuntu 是默认用户名)
    ssh -i "myserver.pem" ubuntu@13.123.45.67
    ```

## 3. 服务器环境配置

连接成功后，在服务器终端依次运行以下命令：

```bash
# 1. 更新系统
sudo apt update

# 2. 安装 Node.js (版本 18 或 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. 安装 PM2 (进程管理工具，让程序后台运行)
sudo npm install -g pm2

# 4. (可选) 安装 Git (通常自带)
sudo apt install git
```

## 4. 部署代码

### 方法 A: 使用 Git (推荐)
你需要先把本地代码推送到 GitHub/GitLab。
```bash
# 在服务器上
git clone https://github.com/你的用户名/你的仓库名.git web2
cd web2
```

### 方法 B: 直接上传 (如果不方便用 Git)
你可以使用 `scp` 命令从本地上传代码到服务器：
```bash
# 在本地电脑终端运行 (不是服务器终端)
# 把当前目录下的 web2 文件夹上传到服务器的 home 目录
scp -i "myserver.pem" -r ./web2 ubuntu@13.123.45.67:~/web2
```

## 5. 编译与启动

在服务器的 `web2` 目录下：

```bash
# 1. 安装依赖 (前端+后端)
npm install
cd client && npm install && cd ../server && npm install && cd ..

# 2. 编译项目 (这一步会生成 client/dist 和 server/dist)
npm run build

# 3. 启动服务 (使用 PM2 后台运行)
cd server
pm2 start dist/index.js --name "web-hosting"

# 4. 查看状态
pm2 status
pm2 logs web-hosting
```

现在，你应该可以通过浏览器访问了：
`http://13.123.45.67:4000`

## 6. (进阶) 使用 Nginx 去掉端口号

为了让用户直接访问 `http://13.123.45.67` (不用输 :4000)：

```bash
# 1. 安装 Nginx
sudo apt install nginx -y

# 2. 配置转发
sudo nano /etc/nginx/sites-available/default
```

将文件内容修改为：
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

保存并退出 (Ctrl+O, Enter, Ctrl+X)。

```bash
# 3. 重启 Nginx
sudo systemctl restart nginx
```

现在直接访问 IP 即可！
