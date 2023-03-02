let student1 = new Student('Max');
let student2 = new Student('Jan');
let student3 = new Student('Heinrich');
let students = [student1, student2, student3];
student1.note = 3;
student2.note = 5;
student3.note = 1;

console.log(students.map(s => s.toString()));

sort_fn = (studentA, studentB) => studentA.note - studentB.note;
students.sort(sort_fn);
console.log(students.map(s => s.toString()));

function createStudentFactory(note) {
    return function (name) {
        student = new Student(name);
        student.note = note;
        return student;
    };
}

let studentFactory = createStudentFactory(5);
students5 = ['Anton', 'Klaus', 'Julius'].map(name => studentFactory(name));
console.log(students5.map(s => s.toString()));
