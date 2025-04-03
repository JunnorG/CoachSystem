## Preparation
1. pip install -r requirements.txt

## Install the server
1. Install the Windows MySql
2. Create Table in the MYSQL
   ```
    mysql -u root -p
    CREATE DATABASE coach_system;
    USE coach_system;
   -- 教练表
    CREATE TABLE Coach (
        Id VARCHAR(36) PRIMARY KEY,
        Name VARCHAR(50) NOT NULL,
        Place VARCHAR(100) NOT NULL,
        Age INT,
        Phone VARCHAR(20) NOT NULL,
        WeChatId VARCHAR(50),
        Lesson VARCHAR(30) NOT NULL
    );
    
    -- 学生表
    CREATE TABLE Student (
        Id VARCHAR(36) PRIMARY KEY,
        Name VARCHAR(50) NOT NULL,
        Place VARCHAR(100) NOT NULL,
        Age INT,
        Phone VARCHAR(20) NOT NULL,
        Credit DECIMAL(10,2) DEFAULT 0.00,
        Lesson VARCHAR(30) NOT NULL
    );
    ```
3. Start up python server
   `python app.py`
4. Test API (we could use `apifox` to manage our API requests)
   ```commandline
   # 添加教练
   curl -X POST http://localhost:5000/api/coaches \
   -H "Content-Type: application/json" \
   -d '{"name":"王教练","place":"朝阳网球中心","phone":"13800138000","lesson":"网球","age":35}'
   
   # 查询网球教练
   curl http://localhost:5000/api/coaches?lesson=网球
   
   # 添加学生
   curl -X POST http://localhost:5000/api/students \
   -H "Content-Type: application/json" \
   -d '{"name":"张三","place":"朝阳网球中心","phone":"13900139000","lesson":"网球","credit":10.0}'
   
   # 查询学生课时
   curl http://localhost:5000/api/students/学生ID/credits
   ```