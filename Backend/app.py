from flask import Flask, request, jsonify
from flask_cors import CORS
from db_operations import DBOperations

app = Flask(__name__)
CORS(app)  # 允许跨域请求
db = DBOperations()

# Coach 相关API
@app.route('/api/coaches', methods=['POST'])
def add_coach():
    data = request.json
    coach_id = db.add_coach(
        name=data['name'],
        place=data['place'],
        phone=data['phone'],
        lesson=data['lesson'],
        age=data.get('age'),
        wechat_id=data.get('wechat_id')
    )
    return jsonify({"id": coach_id}), 201

@app.route('/api/coaches', methods=['GET'])
def get_coaches():
    lesson = request.args.get('lesson')
    coaches = db.get_coaches_by_lesson(lesson) if lesson else []
    return jsonify(coaches)

# Student 相关API
@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.json
    student_id = db.add_student(
        name=data['name'],
        place=data['place'],
        phone=data['phone'],
        lesson=data['lesson'],
        credit=data.get('credit', 0.0),
        age=data.get('age')
    )
    return jsonify({"id": student_id}), 201

@app.route('/api/students/<student_id>/credits', methods=['GET'])
def get_credits(student_id):
    credits = db.get_student_credits(student_id)
    return jsonify({"credits": credits})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)