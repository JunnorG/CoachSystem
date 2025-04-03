import mysql.connector
from mysql.connector import Error
import uuid


class DBOperations:
    def __init__(self):
        self.connection = self.create_connection()

    def create_connection(self):
        try:
            connection = mysql.connector.connect(
                host='localhost',
                user='root',
                password='951102',
                database='coach_system'
            )
            return connection
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            return None

    # Coach 表操作
    def add_coach(self, name, place, phone, lesson, age=None, wechat_id=None):
        coach_id = str(uuid.uuid4())
        query = """
        INSERT INTO Coach (Id, Name, Place, Age, Phone, WeChatId, Lesson)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, (coach_id, name, place, age, phone, wechat_id, lesson))
            self.connection.commit()
            return coach_id
        except Error as e:
            print(f"Error adding coach: {e}")
            return None

    def get_coaches_by_lesson(self, lesson):
        query = "SELECT * FROM Coach WHERE Lesson = %s"
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, (lesson,))
            return cursor.fetchall()
        except Error as e:
            print(f"Error fetching coaches: {e}")
            return []

    # Student 表操作
    def add_student(self, name, place, phone, lesson, credit=0.0, age=None):
        student_id = str(uuid.uuid4())
        query = """
        INSERT INTO Student (Id, Name, Place, Age, Phone, Credit, Lesson)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, (student_id, name, place, age, phone, credit, lesson))
            self.connection.commit()
            return student_id
        except Error as e:
            print(f"Error adding student: {e}")
            return None

    def get_student_credits(self, student_id):
        query = "SELECT Credit FROM Student WHERE Id = %s"
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, (student_id,))
            result = cursor.fetchone()
            return result[0] if result else None
        except Error as e:
            print(f"Error getting credits: {e}")
            return None

    def close(self):
        if self.connection:
            self.connection.close()