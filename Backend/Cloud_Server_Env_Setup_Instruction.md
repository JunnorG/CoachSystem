## Deployed on Cloud with SSL cert
1. Request certificate, take Tecent Cloud as an example: https://cloud.tencent.com/document/product/1207/47027. We could request Free certs.
2. Download cert and private key and load them on server. e.g., I put them under `/home/ubuntu/`
   Here's my cert and key path exmaple: `/home/ubuntu/easybooking.fun_bundle.crt`,  `/home/ubuntu/easybooking.fun.key`
3. Start your flask app.
   ```commandline
   sudo apt install -y python3 python3-pip python3-venv nginx
   mkdir ~/flaskapp
   cd ~/flaskapp
   python3 -m venv venv
   source venv/bin/activate
   python app.py
   ```
4. create config for Nginx. Nginx here is regard as 反向代理 which could help to do https verification.
5. sudo vi /etc/nginx/sites-available/flaskapp. You may need to update your dns here `easybooking.fun` and update the your ssl certificate and key path.
   ```
   server {
    listen 80;
    server_name easybooking.fun www.easybooking.fun;
    return 301 https://$host$request_uri;
   }
   
   server {
       listen 443 ssl;
       server_name easybooking.fun www.easybooking.fun;
   
       ssl_certificate /home/ubuntu/easybooking.fun_bundle.crt;
       ssl_certificate_key /home/ubuntu/easybooking.fun.key;
   
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_prefer_server_ciphers on;
       ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
   
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
6. Apply the configuration of Nginx
   ```
   sudo ln -s /etc/nginx/sites-available/flaskapp /etc/nginx/sites-enabled
   sudo nginx -t  # 测试配置是否正确
   sudo systemctl restart nginx
   ```
7. Create system service
   ```
   sudo vi /etc/systemd/system/flaskapp.service
   ```
   ```
   [Unit]
   Description=Gunicorn instance to serve Flask app
   After=network.target
   
   [Service]
   User=yourusername
   Group=www-data
   WorkingDirectory=/home/yourusername/flaskapp
   Environment="PATH=/home/yourusername/flaskapp/venv/bin"
   ExecStart=/home/yourusername/flaskapp/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
   
   [Install]
   WantedBy=multi-user.target
   ```
8. Start the service of your own. You don't need to start flask by yourself, because you already add flask startup into nginx config. 
   ```
   sudo systemctl daemon-reload
   sudo systemctl start flaskapp
   sudo systemctl enable flaskapp
   ```
9. You should access your service with https now.
   `https://easybooking.fun`
   

## MySql install and initialization

```commandline
sudo apt install mysql-server
sudo systemctl status mysql # check mysql start or not

# if not start, we can start manually
sudo systemctl start mysql
sudo systemctl enable mysql 

sudo mysql -u root -p # password is empty by default
```

then do mysql query to create your database, table.